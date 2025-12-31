'use client';

import React, { useState } from 'react';
import {
    BarChart3, TrendingUp, TrendingDown, Users, Eye, MousePointerClick,
    Share2, MessageCircle, Heart, Lightbulb, AlertTriangle, CheckCircle,
    RefreshCw, Calendar, ArrowUpRight
} from 'lucide-react';

interface PlatformMetric {
    platform: string;
    icon: string;
    color: string;
    impressions: number;
    engagement: number;
    clicks: number;
    followers?: number;
    growth?: number;
}

interface AIInsight {
    id: string;
    type: 'success' | 'warning' | 'opportunity' | 'recommendation';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
}

interface TrendDataPoint {
    date: string;
    impressions: number;
    engagement: number;
}

const mockPlatformData: PlatformMetric[] = [
    { platform: 'Instagram', icon: '📸', color: '#E4405F', impressions: 78500, engagement: 5600, clicks: 890, followers: 8900, growth: 12.5 },
    { platform: 'YouTube', icon: '🎬', color: '#FF0000', impressions: 125000, engagement: 8900, clicks: 3200, followers: 12500, growth: 8.2 },
    { platform: 'Twitter/X', icon: '𝕏', color: '#1DA1F2', impressions: 45000, engagement: 2100, clicks: 1200, followers: 5600, growth: 15.3 },
    { platform: 'LinkedIn', icon: '💼', color: '#0A66C2', impressions: 32000, engagement: 1800, clicks: 950, followers: 3200, growth: 6.8 },
    { platform: 'TikTok', icon: '🎵', color: '#000000', impressions: 98000, engagement: 12500, clicks: 2100, followers: 15600, growth: 28.5 },
    { platform: 'Facebook', icon: '📘', color: '#1877F2', impressions: 56000, engagement: 3400, clicks: 780, followers: 4500, growth: 3.2 },
];

const mockInsights: AIInsight[] = [
    { id: '1', type: 'success', title: 'TikTok is your top performer!', description: 'TikTok content has 28.5% follower growth. Consider doubling video content.', priority: 'high' },
    { id: '2', type: 'opportunity', title: 'Best posting time detected', description: 'Your audience is most active Tuesday-Thursday between 2-4 PM.', priority: 'medium' },
    { id: '3', type: 'warning', title: 'Facebook engagement declining', description: 'Engagement dropped 15% this week. Try more interactive content.', priority: 'high' },
    { id: '4', type: 'recommendation', title: 'Cross-post to LinkedIn', description: 'Your blog content would perform well on LinkedIn with 2x reach potential.', priority: 'medium' },
];

const generateTrendData = (): TrendDataPoint[] => {
    const data: TrendDataPoint[] = [];
    for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toISOString().split('T')[0],
            impressions: Math.floor(Math.random() * 20000) + 10000,
            engagement: Math.floor(Math.random() * 2000) + 500,
        });
    }
    return data;
};

export default function AdvancedAnalyticsDashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const trendData = generateTrendData();

    const totalImpressions = mockPlatformData.reduce((sum, p) => sum + p.impressions, 0);
    const totalEngagement = mockPlatformData.reduce((sum, p) => sum + p.engagement, 0);
    const totalClicks = mockPlatformData.reduce((sum, p) => sum + p.clicks, 0);
    const avgEngagementRate = ((totalEngagement / totalImpressions) * 100).toFixed(2);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    const getInsightIcon = (type: AIInsight['type']) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
            case 'opportunity': return <TrendingUp className="w-5 h-5 text-blue-400" />;
            case 'recommendation': return <Lightbulb className="w-5 h-5 text-purple-400" />;
        }
    };

    const getInsightBgColor = (type: AIInsight['type']) => {
        switch (type) {
            case 'success': return 'bg-green-500/10 border-green-500/20';
            case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
            case 'opportunity': return 'bg-blue-500/10 border-blue-500/20';
            case 'recommendation': return 'bg-purple-500/10 border-purple-500/20';
        }
    };

    // Simple bar chart visualization
    const maxImpressions = Math.max(...mockPlatformData.map(p => p.impressions));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BarChart3 className="w-7 h-7 text-purple-400" />
                        Advanced Analytics
                    </h2>
                    <p className="text-white/60 mt-1">Cross-platform performance insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white/5 rounded-lg p-1">
                        {(['7d', '30d', '90d'] as const).map((period) => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedPeriod === period
                                        ? 'bg-purple-500 text-white'
                                        : 'text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days'}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <RefreshCw className={`w-5 h-5 text-white/60 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card p-5">
                    <div className="flex items-center justify-between">
                        <Eye className="w-8 h-8 text-blue-400" />
                        <span className="text-green-400 text-sm flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" /> +23.5%
                        </span>
                    </div>
                    <div className="mt-3">
                        <p className="text-3xl font-bold text-white">{(totalImpressions / 1000).toFixed(1)}K</p>
                        <p className="text-white/60 text-sm">Total Impressions</p>
                    </div>
                </div>
                <div className="card p-5">
                    <div className="flex items-center justify-between">
                        <Heart className="w-8 h-8 text-pink-400" />
                        <span className="text-green-400 text-sm flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" /> +18.2%
                        </span>
                    </div>
                    <div className="mt-3">
                        <p className="text-3xl font-bold text-white">{(totalEngagement / 1000).toFixed(1)}K</p>
                        <p className="text-white/60 text-sm">Total Engagement</p>
                    </div>
                </div>
                <div className="card p-5">
                    <div className="flex items-center justify-between">
                        <MousePointerClick className="w-8 h-8 text-green-400" />
                        <span className="text-green-400 text-sm flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" /> +12.8%
                        </span>
                    </div>
                    <div className="mt-3">
                        <p className="text-3xl font-bold text-white">{(totalClicks / 1000).toFixed(1)}K</p>
                        <p className="text-white/60 text-sm">Total Clicks</p>
                    </div>
                </div>
                <div className="card p-5">
                    <div className="flex items-center justify-between">
                        <Users className="w-8 h-8 text-purple-400" />
                        <span className="text-green-400 text-sm flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" /> +5.4%
                        </span>
                    </div>
                    <div className="mt-3">
                        <p className="text-3xl font-bold text-white">{avgEngagementRate}%</p>
                        <p className="text-white/60 text-sm">Avg. Engagement Rate</p>
                    </div>
                </div>
            </div>

            {/* Platform Performance & AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Platform Performance */}
                <div className="lg:col-span-2 card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-purple-400" />
                        Platform Performance
                    </h3>
                    <div className="space-y-4">
                        {mockPlatformData.map((platform) => (
                            <div key={platform.platform} className="flex items-center gap-4">
                                <div className="w-24 flex items-center gap-2">
                                    <span className="text-xl">{platform.icon}</span>
                                    <span className="text-white/80 text-sm font-medium truncate">{platform.platform}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="h-8 bg-white/5 rounded-full overflow-hidden relative">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${(platform.impressions / maxImpressions) * 100}%`,
                                                background: `linear-gradient(90deg, ${platform.color}88, ${platform.color})`,
                                            }}
                                        />
                                        <div className="absolute inset-0 flex items-center px-3 justify-between">
                                            <span className="text-white text-xs font-medium">
                                                {(platform.impressions / 1000).toFixed(1)}K impressions
                                            </span>
                                            <span className="text-white/80 text-xs">
                                                {(platform.engagement / 1000).toFixed(1)}K eng
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-20 text-right">
                                    <span className={`text-sm font-medium ${platform.growth! > 10 ? 'text-green-400' : platform.growth! > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                                        {platform.growth! > 0 ? '+' : ''}{platform.growth}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Insights */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-400" />
                        AI Insights
                    </h3>
                    <div className="space-y-3">
                        {mockInsights.map((insight) => (
                            <div
                                key={insight.id}
                                className={`p-3 rounded-lg border ${getInsightBgColor(insight.type)} cursor-pointer hover:scale-[1.02] transition-transform`}
                            >
                                <div className="flex items-start gap-3">
                                    {getInsightIcon(insight.type)}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium">{insight.title}</p>
                                        <p className="text-white/60 text-xs mt-1 line-clamp-2">{insight.description}</p>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-white/40 flex-shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Trend Chart (Simplified) */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Performance Trend
                </h3>
                <div className="h-48 flex items-end gap-1">
                    {trendData.slice(-30).map((point, i) => {
                        const maxVal = Math.max(...trendData.map(p => p.impressions));
                        const height = (point.impressions / maxVal) * 100;
                        return (
                            <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-purple-500/50 to-blue-500/50 rounded-t hover:from-purple-500 hover:to-blue-500 transition-all cursor-pointer group relative"
                                style={{ height: `${height}%` }}
                            >
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {(point.impressions / 1000).toFixed(1)}K
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between mt-2 text-white/40 text-xs">
                    <span>{trendData[0]?.date}</span>
                    <span>{trendData[trendData.length - 1]?.date}</span>
                </div>
            </div>
        </div>
    );
}
