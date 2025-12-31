// Smart Scheduler - Phase 5F
// AI-powered optimal posting time detection and scheduling

export interface SchedulerConfig {
    timezone: string;
    platforms: string[];
    historicalData?: HistoricalPerformance[];
}

export interface HistoricalPerformance {
    platform: string;
    dayOfWeek: number;  // 0-6
    hour: number;       // 0-23
    avgEngagement: number;
    avgReach: number;
    postCount: number;
}

export interface OptimalTime {
    dayOfWeek: number;
    hour: number;
    score: number;
    platform: string;
    reason: string;
}

export interface ScheduledPost {
    id: string;
    contentId: string;
    platform: string;
    scheduledFor: Date;
    status: 'scheduled' | 'published' | 'failed';
    createdAt: Date;
}

export class SmartScheduler {
    private config: SchedulerConfig;
    private scheduledPosts: Map<string, ScheduledPost> = new Map();

    // Default best times based on industry research
    private defaultBestTimes: Record<string, { days: number[]; hours: number[] }> = {
        instagram: { days: [1, 2, 3], hours: [11, 14, 19] },      // Tue-Thu, 11am, 2pm, 7pm
        facebook: { days: [1, 2, 3, 4], hours: [9, 13, 16] },     // Mon-Thu, 9am, 1pm, 4pm
        twitter: { days: [1, 2, 3], hours: [8, 12, 17] },         // Mon-Wed, 8am, 12pm, 5pm
        linkedin: { days: [1, 2, 3], hours: [7, 10, 12] },        // Tue-Thu, 7am, 10am, 12pm
        youtube: { days: [4, 5, 6], hours: [12, 15, 21] },        // Thu-Sat, 12pm, 3pm, 9pm
        tiktok: { days: [1, 2, 4], hours: [7, 12, 19] },          // Tue, Wed, Fri, 7am, 12pm, 7pm
        wordpress: { days: [1, 2], hours: [10, 14] },             // Mon-Tue, 10am, 2pm
    };

    constructor(config: SchedulerConfig) {
        this.config = config;
    }

    findOptimalTimes(platform: string, count: number = 3): OptimalTime[] {
        const historical = this.config.historicalData?.filter(h => h.platform === platform) || [];

        if (historical.length >= 20) {
            // Use historical data
            return this.analyzeHistoricalData(historical, count);
        }

        // Use default best times
        return this.getDefaultOptimalTimes(platform, count);
    }

    private analyzeHistoricalData(data: HistoricalPerformance[], count: number): OptimalTime[] {
        const scores = data.map(d => ({
            dayOfWeek: d.dayOfWeek,
            hour: d.hour,
            platform: d.platform,
            score: (d.avgEngagement * 0.6) + (d.avgReach * 0.4),
            reason: `Based on ${d.postCount} historical posts with ${d.avgEngagement.toFixed(1)}% avg engagement`,
        }));

        return scores.sort((a, b) => b.score - a.score).slice(0, count);
    }

    private getDefaultOptimalTimes(platform: string, count: number): OptimalTime[] {
        const defaults = this.defaultBestTimes[platform] || this.defaultBestTimes.instagram;
        const times: OptimalTime[] = [];

        for (const day of defaults.days) {
            for (const hour of defaults.hours) {
                times.push({
                    dayOfWeek: day,
                    hour,
                    platform,
                    score: 80 + Math.random() * 15,
                    reason: 'Industry best practice timing',
                });
            }
        }

        return times.sort((a, b) => b.score - a.score).slice(0, count);
    }

    getNextOptimalSlot(platform: string): Date {
        const optimalTimes = this.findOptimalTimes(platform, 5);
        const now = new Date();

        for (let daysAhead = 0; daysAhead < 14; daysAhead++) {
            const checkDate = new Date(now);
            checkDate.setDate(checkDate.getDate() + daysAhead);
            const dayOfWeek = checkDate.getDay();

            for (const optimal of optimalTimes) {
                if (optimal.dayOfWeek === dayOfWeek) {
                    const slotTime = new Date(checkDate);
                    slotTime.setHours(optimal.hour, 0, 0, 0);

                    if (slotTime > now && !this.isSlotTaken(slotTime, platform)) {
                        return slotTime;
                    }
                }
            }
        }

        // Fallback: next hour
        const fallback = new Date(now);
        fallback.setHours(fallback.getHours() + 1, 0, 0, 0);
        return fallback;
    }

    private isSlotTaken(time: Date, platform: string): boolean {
        const buffer = 60 * 60 * 1000; // 1 hour buffer
        for (const post of this.scheduledPosts.values()) {
            if (post.platform === platform && post.status === 'scheduled') {
                const diff = Math.abs(post.scheduledFor.getTime() - time.getTime());
                if (diff < buffer) return true;
            }
        }
        return false;
    }

    schedulePost(contentId: string, platform: string, time?: Date): ScheduledPost {
        const scheduledFor = time || this.getNextOptimalSlot(platform);
        const id = `sched-${Date.now()}-${Math.random().toString(36).slice(2)}`;

        const post: ScheduledPost = {
            id,
            contentId,
            platform,
            scheduledFor,
            status: 'scheduled',
            createdAt: new Date(),
        };

        this.scheduledPosts.set(id, post);
        return post;
    }

    getScheduledPosts(platform?: string): ScheduledPost[] {
        const posts = Array.from(this.scheduledPosts.values());
        return platform ? posts.filter(p => p.platform === platform) : posts;
    }

    cancelScheduledPost(id: string): boolean {
        return this.scheduledPosts.delete(id);
    }

    // Space out posts for gradual velocity
    applyGradualVelocity(posts: { contentId: string; platform: string }[], postsPerWeek: number): ScheduledPost[] {
        const scheduled: ScheduledPost[] = [];
        const hoursPerPost = (7 * 24) / postsPerWeek;

        let nextSlot = new Date();
        for (const post of posts) {
            const optimal = this.getNextOptimalSlot(post.platform);
            if (optimal > nextSlot) {
                nextSlot = optimal;
            }

            scheduled.push(this.schedulePost(post.contentId, post.platform, nextSlot));
            nextSlot = new Date(nextSlot.getTime() + hoursPerPost * 60 * 60 * 1000);
        }

        return scheduled;
    }

    getDayName(dayOfWeek: number): string {
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek];
    }

    formatTime(hour: number): string {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h = hour % 12 || 12;
        return `${h}:00 ${ampm}`;
    }
}

export function createSmartScheduler(config: SchedulerConfig): SmartScheduler {
    return new SmartScheduler(config);
}
