import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });

    // Add more detailed validation
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { 
          error: "Payment not completed",
          payment_status: session.payment_status
        },
        { status: 402 }
      );
    }

    // Return all necessary data for booking creation
    return NextResponse.json({
      success: true,
      metadata: session.metadata,
      payment_details: {
        amount: session.amount_total / 100,
        currency: session.currency
      }
    });

  } catch (error) {
    console.error('Stripe verification error:', error);
    return NextResponse.json(
      { 
        error: error.message || "Payment verification failed",
        code: error.code || 'verification_error'
      },
      { status: 500 }
    );
  }
}