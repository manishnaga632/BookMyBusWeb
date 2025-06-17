import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Shared error response function
const errorResponse = (message, status = 400) => {
  return NextResponse.json({ error: message }, { status });
};

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate required fields
    const requiredFields = ['price', 'user_id', 'travel_id', 'seats'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return errorResponse(`Missing fields: ${missingFields.join(', ')}`);
    }

    // Get base URL with fallbacks
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Bus Booking - ${body.travel_id}`,
            description: `${body.seats} seat(s) from ${body.from_location} to ${body.to_location}`
          },
          unit_amount: Math.round(body.price * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      metadata: body,
      success_url: `${cleanBaseUrl}/successPay?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cleanBaseUrl}/booknow/${body.travel_id}`,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL");
    }

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id
    });

  } catch (error) {
    console.error('Stripe error:', error);
    return errorResponse(error.message || "Payment processing failed", 500);
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return errorResponse("Session ID is required");
    }

    // Retrieve session with all necessary data
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'line_items']
    });

    // Verify payment was successful
    if (session.payment_status !== 'paid') {
      return errorResponse("Payment not completed", 402);
    }

    return NextResponse.json({
      success: true,
      payment_status: session.payment_status,
      amount_total: session.amount_total / 100,
      currency: session.currency,
      metadata: session.metadata
    });

  } catch (error) {
    console.error('Stripe verification error:', error);
    return errorResponse(error.message || "Payment verification failed", 500);
  }
}