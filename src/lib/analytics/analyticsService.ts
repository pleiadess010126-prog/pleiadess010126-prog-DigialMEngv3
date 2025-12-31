// Advanced Analytics Service - Phase 5C
// Cross-platform analytics with AI-powered insights

export interface AnalyticsConfig {
    googleAnalyticsId?: string;
    googleSearchConsoleKey?: string;
    openaiApiKey?: string;  // For AI insights
}

export interface PlatformMetrics {
    platform: 'wordpress' | 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok';
    metrics: {
        impressions: number;
        reach: number;
        engagement: number;
        clicks: number;
        shares: number;
        comments: number;
        saves?: number;
        followers?: number;
        followerGrowth?: number;
    };
    topContent: ContentPerformance[];
    period: { start: Date; end: Date };
}

export interface ContentPerformance {
    id: string;
    title: string;
    type: string;
    platform: string;
    metrics: {
        views: number;
        likes: number;
        comments: number;
        shares: number;
        ctr?: number;
        avgWatchTime?: number;
        bounceRate?: number;
    };
    publishedAt: Date;
}

export interface AnalyticsDashboard {
    overview: {
        totalImpressions: number;
        totalEngagement: number;
        totalClicks: number;
        avgEngagementRate: number;
        impressionsGrowth: number;
        engagementGrowth: number;
    };
    platforms: PlatformMetrics[];
    topPerformers: ContentPerformance[];
    aiInsights: AIInsight[];
    trends: TrendData[];
}

export interface AIInsight {
    id: string;
    type: 'opportunity' | 'warning' | 'success' | 'recommendation';
    title: string;
    description: string;
    actionable: boolean;
    priority: 'low' | 'medium' | 'high';
    metrics?: Record<string, number>;
}

export interface TrendData {
    date: string;
    impressions: number;
    engagement: number;
    clicks: number;
}

export class AnalyticsService {
    private config: AnalyticsConfig;

    constructor(config: AnalyticsConfig) {
        this.config = config;
    }

    async getDashboard(dateRange: { start: Date; end: Date }): Promise<AnalyticsDashboard> {
        const [platforms, trends] = await Promise.all([
            this.getAllPlatformMetrics(dateRange),
            this.getTrendData(dateRange),
        ]);

        const overview = this.calculateOverview(platforms);
        const topPerformers = this.getTopPerformers(platforms);
        const aiInsights = await this.generateAIInsights(platforms, trends);

        return { overview, platforms, topPerformers, aiInsights, trends };
    }

    private async getAllPlatformMetrics(dateRange: { start: Date; end: Date }): Promise<PlatformMetrics[]> {
        // Mock data - in production, fetch from each platform's API
        return [
            {
                platform: 'wordpress',
                metrics: { impressions: 45000, reach: 38000, engagement: 2400, clicks: 1800, shares: 340, comments: 180 },
                topContent: [],
                period: dateRange,
            },
            {
                platform: 'youtube',
                metrics: { impressions: 125000, reach: 98000, engagement: 8900, clicks: 3200, shares: 890, comments: 560, followers: 12500, followerGrowth: 340 },
                topContent: [],
                period: dateRange,
            },
            {
                platform: 'instagram',
                metrics: { impressions: 78000, reach: 62000, engagement: 5600, clicks: 890, shares: 1200, comments: 890, saves: 2300, followers: 8900, followerGrowth: 230 },
                topContent: [],
                period: dateRange,
            },
        ];
    }

    private calculateOverview(platforms: PlatformMetrics[]): AnalyticsDashboard['overview'] {
        const totals = platforms.reduce((acc, p) => ({
            impressions: acc.impressions + p.metrics.impressions,
            engagement: acc.engagement + p.metrics.engagement,
            clicks: acc.clicks + p.metrics.clicks,
        }), { impressions: 0, engagement: 0, clicks: 0 });

        return {
            totalImpressions: totals.impressions,
            totalEngagement: totals.engagement,
            totalClicks: totals.clicks,
            avgEngagementRate: totals.impressions > 0 ? (totals.engagement / totals.impressions) * 100 : 0,
            impressionsGrowth: 23.5,  // Mock growth
            engagementGrowth: 18.2,
        };
    }

    private getTopPerformers(platforms: PlatformMetrics[]): ContentPerformance[] {
        return platforms.flatMap(p => p.topContent).sort((a, b) => b.metrics.views - a.metrics.views).slice(0, 10);
    }

    private async getTrendData(dateRange: { start: Date; end: Date }): Promise<TrendData[]> {
        const days = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
        return Array.from({ length: days }, (_, i) => {
            const date = new Date(dateRange.start);
            date.setDate(date.getDate() + i);
            return {
                date: date.toISOString().split('T')[0],
                impressions: Math.floor(Math.random() * 5000) + 1000,
                engagement: Math.floor(Math.random() * 500) + 100,
                clicks: Math.floor(Math.random() * 200) + 50,
            };
        });
    }

    async generateAIInsights(platforms: PlatformMetrics[], trends: TrendData[]): Promise<AIInsight[]> {
        // Generate insights based on data patterns
        const insights: AIInsight[] = [];

        // Check for high-performing platform
        const topPlatform = platforms.sort((a, b) => b.metrics.engagement - a.metrics.engagement)[0];
        if (topPlatform) {
            insights.push({
                id: 'insight-1',
                type: 'success',
                title: `${topPlatform.platform} is your top performer`,
                description: `Your ${topPlatform.platform} content has the highest engagement. Consider creating more content for this platform.`,
                actionable: true,
                priority: 'high',
            });
        }

        // Check engagement rate
        const avgEngagement = platforms.reduce((sum, p) => sum + (p.metrics.engagement / p.metrics.impressions), 0) / platforms.length;
        if (avgEngagement < 0.02) {
            insights.push({
                id: 'insight-2',
                type: 'warning',
                title: 'Low engagement rate detected',
                description: 'Your average engagement rate is below 2%. Consider improving content quality or posting times.',
                actionable: true,
                priority: 'high',
            });
        }

        // Trend analysis
        if (trends.length > 7) {
            const recentAvg = trends.slice(-7).reduce((sum, t) => sum + t.impressions, 0) / 7;
            const previousAvg = trends.slice(-14, -7).reduce((sum, t) => sum + t.impressions, 0) / 7;
            if (recentAvg > previousAvg * 1.2) {
                insights.push({
                    id: 'insight-3',
                    type: 'success',
                    title: 'Traffic is trending up!',
                    description: `Impressions increased by ${Math.round((recentAvg / previousAvg - 1) * 100)}% compared to last week.`,
                    actionable: false,
                    priority: 'medium',
                });
            }
        }

        return insights;
    }

    // Generate weekly/monthly reports
    async generateReport(period: 'weekly' | 'monthly'): Promise<string> {
        const days = period === 'weekly' ? 7 : 30;
        const end = new Date();
        const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);

        const dashboard = await this.getDashboard({ start, end });

        return `
# ${period.charAt(0).toUpperCase() + period.slice(1)} Marketing Report

## Overview
- **Total Impressions**: ${dashboard.overview.totalImpressions.toLocaleString()} (${dashboard.overview.impressionsGrowth > 0 ? '+' : ''}${dashboard.overview.impressionsGrowth}%)
- **Total Engagement**: ${dashboard.overview.totalEngagement.toLocaleString()} (${dashboard.overview.engagementGrowth > 0 ? '+' : ''}${dashboard.overview.engagementGrowth}%)
- **Avg. Engagement Rate**: ${dashboard.overview.avgEngagementRate.toFixed(2)}%

## AI Insights
${dashboard.aiInsights.map(i => `- **${i.title}**: ${i.description}`).join('\n')}

## Platform Breakdown
${dashboard.platforms.map(p => `- **${p.platform}**: ${p.metrics.impressions.toLocaleString()} impressions, ${p.metrics.engagement.toLocaleString()} engagements`).join('\n')}
        `.trim();
    }
}

export function createAnalyticsService(config: AnalyticsConfig): AnalyticsService {
    return new AnalyticsService(config);
}
