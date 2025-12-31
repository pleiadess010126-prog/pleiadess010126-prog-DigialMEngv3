'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    organization: string;
    plan: 'free' | 'starter' | 'pro' | 'enterprise';
    role: 'user' | 'admin' | 'superadmin';
    isAdmin: boolean;
    stripeCustomerId?: string;
    createdAt: Date;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string, organization: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        const savedUser = localStorage.getItem('digitalMEng_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem('digitalMEng_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            // Simulate API call - In production, this would call AWS Cognito
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Demo login - accept any email with password "demo123"
            // Admin login: use admin@digitalme.ng with password "admin123"
            if (password === 'demo123' || password === 'admin123' || password.length >= 6) {
                const isAdminUser = email.includes('admin') || email === 'admin@digitalme.ng';
                const newUser: User = {
                    id: `user_${Date.now()}`,
                    email,
                    name: email.split('@')[0],
                    organization: 'My Organization',
                    plan: isAdminUser ? 'enterprise' : 'free',
                    role: isAdminUser ? 'admin' : 'user',
                    isAdmin: isAdminUser,
                    createdAt: new Date(),
                };
                setUser(newUser);
                localStorage.setItem('digitalMEng_user', JSON.stringify(newUser));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (name: string, email: string, password: string, organization: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            // Simulate API call - In production, this would call AWS Cognito
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (password.length >= 6) {
                const newUser: User = {
                    id: `user_${Date.now()}`,
                    email,
                    name,
                    organization,
                    plan: 'free',
                    role: 'user',
                    isAdmin: false,
                    createdAt: new Date(),
                };
                setUser(newUser);
                localStorage.setItem('digitalMEng_user', JSON.stringify(newUser));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Signup error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('digitalMEng_user');
        localStorage.removeItem('onboardingData');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
            signup,
            logout,
            isAuthenticated: !!user,
            isAdmin: user?.isAdmin || false,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
