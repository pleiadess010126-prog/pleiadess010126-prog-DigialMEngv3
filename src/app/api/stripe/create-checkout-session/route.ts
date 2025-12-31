import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/billing/stripe-server';

// This is a placeholder API route for Stripe checkout session creation
// In production, you would use the actual Stripe SDK here

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { priceId, successUrl, cancelUrl, customerId, metadata } = body;

        // Validate required fields
        if (!priceId || !successUrl || !cancelUrl) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // In production or if keys are provided, use Stripe
        if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock')) {
            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                success_url: successUrl,
                cancel_url: cancelUrl,
                customer: customerId,
                metadata: {
                    ...metadata,
                    source: 'digital-meng-app',
                },
                subscription_data: {
                    metadata: {
                        ...metadata,
                        source: 'digital-meng-app',
                    },
                },
                allow_promotion_codes: true,
                billing_address_collection: 'auto',
            });

            return NextResponse.json({
                id: session.id,
                url: session.url,
            });
        }

        // For demo purposes when keys aren't set, return a mock response
        console.warn('Stripe key missing or mock. Returning demo session.');
        return NextResponse.json({
            id: `cs_demo_${Date.now()}`,
            url: successUrl, // In demo, just redirect to success URL
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
