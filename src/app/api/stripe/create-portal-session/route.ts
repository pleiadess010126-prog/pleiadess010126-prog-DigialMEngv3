import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/billing/stripe-server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { customerId } = body;

        if (!customerId) {
            return NextResponse.json(
                { error: 'Customer ID is required' },
                { status: 400 }
            );
        }

        // In production, use Stripe Billing Portal
        if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock')) {
            const session = await stripe.billingPortal.sessions.create({
                customer: customerId,
                return_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard`,
            });

            return NextResponse.json({
                url: session.url,
            });
        }

        // For demo purposes
        return NextResponse.json({
            url: '/dashboard', // Fallback for demo
        });
    } catch (error) {
        console.error('Error creating portal session:', error);
        return NextResponse.json(
            { error: 'Failed to create portal session' },
            { status: 500 }
        );
    }
}
