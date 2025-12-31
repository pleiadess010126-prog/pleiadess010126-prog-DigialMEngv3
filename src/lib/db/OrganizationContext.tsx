'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { db } from '@/lib/db/client';
import type { Organization, OrganizationSettings, User as DbUser } from '@/lib/db/schema';

interface OrganizationContextType {
    organization: Organization | null;
    isLoading: boolean;
    error: string | null;
    members: DbUser[];
    createOrganization: (name: string, settings?: Partial<OrganizationSettings>) => Promise<Organization>;
    updateOrganization: (updates: Partial<Organization>) => Promise<void>;
    updateSettings: (settings: Partial<OrganizationSettings>) => Promise<void>;
    refreshOrganization: () => Promise<void>;
    inviteMember: (email: string, role: 'admin' | 'editor' | 'viewer') => Promise<void>;
    removeMember: (userId: string) => Promise<void>;
    switchOrganization: (orgId: string) => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated } = useAuth();
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [members, setMembers] = useState<DbUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load organization on mount
    useEffect(() => {
        if (isAuthenticated && user) {
            loadOrganization();
        } else {
            setOrganization(null);
            setMembers([]);
            setIsLoading(false);
        }
    }, [isAuthenticated, user]);

    const loadOrganization = async () => {
        if (!user) return;

        setIsLoading(true);
        setError(null);

        try {
            // Try to get organization from localStorage
            const savedOrgId = localStorage.getItem('digitalMEng_currentOrgId');

            if (savedOrgId) {
                const org = await db.getOrganization(savedOrgId);
                if (org) {
                    setOrganization(org);
                    const orgMembers = await db.getUsersByOrganization(savedOrgId);
                    setMembers(orgMembers);
                    setIsLoading(false);
                    return;
                }
            }

            // No saved org or org not found - create default org for demo
            const defaultOrg = await createDefaultOrganization();
            setOrganization(defaultOrg);
            localStorage.setItem('digitalMEng_currentOrgId', defaultOrg.id);
        } catch (err) {
            console.error('Error loading organization:', err);
            setError('Failed to load organization');
        } finally {
            setIsLoading(false);
        }
    };

    const createDefaultOrganization = async (): Promise<Organization> => {
        const defaultSettings: OrganizationSettings = {
            brandName: user?.organization || 'My Organization',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            defaultLanguage: 'en',
            emailNotifications: true,
            weeklyReports: true,
        };

        return await db.createOrganization({
            name: user?.organization || 'My Organization',
            slug: (user?.organization || 'my-org').toLowerCase().replace(/\s+/g, '-'),
            ownerId: user?.id || 'demo_user',
            plan: (user?.plan as 'free' | 'starter' | 'pro' | 'enterprise') || 'free',
            settings: defaultSettings,
        });
    };

    const createOrganization = async (
        name: string,
        settings?: Partial<OrganizationSettings>
    ): Promise<Organization> => {
        if (!user) throw new Error('User not authenticated');

        const defaultSettings: OrganizationSettings = {
            brandName: name,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            defaultLanguage: 'en',
            emailNotifications: true,
            weeklyReports: true,
            ...settings,
        };

        const org = await db.createOrganization({
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            ownerId: user.id,
            plan: 'free',
            settings: defaultSettings,
        });

        setOrganization(org);
        localStorage.setItem('digitalMEng_currentOrgId', org.id);

        // Log activity
        await db.logActivity({
            organizationId: org.id,
            userId: user.id,
            action: 'organization.created',
            entityType: 'organization',
            entityId: org.id,
        });

        return org;
    };

    const updateOrganization = async (updates: Partial<Organization>): Promise<void> => {
        if (!organization || !user) return;

        const updated = await db.updateOrganization(organization.id, updates);
        setOrganization(updated);

        await db.logActivity({
            organizationId: organization.id,
            userId: user.id,
            action: 'organization.updated',
            entityType: 'organization',
            entityId: organization.id,
            metadata: { updates },
        });
    };

    const updateSettings = async (settings: Partial<OrganizationSettings>): Promise<void> => {
        if (!organization || !user) return;

        const newSettings = { ...organization.settings, ...settings };
        await updateOrganization({ settings: newSettings });
    };

    const refreshOrganization = async (): Promise<void> => {
        await loadOrganization();
    };

    const inviteMember = async (email: string, role: 'admin' | 'editor' | 'viewer'): Promise<void> => {
        if (!organization || !user) return;

        // In production, this would send an invitation email
        // For demo, we'll just log the activity
        await db.logActivity({
            organizationId: organization.id,
            userId: user.id,
            action: 'member.invited',
            entityType: 'user',
            entityId: email,
            metadata: { role },
        });

        console.log(`Invitation sent to ${email} with role ${role}`);
    };

    const removeMember = async (userId: string): Promise<void> => {
        if (!organization || !user) return;

        // Can't remove the owner
        if (userId === organization.ownerId) {
            throw new Error('Cannot remove organization owner');
        }

        await db.deleteUser(userId);
        setMembers(prev => prev.filter(m => m.id !== userId));

        await db.logActivity({
            organizationId: organization.id,
            userId: user.id,
            action: 'member.removed',
            entityType: 'user',
            entityId: userId,
        });
    };

    const switchOrganization = async (orgId: string): Promise<void> => {
        if (!user) return;

        const org = await db.getOrganization(orgId);
        if (!org) throw new Error('Organization not found');

        setOrganization(org);
        localStorage.setItem('digitalMEng_currentOrgId', orgId);

        const orgMembers = await db.getUsersByOrganization(orgId);
        setMembers(orgMembers);
    };

    return (
        <OrganizationContext.Provider value={{
            organization,
            isLoading,
            error,
            members,
            createOrganization,
            updateOrganization,
            updateSettings,
            refreshOrganization,
            inviteMember,
            removeMember,
            switchOrganization,
        }}>
            {children}
        </OrganizationContext.Provider>
    );
}

export function useOrganization() {
    const context = useContext(OrganizationContext);
    if (context === undefined) {
        throw new Error('useOrganization must be used within an OrganizationProvider');
    }
    return context;
}
