'use client';

import { useState } from 'react';
import {
    Bell, Globe, Search, MessageSquare,
    TrendingUp, TrendingDown, AlertCircle,
    CheckCircle2, MoreHorizontal, ExternalLink,
    Filter, Bot, Shield, Zap, Sparkles, LineChart
} from 'lucide-react';

interface BrandMention {
    id: string;
    source: string;
    platform: 'reddit' | 'twitter' | 'news' | 'blog' | 'forum';
    content: string;
    sentiment: 'positive' | 'neutral' | 'negative' | 'critical';
    reach: string;
    date: string;
    link: string;
}

const MOCK_MENTIONS: BrandMention[] = [
    {
        id: '1',
        source: 'r/SaaS',
        platform: 'reddit',
        content: "Has anyone tried DigitalMEng yet? Looking for an autonomous marketing engine that doesn't feel like spam.",
        sentiment: 'neutral',
        reach: '15.4K',
        date: '2 hours ago',
        link: 'https://reddit.com/r/saas/comments/123'
    },
    {
        id: '2',
        source: 'TechCrunch',
        platform: 'news',
        content: "DigitalMEng is leading the wave of autonomous marketing AI with their new Amazon Bedrock integration.",
        sentiment: 'positive',
        reach: '2.5M',
        date: '5 hours ago',
        link: 'https://techcrunch.com/article/456'
    },
    {
        id: '3',
        source: '@User123',
        platform: 'twitter',
        content: "Really struggling with the DigitalMEng signup flow today. Is the server down?",
        sentiment: 'critical',
        reach: '1.2K',
        date: '10 mins ago',
        link: 'https://twitter.com/user123/status/789'
    }
];

export default function BrandMonitoring() {
    const [mentions, setMentions] = useState<BrandMention[]>(MOCK_MENTIONS);
    const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'positive'>('all');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-red-600" />
                        Brand Reputation Monitor
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium">
                        Real-time tracking of brand mentions and social sentiment online.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-red-600 transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg">
                        <LineChart className="w-5 h-5" />
                        Sentiment Analysis
                    </button>
                </div>
            </div>

            {/* Sentiment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Overall Sentiment', value: '84%', icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Total Reach', value: '3.2M', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Active Alerts', value: '2', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
                    { label: 'Share of Voice', value: '18%', icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-50' },
                ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Last 24h</span>
                        </div>
                        <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Mention Feed */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                            {['all', 'critical', 'positive'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f as any)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${activeFilter === f
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Filter results..."
                                className="pl-9 pr-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/10"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {mentions.map((mention) => (
                            <div key={mention.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                {/* Sentiment Border */}
                                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${mention.sentiment === 'positive' ? 'bg-emerald-500' :
                                        mention.sentiment === 'negative' ? 'bg-amber-500' :
                                            mention.sentiment === 'critical' ? 'bg-red-500' : 'bg-slate-200'
                                    }`} />

                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-slate-400">
                                            {mention.source.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{mention.source}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mention.platform}</span>
                                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mention.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${mention.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-700' :
                                                mention.sentiment === 'critical' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {mention.sentiment}
                                        </div>
                                        <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600 leading-relaxed font-medium mb-4">
                                    "{mention.content}"
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                        <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Reply</span>
                                        <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Take Action</span>
                                    </div>
                                    <a href={mention.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:gap-2 transition-all">
                                        View Source <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Insights Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="p-6 rounded-3xl bg-slate-900 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <Bot className="w-5 h-5 text-red-400" />
                            <h3 className="font-bold">Reputation Guardian</h3>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6">
                            I've detected a <span className="text-red-400 font-bold">minor spike</span> in critical mentions from Twitter users regarding the signup flow.
                        </p>
                        <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                </div>
                                <span className="text-xs font-medium">Verify Server Status</span>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-xs">!</div>
                                <span className="text-xs font-medium">Draft Response for @User123</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            Mention Velocity
                        </h3>
                        <div className="h-40 flex items-end gap-1.5">
                            {[40, 60, 45, 90, 65, 30, 80, 55, 70, 40].map((h, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-slate-100 rounded-t-lg hover:bg-violet-100 transition-colors relative group"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-1.5 bg-slate-800 text-white text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {h * 120} mentions
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400">
                            <span>12 PM</span>
                            <span>4 PM</span>
                            <span>8 PM</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
