import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const { priceId, customerEmail, successUrl, cancelUrl } = await req.json();
    const id = priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY;
    if (!id || !process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 502 }
      );
    }
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: id, quantity: 1 }],
      customer_email: customerEmail || undefined,
      success_url: successUrl || `${req.nextUrl.origin}/dashboard?sub=success`,
      cancel_url: cancelUrl || `${req.nextUrl.origin}/dashboard`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
