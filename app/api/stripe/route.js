import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ GET = verify session after payment
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        error: "Payment not completed",
        payment_status: session.payment_status
      }, { status: 402 });
    }

    return NextResponse.json({
      success: true,
      metadata: session.metadata,
      payment_details: {
        amount: session.amount_total / 100,
        currency: session.currency
      }
    });

  } catch (error) {
    return NextResponse.json({
      error: error.message || "Payment verification failed",
      code: error.code || 'verification_error'
    }, { status: 500 });
  }
}

// ✅ POST = create checkout session
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.price || !body.user_id || !body.travel_id || !body.seats) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Bus Booking - ${body.travel_id}`,
            description: `${body.seats} seat(s)`
          },
          unit_amount: Math.round(body.price * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/successPay?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booknow/${body.travel_id}`,
      metadata: {
        travel_id: body.travel_id,
        user_id: body.user_id,
        seats: body.seats,
        price: body.price
      },
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id
    });

  } catch (error) {
    return NextResponse.json({
      error: error.message || "Payment processing failed"
    }, { status: 500 });
  }
}
