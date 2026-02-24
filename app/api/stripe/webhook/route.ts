import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { upsertEntitlement } from "@/lib/db/entitlements";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
});

async function handleSubscription(
  sub: Stripe.Subscription,
  userId: string
): Promise<void> {
  const item = sub.items.data[0];
  const interval = item?.price.recurring?.interval ?? null; // 'month' | 'year'

  await upsertEntitlement(userId, {
    plan: "vault",
    status: sub.status === "active" ? "active" : sub.status === "past_due" ? "past_due" : "canceled",
    interval,
    stripe_price_id: item?.price.id ?? null,
    stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null,
    stripe_subscription_id: sub.id,
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    cancel_at_period_end: sub.cancel_at_period_end,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? "");
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        if (!userId) break;

        if (session.mode === "subscription" && typeof session.subscription === "string") {
          const sub = await stripe.subscriptions.retrieve(session.subscription);
          await handleSubscription(sub, userId);
        } else if (session.mode === "payment") {
          // One-time pack purchase
          await upsertEntitlement(userId, {
            plan: "one_time_pack",
            status: "active",
            interval: null,
            stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
            customer_email: session.customer_email ?? null,
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (!userId) break;
        await handleSubscription(sub, userId);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (!userId) break;
        await upsertEntitlement(userId, {
          plan: "vault",
          status: "canceled",
          stripe_subscription_id: sub.id,
          cancel_at_period_end: false,
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = typeof invoice.subscription === "string" ? invoice.subscription : null;
        if (!subId) break;
        // Look up the subscription to get user_id from metadata
        const sub = await stripe.subscriptions.retrieve(subId);
        const userId = sub.metadata?.user_id;
        if (!userId) break;
        await upsertEntitlement(userId, {
          status: "past_due",
          stripe_subscription_id: subId,
        });
        break;
      }

      default:
        // Unhandled event type — ignore
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
