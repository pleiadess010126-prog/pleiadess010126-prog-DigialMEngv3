// =================================================================
// LOGOUT API ROUTE
// Clear session and cookies
// =================================================================

import { clearSessionCookies } from '@/lib/auth/session.server';
import { apiResponse } from '@/lib/api/validation';

export async function POST() {
    try {
        // Clear all session cookies
        await clearSessionCookies();

        return apiResponse.success({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout route error:', error);
        // Even if there's an error, we want to clear the session client-side
        return apiResponse.success({ message: 'Logged out' });
    }
}
