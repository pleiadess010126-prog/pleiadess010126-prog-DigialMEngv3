// =================================================================
// REFRESH TOKEN API ROUTE
// Refresh access token using refresh token
// =================================================================

import { cookies } from 'next/headers';
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import { setSessionCookies, getSession } from '@/lib/auth/session.server';
import { type SessionUser } from '@/lib/auth/session';
import { apiResponse } from '@/lib/api/validation';

const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.NEXT_PUBLIC_COGNITO_REGION || 'us-east-1',
});

const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refresh_token')?.value;

        if (!refreshToken) {
            return apiResponse.unauthorized('No refresh token');
        }

        // Check if Cognito is configured
        if (!CLIENT_ID) {
            return apiResponse.error('Auth not configured', 500, 'NOT_CONFIGURED');
        }

        // Refresh the token
        const command = new InitiateAuthCommand({
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId: CLIENT_ID,
            AuthParameters: {
                REFRESH_TOKEN: refreshToken,
            },
        });

        const response = await cognitoClient.send(command);

        if (!response.AuthenticationResult?.AccessToken) {
            return apiResponse.unauthorized('Token refresh failed');
        }

        // Get existing session user data
        const session = await getSession();

        if (!session?.user) {
            return apiResponse.unauthorized('Session not found');
        }

        // Update session with new tokens
        await setSessionCookies(session.user as SessionUser, {
            accessToken: response.AuthenticationResult.AccessToken,
            // Note: Cognito doesn't return a new refresh token on refresh
        });

        return apiResponse.success({
            user: session.user,
            message: 'Session refreshed',
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        return apiResponse.unauthorized('Session expired. Please login again.');
    }
}
