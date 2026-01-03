// =================================================================
// ENVIRONMENT CONFIGURATION
// Centralized configuration with validation
// =================================================================

/**
 * Environment types
 */
export type Environment = 'development' | 'staging' | 'production';

/**
 * Get current environment
 */
export function getEnvironment(): Environment {
    const nodeEnv = process.env.NODE_ENV;

    if (nodeEnv === 'production') {
        // Check for staging indicator
        if (process.env.VERCEL_ENV === 'preview' || process.env.STAGING === 'true') {
            return 'staging';
        }
        return 'production';
    }

    return 'development';
}

/**
 * Environment checks
 */
export const env = {
    isDevelopment: getEnvironment() === 'development',
    isStaging: getEnvironment() === 'staging',
    isProduction: getEnvironment() === 'production',
    current: getEnvironment(),
};

/**
 * Required environment variables validation
 */
interface EnvSchema {
    // App
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_APP_NAME: string;

    // AWS
    AWS_REGION: string;
    CUSTOM_AWS_ACCESS_KEY_ID?: string;
    CUSTOM_AWS_SECRET_ACCESS_KEY?: string;

    // Cognito
    NEXT_PUBLIC_COGNITO_USER_POOL_ID?: string;
    NEXT_PUBLIC_COGNITO_CLIENT_ID?: string;
    NEXT_PUBLIC_COGNITO_REGION?: string;

    // DynamoDB
    DYNAMODB_CAMPAIGNS_TABLE?: string;
    DYNAMODB_CONTENT_TABLE?: string;
    DYNAMODB_PILLARS_TABLE?: string;

    // S3
    S3_BUCKET_NAME?: string;

    // AI
    OPENAI_API_KEY?: string;
    ANTHROPIC_API_KEY?: string;

    // Security
    JWT_SECRET: string;

    // Optional
    REDIS_URL?: string;
    CDN_URL?: string;
    SENTRY_DSN?: string;
    STRIPE_SECRET_KEY?: string;
}

/**
 * Configuration with defaults
 */
export const config = {
    // App
    app: {
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        name: process.env.NEXT_PUBLIC_APP_NAME || 'DigitalMEng',
        version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    },

    // AWS General
    aws: {
        region: process.env.AWS_REGION || process.env.CUSTOM_AWS_REGION || 'us-east-1',
        accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
    },

    // Cognito
    cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
        clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
        region: process.env.NEXT_PUBLIC_COGNITO_REGION || 'us-east-1',
        get isConfigured() {
            return !!(this.userPoolId && this.clientId);
        },
    },

    // DynamoDB
    dynamodb: {
        campaignsTable: process.env.DYNAMODB_CAMPAIGNS_TABLE || 'DigitalMEng-Campaigns',
        contentTable: process.env.DYNAMODB_CONTENT_TABLE || 'DigitalMEng-ContentItems',
        pillarsTable: process.env.DYNAMODB_PILLARS_TABLE || 'DigitalMEng-TopicPillars',
        tablePrefix: process.env.DYNAMODB_TABLE_PREFIX || 'digitalmeng_',
    },

    // S3
    s3: {
        bucket: process.env.S3_BUCKET_NAME || 'digitalmeng-media',
        cdn: process.env.CDN_URL,
    },

    // AI Providers
    ai: {
        openai: {
            apiKey: process.env.OPENAI_API_KEY,
            get isConfigured() {
                return !!this.apiKey;
            },
        },
        anthropic: {
            apiKey: process.env.ANTHROPIC_API_KEY,
            get isConfigured() {
                return !!this.apiKey;
            },
        },
        elevenlabs: {
            apiKey: process.env.ELEVENLABS_API_KEY,
            defaultVoiceId: process.env.ELEVENLABS_DEFAULT_VOICE_ID,
            get isConfigured() {
                return !!this.apiKey;
            },
        },
    },

    // Security
    security: {
        jwtSecret: process.env.JWT_SECRET || 'development-secret-change-in-production',
        sessionCookieName: process.env.SESSION_COOKIE_NAME || 'session_token',
        sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE || '604800', 10), // 7 days
    },

    // Rate Limiting
    rateLimit: {
        api: parseInt(process.env.RATE_LIMIT_API || '100', 10),
        auth: parseInt(process.env.RATE_LIMIT_AUTH || '10', 10),
        generate: parseInt(process.env.RATE_LIMIT_GENERATE || '20', 10),
        publish: parseInt(process.env.RATE_LIMIT_PUBLISH || '30', 10),
    },

    // CORS
    cors: {
        allowedOrigins: (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000')
            .split(',')
            .map(origin => origin.trim()),
    },

    // Redis/Cache
    cache: {
        redisUrl: process.env.REDIS_URL,
        get isRedisConfigured() {
            return !!this.redisUrl;
        },
    },

    // Stripe
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        get isConfigured() {
            return !!this.secretKey;
        },
    },

    // Analytics
    analytics: {
        googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        sentryDsn: process.env.SENTRY_DSN,
    },

    // Feature Flags
    features: {
        demoMode: process.env.DEMO_MODE === 'true',
        debug: process.env.DEBUG === 'true',
    },
};

/**
 * Validate critical environment variables
 */
export function validateEnv(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required in production
    if (env.isProduction) {
        if (!config.security.jwtSecret || config.security.jwtSecret.includes('development')) {
            errors.push('JWT_SECRET must be set to a secure value in production');
        }

        if (!config.cognito.isConfigured && !config.features.demoMode) {
            errors.push('Cognito must be configured in production (or enable DEMO_MODE)');
        }

        if (config.cors.allowedOrigins.includes('localhost')) {
            errors.push('Remove localhost from CORS_ALLOWED_ORIGINS in production');
        }
    }

    // Warnings (not errors)
    const warnings: string[] = [];

    if (!config.ai.openai.isConfigured && !config.ai.anthropic.isConfigured) {
        warnings.push('No AI provider configured (OpenAI or Anthropic)');
    }

    if (!config.cache.isRedisConfigured && env.isProduction) {
        warnings.push('Redis not configured - using in-memory cache (not suitable for multi-instance)');
    }

    if (!config.stripe.isConfigured) {
        warnings.push('Stripe not configured - billing features disabled');
    }

    // Log warnings
    warnings.forEach(w => console.warn('[Config Warning]', w));

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Get a required environment variable (throws if missing)
 */
export function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

/**
 * Get an optional environment variable with default
 */
export function getEnv(key: string, defaultValue: string = ''): string {
    return process.env[key] || defaultValue;
}

/**
 * Get environment variable as number
 */
export function getEnvNumber(key: string, defaultValue: number): number {
    const value = process.env[key];
    if (!value) return defaultValue;

    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) return defaultValue;

    return parsed;
}

/**
 * Get environment variable as boolean
 */
export function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = process.env[key];
    if (!value) return defaultValue;

    return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Print configuration summary (for debugging)
 */
export function printConfigSummary(): void {
    console.log('\n=== DigitalMEng Configuration ===');
    console.log(`Environment: ${env.current}`);
    console.log(`App URL: ${config.app.url}`);
    console.log(`AWS Region: ${config.aws.region}`);
    console.log(`Cognito Configured: ${config.cognito.isConfigured}`);
    console.log(`OpenAI Configured: ${config.ai.openai.isConfigured}`);
    console.log(`Anthropic Configured: ${config.ai.anthropic.isConfigured}`);
    console.log(`Redis Configured: ${config.cache.isRedisConfigured}`);
    console.log(`Stripe Configured: ${config.stripe.isConfigured}`);
    console.log(`Demo Mode: ${config.features.demoMode}`);
    console.log('================================\n');
}

export default config;
