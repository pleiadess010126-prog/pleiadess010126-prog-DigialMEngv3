'use client';

import { useState } from 'react';
import {
    Hash, TrendingUp, Zap, Copy, Check,
    RefreshCcw, Instagram, Youtube, Twitter,
    ExternalLink, Sparkles, Filter, Bot,
    BarChart3, Globe2
} from 'lucide-react';

interface HashtagTrend {
    tag: string;
    velocity: number; // 0-100
    volume: string;
    relevance: number; // 0-100
    platform: 'instagram' | 'tiktok' | 'twitter';
    sentiment: 'positive' | 'neutral' | 'highly-active';
}

const MOCK_TRENDS: HashtagTrend[] = [
    { tag: 'AIAutomation', velocity: 92, volume: '1.2M', relevance: 98, platform: 'tiktok', sentiment: 'highly-active' },
    { tag: 'MarketingTips2025', velocity: 85, volume: '450K', relevance: 100, platform: 'instagram', sentiment: 'positive' },
    { tag: 'DigitalMarketingEngine', velocity: 45, volume: '12K', relevance: 90, platform: 'twitter', sentiment: 'neutral' },
    { tag: 'SaaSGowth', velocity: 78, volume: '230K', relevance: 85, platform: 'instagram', sentiment: 'positive' },
    { tag: 'AIIntelligence', velocity: 88, volume: '890K', relevance: 95, platform: 'tiktok', sentiment: 'highly-active' }
];

export default function HashtagTrends() {
    const [trends, setTrends] = useState<HashtagTrend[]>(MOCK_TRENDS);
    const [refreshing, setRefreshing] = useState(false);
    const [copiedTag, setCopiedTag] = useState<string | null>(null);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    const copyToClipboard = (tag: string) => {
        navigator.clipboard.writeText(`#${tag}`);
        setCopiedTag(tag);
        setTimeout(() => setCopiedTag(null), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Hash className="w-6 h-6 text-indigo-600" />
                        Real-Time Hashtag Trends
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium">
                        Live social signals and high-velocity tags for your next post.
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
                >
                    <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh Trends
                </button>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-slate-900 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <TrendingUp className="w-32 h-32 text-indigo-400" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                                <Zap className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Trend Pulse</h3>
                        </div>
                        <p className="text-slate-400 max-w-md leading-relaxed mb-8">
                            Your niche is experiencing a <span className="text-indigo-400 font-bold">24% surge</span> in AI-related social engagement today. Tags like <span className="text-white italic">#AIWorkflow</span> are jumping 3x in visibility.
                        </p>
                        <div className="flex items-center gap-4">
                            <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30">
                                <Sparkles className="w-4 h-4" />
                                Generate Optimized Set
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Bot className="w-5 h-5 text-indigo-600" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">AI Recommendation</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed italic">
                            "Integrating #NoCodeAI into your Instagram Reels this week will likely increase reach by 12-18% based on current velocity."
                        </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">Reliability Rank</span>
                        <span className="text-xs font-black text-emerald-500">EXCELLENT</span>
                    </div>
                </div>
            </div>

            {/* Trending Tags Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trends.map((trend) => (
                    <div
                        key={trend.tag}
                        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${trend.platform === 'instagram' ? 'bg-pink-50 text-pink-600' :
                                        trend.platform === 'tiktok' ? 'bg-slate-100 text-slate-900' : 'bg-blue-50 text-blue-500'
                                    }`}>
                                    {trend.platform === 'instagram' && <Instagram className="w-4 h-4" />}
                                    {trend.platform === 'tiktok' && <Globe2 className="w-4 h-4" />}
                                    {trend.platform === 'twitter' && <Twitter className="w-4 h-4" />}
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{trend.platform}</span>
                            </div>
                            <button
                                onClick={() => copyToClipboard(trend.tag)}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-all"
                            >
                                {copiedTag === trend.tag ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>

                        <h4 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-1">
                            #{trend.tag}
                            {trend.velocity > 80 && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                        </h4>

                        <div className="space-y-3">
                            <div>
                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                                    <span>Velocity</span>
                                    <span className="text-indigo-600">{trend.velocity}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                                        style={{ width: `${trend.velocity}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Volume</span>
                                <span className="text-xs font-bold text-slate-700">{trend.volume}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Relevance</span>
                                <span className={`text-xs font-bold ${trend.relevance > 90 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {trend.relevance}% Match
                                </span>
                            </div>
                        </div>

                        <button className="mt-5 w-full py-2 border-2 border-slate-100 hover:border-indigo-100 hover:bg-indigo-50 rounded-xl text-xs font-bold text-slate-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <BarChart3 className="w-3.5 h-3.5" />
                            Detailed Analytics
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
