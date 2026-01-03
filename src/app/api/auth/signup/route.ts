// =================================================================
// SIGNUP API ROUTE
// User registration with Cognito + demo fallback
// =================================================================

import { NextResponse } from 'next/server';
import { signUp } from '@/lib/aws/cognito';
import { string, parseBody, apiResponse } from '@/lib/api/validation';

interface SignupRequest {
    name: string;
    email: string;
    password: string;
    organization: string;
}

function validateSignupRequest(data: unknown): SignupRequest {
    const obj = data as Record<string, unknown>;
    return {
        name: string.minLength(obj.name, 2, 'name'),
        email: string.email(obj.email),
        password: string.password(obj.password),
        organization: string.minLength(obj.organization, 2, 'organization'),
    };
}

export async function POST(request: Request) {
    try {
        // Validate request body
        const validation = await parseBody(request, validateSignupRequest);

        if (!validation.success) {
            return apiResponse.validationError(validation.errors!);
        }

        const { name, email, password, organization } = validation.data!;

        // Check if Cognito is configured
        const cognitoConfigured =
            process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID &&
            process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

        if (cognitoConfigured) {
            // Production: Use Cognito signup
            const result = await signUp({ email, password, name });

            if (!result.success) {
                // Map Cognito errors to user-friendly messages
                let errorMessage = result.error || 'Signup failed';

                if (errorMessage.includes('UsernameExistsException')) {
                    errorMessage = 'An account with this email already exists';
                } else if (errorMessage.includes('InvalidPasswordException')) {
                    errorMessage = 'Password does not meet requirements';
                } else if (errorMessage.includes('InvalidParameterException')) {
                    errorMessage = 'Invalid email or password format';
                }

                return apiResponse.error(errorMessage, 400, 'SIGNUP_FAILED');
            }

            return apiResponse.success({
                message: result.message,
                userSub: result.userSub,
                requiresVerification: true,
            }, 201);
        }

        // Development/Demo mode: Return not configured
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Cognito not configured',
                    code: 'NOT_CONFIGURED',
                },
            },
            { status: 404 }
        );

    } catch (error) {
        console.error('Signup route error:', error);
        return apiResponse.serverError('Signup failed. Please try again.');
    }
}
