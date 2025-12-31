import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/billing/stripe-server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature && process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        let event: any;

        // In production/staged, verify the webhook signature
        if (process.env.STRIPE_WEBHOOK_SECRET && signature) {
            try {
                event = stripe.webhooks.constructEvent(
                    body,
                    signature,
                    process.env.STRIPE_WEBHOOK_SECRET
                );
            } catch (err: any) {
                console.error('Webhook signature verification failed:', err.message);
                return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
            }
        } else {
            // Demo mode or missing secret - just parse the body
            console.warn('Stripe webhook secret missing. Operating in insecure demo mode.');
            event = JSON.parse(body);
        }

        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                console.log('Checkout completed:', session.id);
                // Update user's subscription in database
                // await updateUserSubscription(session.customer, session.subscription, session.metadata);
                break;
            }

            case 'customer.subscription.created': {
                const subscription = event.data.object;
                console.log('Subscription created:', subscription.id);
                // Create subscription record in database
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                console.log('Subscription updated:', subscription.id);
                // Update subscription record in database
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                console.log('Subscription deleted:', subscription.id);
                // Downgrade user to free plan
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object;
                console.log('Payment succeeded:', invoice.id);
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                console.log('Payment failed:', invoice.id);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}
