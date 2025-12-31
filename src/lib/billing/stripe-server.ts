import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
    throw new Error('STRIPE_SECRET_KEY is missing from environment variables');
}

// Initialize Stripe with the secret key
// In development, if the key is missing, we use a fallback to prevent the app from crashing during build
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key', {
    // @ts-ignore - Using latest version
    apiVersion: '2023-10-16',
    appInfo: {
        name: 'DigitalMEng',
        version: '0.1.0',
    },
});

export default stripe;
