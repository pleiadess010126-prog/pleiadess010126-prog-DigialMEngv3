'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import AICopilot from '@/components/AICopilot';

interface ClientLayoutProps {
    children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const pathname = usePathname();
    const { isAuthenticated, user } = useAuth();

    // Determine current page for context
    const getCurrentPage = () => {
        if (pathname.includes('dashboard')) return 'dashboard';
        if (pathname.includes('content')) return 'content';
        if (pathname.includes('analytics')) return 'analytics';
        if (pathname.includes('settings')) return 'settings';
        if (pathname.includes('admin')) return 'admin';
        return 'home';
    };

    // Only show copilot on authenticated pages (not on login, home, etc.)
    const showCopilot = isAuthenticated && !pathname.includes('login') && !pathname.includes('signup') && pathname !== '/';

    return (
        <>
            {children}
            {showCopilot && (
                <AICopilot
                    currentPage={getCurrentPage()}
                    userPlan={user?.plan || 'free'}
                    onAction={(action, data) => {
                        console.log('Copilot action:', action, data);
                        // Handle navigation and actions here
                    }}
                />
            )}
        </>
    );
}
