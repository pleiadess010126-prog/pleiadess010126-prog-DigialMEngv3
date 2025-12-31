// Usage Tracking System for DigitalMEng SaaS
// Tracks content generation, platform posts, video, voice over, music, images, and enforces plan limits

export interface UsageLimits {
    contentPerMonth: number;     // -1 for unlimited
    platforms: number;           // -1 for unlimited
    apiCalls: number;            // -1 for unlimited
    // Video & Audio Limits
    videoMinutes: number;        // AI video generation minutes per month
    voiceOverCharacters: number; // ElevenLabs/TTS characters per month
    musicTracks: number;         // Background music track uses per month (-1 unlimited for royalty-free)
    // AI Image Generation
    aiImages: number;            // AI image generation per month (DALL-E, Stable Diffusion)
}

export interface UsageRecord {
    userId: string;
    organizationId: string;
    month: string; // Format: YYYY-MM
    contentGenerated: number;
    platformPosts: {
        wordpress: number;
        youtube: number;
        instagram: number;
        facebook: number;
        tiktok: number;
    };
    apiCalls: number;
    // Video & Audio Usage
    videoMinutesUsed: number;
    voiceOverCharactersUsed: number;
    musicTracksUsed: number;
    // AI Image Usage
    aiImagesGenerated: number;
    lastUpdated: Date;
}

// Plan limits configuration - Updated with Video, Audio & Image features
export const PLAN_LIMITS: Record<string, UsageLimits> = {
    free: {
        contentPerMonth: 10,
        platforms: 1,
        apiCalls: 100,
        videoMinutes: 0,           // No AI video on free
        voiceOverCharacters: 0,    // No voice over on free
        musicTracks: 0,            // No music on free
        aiImages: 5,               // 5 free AI images to try
    },
    starter: {
        contentPerMonth: 100,
        platforms: 3,
        apiCalls: 1000,
        videoMinutes: 5,           // 5 minutes of AI video/month
        voiceOverCharacters: 10000, // ~10k chars (~7 min audio)
        musicTracks: 10,           // 10 music track uses
        aiImages: 50,              // 50 AI images/month
    },
    pro: {
        contentPerMonth: 500,
        platforms: 5,
        apiCalls: 10000,
        videoMinutes: 30,          // 30 minutes of AI video/month
        voiceOverCharacters: 50000, // ~50k chars (~35 min audio)
        musicTracks: -1,           // Unlimited royalty-free music
        aiImages: 200,             // 200 AI images/month
    },
    enterprise: {
        contentPerMonth: -1,       // Unlimited
        platforms: -1,
        apiCalls: -1,
        videoMinutes: -1,          // Unlimited
        voiceOverCharacters: -1,   // Unlimited
        musicTracks: -1,           // Unlimited + AI-generated music
        aiImages: -1,              // Unlimited AI images
    },
};

// Get current month key
export function getCurrentMonthKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Check if user has reached content limit
export function hasReachedContentLimit(
    currentUsage: number,
    plan: string
): boolean {
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    if (limits.contentPerMonth === -1) return false;
    return currentUsage >= limits.contentPerMonth;
}

// Check if user can use a specific platform
export function canUsePlatform(
    plan: string,
    platformIndex: number
): boolean {
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    if (limits.platforms === -1) return true;
    return platformIndex < limits.platforms;
}

// Get remaining content credits
export function getRemainingContent(
    currentUsage: number,
    plan: string
): number | 'unlimited' {
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    if (limits.contentPerMonth === -1) return 'unlimited';
    return Math.max(0, limits.contentPerMonth - currentUsage);
}

// Get usage percentage
export function getUsagePercentage(
    currentUsage: number,
    plan: string
): number {
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    if (limits.contentPerMonth === -1) return 0;
    return Math.min(100, (currentUsage / limits.contentPerMonth) * 100);
}

// Usage tracking context for client-side
export interface UsageContextType {
    usage: UsageRecord | null;
    limits: UsageLimits;
    isLoading: boolean;
    refreshUsage: () => Promise<void>;
    incrementContent: () => Promise<boolean>;
    incrementPlatformPost: (platform: keyof UsageRecord['platformPosts']) => Promise<boolean>;
}

// Demo usage data
export function getMockUsage(plan: string = 'free'): UsageRecord {
    return {
        userId: 'demo_user',
        organizationId: 'demo_org',
        month: getCurrentMonthKey(),
        contentGenerated: plan === 'free' ? 7 : plan === 'starter' ? 45 : 123,
        platformPosts: {
            wordpress: 12,
            youtube: 8,
            instagram: 15,
            facebook: 10,
            tiktok: 5,
        },
        apiCalls: 256,
        // Video & Audio usage
        videoMinutesUsed: plan === 'free' ? 0 : plan === 'starter' ? 2 : 12,
        voiceOverCharactersUsed: plan === 'free' ? 0 : plan === 'starter' ? 3500 : 18000,
        musicTracksUsed: plan === 'free' ? 0 : plan === 'starter' ? 4 : 15,
        // AI Image usage
        aiImagesGenerated: plan === 'free' ? 3 : plan === 'starter' ? 22 : 85,
        lastUpdated: new Date(),
    };
}

// Format usage for display
export function formatUsageDisplay(
    current: number,
    limit: number
): string {
    if (limit === -1) {
        return `${current} (Unlimited)`;
    }
    return `${current} / ${limit}`;
}

// Check if user should see upgrade prompt
export function shouldShowUpgradePrompt(
    currentUsage: number,
    plan: string,
    threshold: number = 0.8 // 80%
): boolean {
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    if (limits.contentPerMonth === -1) return false;
    const percentage = currentUsage / limits.contentPerMonth;
    return percentage >= threshold;
}

// Get recommended plan based on usage
export function getRecommendedPlan(
    monthlyContent: number,
    platformsNeeded: number
): string {
    if (monthlyContent <= 10 && platformsNeeded <= 1) return 'free';
    if (monthlyContent <= 100 && platformsNeeded <= 3) return 'starter';
    if (monthlyContent <= 500 && platformsNeeded <= 5) return 'pro';
    return 'enterprise';
}
