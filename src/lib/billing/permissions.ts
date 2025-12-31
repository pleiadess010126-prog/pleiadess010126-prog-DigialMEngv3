import { PLAN_LIMITS } from './usage';

export type PlanId = 'free' | 'starter' | 'pro' | 'enterprise';

const PLAN_HIERARCHY: Record<PlanId, number> = {
    free: 0,
    starter: 1,
    pro: 2,
    enterprise: 3,
};

/**
 * Checks if a user has at least the required plan level
 */
export function hasRequiredPlan(userPlan: string = 'free', requiredPlan: PlanId): boolean {
    const userLevel = PLAN_HIERARCHY[userPlan as PlanId] || 0;
    const requiredLevel = PLAN_HIERARCHY[requiredPlan];

    return userLevel >= requiredLevel;
}

/**
 * Checks if a user can use a specific feature based on their plan
 */
export function canUseFeature(userPlan: string = 'free', feature: string): boolean {
    const plan = userPlan as PlanId;

    switch (feature) {
        // Video & Audio features
        case 'video-generation':
            return hasRequiredPlan(plan, 'starter'); // Now available from Starter
        case 'voice-over':
            return hasRequiredPlan(plan, 'starter'); // Available from Starter
        case 'background-music':
            return hasRequiredPlan(plan, 'starter'); // Available from Starter
        case 'ai-music-generation':
            return hasRequiredPlan(plan, 'enterprise'); // AI-generated music is Enterprise only

        // Content features
        case 'advanced-analytics':
            return hasRequiredPlan(plan, 'starter');
        case 'ab-testing':
            return hasRequiredPlan(plan, 'pro');
        case 'api-access':
            return hasRequiredPlan(plan, 'pro');
        case 'white-label':
            return hasRequiredPlan(plan, 'enterprise');
        case 'multi-language':
            return hasRequiredPlan(plan, 'starter');
        case 'tiktok':
            return hasRequiredPlan(plan, 'pro');
        case 'unlimited-music':
            return hasRequiredPlan(plan, 'pro');
        default:
            return true;
    }
}

/**
 * Returns the minimum required plan for a feature
 */
export function getRequiredPlanForFeature(feature: string): PlanId {
    switch (feature) {
        case 'video-generation':
        case 'voice-over':
        case 'background-music':
        case 'advanced-analytics':
        case 'multi-language':
            return 'starter';
        case 'ab-testing':
        case 'api-access':
        case 'tiktok':
        case 'unlimited-music':
            return 'pro';
        case 'white-label':
        case 'ai-music-generation':
            return 'enterprise';
        default:
            return 'free';
    }
}

/**
 * Returns a user-friendly message for a feature lock
 */
export function getFeatureLockMessage(feature: string): string {
    const requiredPlan = getRequiredPlanForFeature(feature);
    const planName = requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1);

    switch (feature) {
        case 'video-generation':
            return `AI Video Generation is available on ${planName} plans and above. Upgrade to create AI-powered videos with voice over.`;
        case 'voice-over':
            return `AI Voice Over (ElevenLabs) is available on ${planName} plans and above.`;
        case 'background-music':
            return `Background Music is available on ${planName} plans and above.`;
        case 'ai-music-generation':
            return 'AI-generated custom music is an Enterprise exclusive feature.';
        case 'ab-testing':
            return `A/B Testing requires a ${planName} subscription.`;
        case 'api-access':
            return `API access is available on ${planName} plans and above.`;
        case 'tiktok':
            return `TikTok publishing is available on ${planName} plans and above.`;
        case 'unlimited-music':
            return `Unlimited royalty-free music is available on ${planName} plans.`;
        case 'white-label':
            return 'White-label branding is an Enterprise exclusive feature.';
        default:
            return `This feature requires a ${planName} plan.`;
    }
}

/**
 * Get limit for a specific resource based on plan
 */
export function getResourceLimit(plan: string, resource: keyof typeof PLAN_LIMITS['free']): number {
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    return limits[resource] as number;
}

/**
 * Check if user can use more of a resource
 */
export function canUseResource(plan: string, resource: keyof typeof PLAN_LIMITS['free'], currentUsage: number): boolean {
    const limit = getResourceLimit(plan, resource);
    if (limit === -1) return true; // Unlimited
    return currentUsage < limit;
}
