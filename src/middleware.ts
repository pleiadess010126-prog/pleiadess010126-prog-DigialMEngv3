import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// =================================================================
// PRODUCTION MIDDLEWARE
// Handles: Rate Limiting, CORS, Auth Protection, Security Headers
// =================================================================

// In-memory rate limiting store (use Redis in production for multi-instance)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration per endpoint type
const RATE_LIMITS = {
    api: { requests: 100, windowMs: 60 * 1000 }, // 100 requests/minute for API
    auth: { requests: 10, windowMs: 60 * 1000 }, // 10 requests/minute for auth (brute force protection)
    generate: { requests: 20, windowMs: 60 * 1000 }, // 20 requests/minute for AI generation
    publish: { requests: 30, windowMs: 60 * 1000 }, // 30 requests/minute for publishing
};

// Protected routes that require authentication
const PROTECTED_ROUTES = [
    '/dashboard',
    '/admin',
    '/api/campaigns',
    '/api/content',
    '/api/generate',
    '/api/publish',
    '/api/organizations',
    '/affiliate',
    '/cxo',
    '/organization',
];

// Public routes that don't require auth
const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/signup',
    '/pricing',
    '/api/auth',
    '/api/detect-language',
    '/api/stripe/webhook',
    '/api/health',
];

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://digitalme.ng',
    'https://www.digitalme.ng',
    'https://app.digitalme.ng',
    process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean);

/**
 * Get client IP from request
 */
function getClientIP(request: NextRequest): string {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }
    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }
    return 'unknown';
}

/**
 * Rate limiting check
 */
function checkRateLimit(ip: string, endpoint: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const key = `${ip}:${endpoint}`;

    // Determine rate limit based on endpoint
    let limit = RATE_LIMITS.api;
    if (endpoint.includes('/auth')) {
        limit = RATE_LIMITS.auth;
    } else if (endpoint.includes('/generate')) {
        limit = RATE_LIMITS.generate;
    } else if (endpoint.includes('/publish')) {
        limit = RATE_LIMITS.publish;
    }

    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
        // New window
        rateLimitStore.set(key, { count: 1, resetTime: now + limit.windowMs });
        return { allowed: true, remaining: limit.requests - 1, resetTime: now + limit.windowMs };
    }

    if (record.count >= limit.requests) {
        return { allowed: false, remaining: 0, resetTime: record.resetTime };
    }

    record.count++;
    return { allowed: true, remaining: limit.requests - record.count, resetTime: record.resetTime };
}

/**
 * Verify JWT token from cookie
 */
function verifyAuth(request: NextRequest): { authenticated: boolean; userId?: string } {
    const accessToken = request.cookies.get('access_token')?.value;
    const sessionToken = request.cookies.get('session_token')?.value;

    // Check for session token (for demo/development)
    if (sessionToken) {
        try {
            const session = JSON.parse(atob(sessionToken));
            if (session.exp && session.exp > Date.now()) {
                return { authenticated: true, userId: session.userId };
            }
        } catch {
            // Invalid session token
        }
    }

    // Check for Cognito access token
    if (accessToken) {
        // In production, verify JWT signature with Cognito public keys
        // For now, just check if token exists and is not expired
        try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            if (payload.exp && payload.exp * 1000 > Date.now()) {
                return { authenticated: true, userId: payload.sub };
            }
        } catch {
            // Invalid token
        }
    }

    return { authenticated: false };
}

/**
 * Check if route is protected
 */
function isProtectedRoute(pathname: string): boolean {
    // Check if it's explicitly public
    if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
        return false;
    }

    // Check if it's protected
    return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Add security headers
 */
function addSecurityHeaders(response: NextResponse): void {
    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY');

    // XSS Protection
    response.headers.set('X-XSS-Protection', '1; mode=block');

    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');

    // Referrer policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Content Security Policy (relaxed for development)
    if (process.env.NODE_ENV === 'production') {
        response.headers.set(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.amazonaws.com https://*.stripe.com;"
        );
    }

    // HSTS for production
    if (process.env.NODE_ENV === 'production') {
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
}

/**
 * Handle CORS
 */
function handleCORS(request: NextRequest, response: NextResponse): void {
    const origin = request.headers.get('origin');

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
}

/**
 * Main middleware function
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const ip = getClientIP(request);

    // Skip middleware for static files and Next.js internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    // Handle OPTIONS preflight requests
    if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 204 });
        handleCORS(request, response);
        return response;
    }

    // Rate limiting for API routes
    if (pathname.startsWith('/api')) {
        const rateLimit = checkRateLimit(ip, pathname);

        if (!rateLimit.allowed) {
            const response = NextResponse.json(
                {
                    error: 'Too Many Requests',
                    message: 'Rate limit exceeded. Please try again later.',
                    retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
                },
                { status: 429 }
            );
            response.headers.set('Retry-After', String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)));
            response.headers.set('X-RateLimit-Limit', '100');
            response.headers.set('X-RateLimit-Remaining', '0');
            response.headers.set('X-RateLimit-Reset', String(rateLimit.resetTime));
            return response;
        }
    }

    // Authentication check for protected routes
    if (isProtectedRoute(pathname)) {
        const auth = verifyAuth(request);

        if (!auth.authenticated) {
            // For API routes, return 401
            if (pathname.startsWith('/api')) {
                return NextResponse.json(
                    {
                        error: 'Unauthorized',
                        message: 'Authentication required',
                    },
                    { status: 401 }
                );
            }

            // For pages, redirect to login
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Add user ID to headers for downstream use
        const response = NextResponse.next();
        response.headers.set('X-User-ID', auth.userId || '');
        addSecurityHeaders(response);
        handleCORS(request, response);
        return response;
    }

    // For all other requests, just add security headers
    const response = NextResponse.next();
    addSecurityHeaders(response);
    handleCORS(request, response);

    return response;
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};
