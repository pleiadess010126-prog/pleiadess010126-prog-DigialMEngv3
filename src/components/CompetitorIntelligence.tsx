'use client';

import { useState } from 'react';
import {
    Search, TrendingUp, Users, Globe, BarChart3,
    Plus, X, Zap, ArrowUpRight, ArrowDownRight,
    Target, ExternalLink, Globe2, Bot, AlertCircle,
    Copy, Check, Shield
} from 'lucide-react';

interface Competitor {
    id: string;
    name: string;
    website: string;
    status: 'active' | 'analyzing';
    metrics: {
        estTraffic: string;
        monthlyGrowth: number;
        topKeywords: number;
        socialFollowers: string;
        engagementRate: string;
    };
    strengths: string[];
    weaknesses: string[];
    recentWins: string[];
}

const MOCK_COMPETITORS: Competitor[] = [
    {
        id: '1',
        name: 'GrowthGenius AI',
        website: 'growthgenius.ai',
        status: 'active',
        metrics: {
            estTraffic: '125K',
            monthlyGrowth: 12.5,
            topKeywords: 1240,
            socialFollowers: '45K',
            engagementRate: '4.2%'
        },
        strengths: ['High-authority backlinks', 'Excellent video content', 'Fast mobile performance'],
        weaknesses: ['Weak email marketing', 'No community forum', 'Limited pricing transparency'],
        recentWins: ['Launched new TikTok course', 'Ranked #1 for "AI marketing automation"']
    },
    {
        id: '2',
        name: 'MarketFlow Pro',
        website: 'marketflow.io',
        status: 'active',
        metrics: {
            estTraffic: '85K',
            monthlyGrowth: -2.3,
            topKeywords: 850,
            socialFollowers: '12K',
            engagementRate: '2.1%'
        },
        strengths: ['Strong technical SEO', 'Deep case studies'],
        weaknesses: ['Outdated UI', 'Slow content velocity', 'Low social engagement'],
        recentWins: ['Secured Series B funding', 'Acquired a smaller SEO tool']
    }
];

export default function CompetitorIntelligence() {
    const [competitors, setCompetitors] = useState<Competitor[]>(MOCK_COMPETITORS);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUrl, setNewUrl] = useState('');
    const [activeComp, setActiveComp] = useState<Competitor | null>(competitors[0]);
    const [analyzing, setAnalyzing] = useState(false);

    const handleAddCompetitor = () => {
        if (!newUrl) return;
        setAnalyzing(true);
        // Simulate AI analysis
        setTimeout(() => {
            const newComp: Competitor = {
                id: Date.now().toString(),
                name: newUrl.split('.')[0].charAt(0).toUpperCase() + newUrl.split('.')[0].slice(1),
                website: newUrl,
                status: 'active',
                metrics: {
                    estTraffic: '45K',
                    monthlyGrowth: 5.2,
                    topKeywords: 420,
                    socialFollowers: '8K',
                    engagementRate: '3.5%'
                },
                strengths: ['Modern UI', 'Aggressive social ads'],
                weaknesses: ['Thin content', 'High bounce rate'],
                recentWins: ['New feature launch']
            };
            setCompetitors([newComp, ...competitors]);
            setAnalyzing(false);
            setShowAddModal(false);
            setNewUrl('');
        }, 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Target className="w-6 h-6 text-violet-600" />
                        Competitor Intelligence
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium">
                        Track your rivals' growth, keywords, and marketing strategies automatically.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/25"
                >
                    <Plus className="w-5 h-5" />
                    Add Competitor
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Sidebar: Competitor List */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-sm font-bold text-slate-700">Tracked Rivals</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {competitors.map((comp) => (
                                <button
                                    key={comp.id}
                                    onClick={() => setActiveComp(comp)}
                                    className={`w-full p-4 text-left transition-all hover:bg-slate-50 flex items-center justify-between group ${activeComp?.id === comp.id ? 'bg-violet-50/50 border-r-4 border-violet-500' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${activeComp?.id === comp.id ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {comp.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 group-hover:text-violet-600 transition-colors">
                                                {comp.name}
                                            </p>
                                            <p className="text-xs text-slate-400">{comp.website}</p>
                                        </div>
                                    </div>
                                    {comp.metrics.monthlyGrowth > 0 ? (
                                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                        <ArrowDownRight className="w-4 h-4 text-rose-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Insight Card */}
                    <div className="p-5 rounded-2xl bg-slate-900 text-white overflow-hidden relative">
                        <Bot className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-white/5" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">AI Advantage</span>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-300">
                                <span className="text-white font-bold">Content Gap Found:</span> Your rivals are ranking for "AI content velocity" which your site hasn't covered yet.
                            </p>
                            <button className="mt-4 text-xs font-bold text-white flex items-center gap-1 hover:gap-2 transition-all">
                                Generate content plan <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main View: Detailed Analysis */}
                <div className="lg:col-span-8 space-y-6">
                    {activeComp ? (
                        <>
                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Est. Traffic', value: activeComp.metrics.estTraffic, icon: Globe, color: 'text-blue-600' },
                                    { label: 'Growth', value: `${activeComp.metrics.monthlyGrowth}%`, icon: TrendingUp, color: activeComp.metrics.monthlyGrowth > 0 ? 'text-emerald-600' : 'text-rose-600' },
                                    { label: 'Social Reach', value: activeComp.metrics.socialFollowers, icon: Users, color: 'text-fuchsia-600' },
                                    { label: 'Keywords', value: activeComp.metrics.topKeywords, icon: BarChart3, color: 'text-violet-600' },
                                ].map((stat, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-violet-200 transition-all group">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className={`p-2 rounded-lg bg-slate-50 group-hover:bg-violet-50 transition-colors`}>
                                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                            </div>
                                        </div>
                                        <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                                        <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* SWOT and Insights Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Strengths & Weaknesses */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-emerald-500" />
                                            Competitive SWOT
                                        </h3>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Strengths</p>
                                            <ul className="space-y-2">
                                                {activeComp.strengths.map((s, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Weaknesses</p>
                                            <ul className="space-y-2">
                                                {activeComp.weaknesses.map((w, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                                                        {w}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Wins & Strategy */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-amber-500" />
                                            Recent Strategies
                                        </h3>
                                    </div>
                                    <div className="p-5">
                                        <div className="space-y-4">
                                            {activeComp.recentWins.map((win, i) => (
                                                <div key={i} className="p-3 rounded-xl bg-violet-50/50 border border-violet-100 flex items-start gap-3">
                                                    <Zap className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm text-violet-800 font-medium leading-normal">{win}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">AI Battle Plan</p>
                                            <p className="text-sm text-slate-600 italic">
                                                "Target their {activeComp.weaknesses[1].toLowerCase()} by launching a dedicated webinar series. Your engagement rate is 15% higher than theirs."
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-[400px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-8">
                            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                                <Target className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No Competitor Selected</h3>
                            <p className="text-slate-500 max-w-sm">Select a competitor from the list to view their detailed intelligence dashboard.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Competitor Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-violet-600">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Plus className="w-6 h-6" />
                                Add Competitor Site
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Competitor URL</label>
                                <div className="relative">
                                    < Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="rivalsite.com"
                                        value={newUrl}
                                        onChange={(e) => setNewUrl(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100 flex items-start gap-4">
                                <Bot className="w-6 h-6 text-violet-600 flex-shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-violet-900">AI Deep Crawl</p>
                                    <p className="text-sm text-violet-700 leading-relaxed">
                                        We'll analyze their traffic, keywords, and social strategy. This usually takes 30-60 seconds.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleAddCompetitor}
                                disabled={analyzing || !newUrl}
                                className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl font-bold shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {analyzing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Running Analysis...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5" />
                                        Start Intelligence Crawl
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
    </svg>
);
