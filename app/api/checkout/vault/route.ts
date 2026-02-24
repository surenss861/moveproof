import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const { interval, userId, userEmail } = await req.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 502 });
    }

    const priceId =
      interval === "year"
        ? process.env.STRIPE_PRICE_VAULT_ANNUAL
        : process.env.STRIPE_PRICE_VAULT_MONTHLY;

    if (!priceId) {
      return NextResponse.json({ error: "Price not configured" }, { status: 502 });
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const origin = req.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: userEmail || undefined,
      metadata: { user_id: userId },
      success_url: `${origin}/dashboard?vault=success`,
      cancel_url: `${origin}/#pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
