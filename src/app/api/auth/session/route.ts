// =================================================================
// SESSION API ROUTE
// Get current user session
// =================================================================

import { getSession, getCurrentUser } from '@/lib/auth/session.server';
import { apiResponse } from '@/lib/api/validation';

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return apiResponse.unauthorized('No active session');
        }

        const user = await getCurrentUser();

        return apiResponse.success({
            user,
            expiresAt: session.exp,
            issuedAt: session.iat,
        });
    } catch (error) {
        console.error('Session route error:', error);
        return apiResponse.unauthorized('Session error');
    }
}
