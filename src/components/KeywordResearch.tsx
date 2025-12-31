'use client';

import React, { useState } from 'react';
import {
    Search, TrendingUp, Target, BarChart3, Plus, Sparkles,
    ArrowUpRight, Info, Filter, Download, Save, Check, MousePointer2
} from 'lucide-react';

interface KeywordData {
    keyword: string;
    volume: number;
    difficulty: number;
    cpc: number;
    intent: 'informational' | 'transactional' | 'navigational' | 'commercial';
    relevance: number;
}

const mockKeywords: KeywordData[] = [
    { keyword: 'autonomous marketing engine', volume: 1200, difficulty: 45, cpc: 4.5, intent: 'commercial', relevance: 98 },
    { keyword: 'ai content automation', volume: 8500, difficulty: 68, cpc: 12.2, intent: 'commercial', relevance: 92 },
    { keyword: 'marketing automation for saas', volume: 3200, difficulty: 52, cpc: 15.8, intent: 'transactional', relevance: 88 },
    { keyword: 'best organic marketing tools', volume: 4100, difficulty: 38, cpc: 3.2, intent: 'commercial', relevance: 85 },
    { keyword: 'how to automate social media', volume: 12000, difficulty: 55, cpc: 2.1, intent: 'informational', relevance: 80 },
    { keyword: 'organic growth strategies 2025', volume: 2400, difficulty: 32, cpc: 1.5, intent: 'informational', relevance: 78 },
];

export default function KeywordResearch() {
    const [seedKeyword, setSeedKeyword] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<KeywordData[]>([]);
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

    const handleAnalyze = () => {
        if (!seedKeyword.trim()) return;
        setIsAnalyzing(true);
        // Simulate API call to keyword research provider
        setTimeout(() => {
            setResults(mockKeywords);
            setIsAnalyzing(false);
        }, 1500);
    };

    const toggleKeyword = (kw: string) => {
        setSelectedKeywords(prev =>
            prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
        );
    };

    const getDifficultyColor = (diff: number) => {
        if (diff < 30) return 'text-emerald-400 bg-emerald-500/10';
        if (diff < 60) return 'text-amber-400 bg-amber-500/10';
        return 'text-rose-400 bg-rose-500/10';
    };

    const getIntentBadge = (intent: KeywordData['intent']) => {
        const styles = {
            informational: 'bg-blue-500/10 text-blue-400',
            transactional: 'bg-purple-500/10 text-purple-400',
            navigational: 'bg-slate-500/10 text-slate-400',
            commercial: 'bg-emerald-500/10 text-emerald-400',
        };
        return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[intent]}`}>{intent}</span>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                        <Search className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Keyword Research</h2>
                        <p className="text-white/60 text-sm">Find high-intent keywords for your organic strategy</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="card p-6">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            value={seedKeyword}
                            onChange={(e) => setSeedKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                            placeholder="Enter a seed keyword or topic (e.g., SaaS Marketing)..."
                            className="input w-full pl-12 h-14 text-lg"
                        />
                    </div>
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !seedKeyword.trim()}
                        className="px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                    >
                        {isAnalyzing ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Sparkles className="w-5 h-5" />
                        )}
                        Analyze
                    </button>
                </div>
                <div className="mt-4 flex items-center gap-6 text-sm text-white/40">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Trending Topics
                    </div>
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Competitor Discovery
                    </div>
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Volume Analysis
                    </div>
                </div>
            </div>

            {/* Results Table */}
            {results.length > 0 && (
                <div className="card overflow-hidden">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Plus className="w-5 h-5 text-indigo-400" />
                            Suggested Keywords
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-white/40">{selectedKeywords.length} selected</span>
                            <button
                                disabled={selectedKeywords.length === 0}
                                className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 disabled:opacity-50 text-emerald-400 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                            >
                                <Save className="w-4 h-4" />
                                Save to Campaign
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 text-white/40 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Keyword</th>
                                    <th className="px-6 py-4 font-medium">Intent</th>
                                    <th className="px-6 py-4 font-medium">Volume</th>
                                    <th className="px-6 py-4 font-medium text-center">Difficulty (KD)</th>
                                    <th className="px-6 py-4 font-medium">CPC</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {results.map((kw) => (
                                    <tr key={kw.keyword} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleKeyword(kw.keyword)}
                                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedKeywords.includes(kw.keyword)
                                                            ? 'bg-indigo-500 border-indigo-500'
                                                            : 'border-white/20 hover:border-white/40'
                                                        }`}
                                                >
                                                    {selectedKeywords.includes(kw.keyword) && <Check className="w-3 h-3 text-white" />}
                                                </button>
                                                <span className="text-white font-medium">{kw.keyword}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getIntentBadge(kw.intent)}
                                        </td>
                                        <td className="px-6 py-4 text-white/80">
                                            {kw.volume.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyColor(kw.difficulty)}`}>
                                                    {kw.difficulty}
                                                </span>
                                                <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div className={`h-full ${kw.difficulty < 30 ? 'bg-emerald-500' : kw.difficulty < 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${kw.difficulty}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-white/80">
                                            ${kw.cpc.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* AI Insights & Competition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-5 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
                    <h4 className="text-white font-bold flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                        AI Strategic Insights
                    </h4>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="p-2 bg-indigo-500/20 rounded-lg h-fit">
                                <Info className="w-4 h-4 text-indigo-400" />
                            </div>
                            <p className="text-sm text-white/70 leading-relaxed">
                                High conversion potential detected in <span className="text-indigo-400 font-semibold">"marketing automation for saas"</span>. Competitor presence is low in the Asian market.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="p-2 bg-emerald-500/20 rounded-lg h-fit">
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                            </div>
                            <p className="text-sm text-white/70 leading-relaxed">
                                Trend alert: Organic search volume for <span className="text-emerald-400 font-semibold">"autonomous agents"</span> is up 45% this month.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card p-5">
                    <h4 className="text-white font-bold flex items-center gap-2 mb-4">
                        <MousePointer2 className="w-5 h-5 text-purple-400" />
                        Top Organic Competitors
                    </h4>
                    <div className="space-y-3">
                        {['HubSpot', 'Salesforce', 'Buffer', 'Hootsuite'].map((comp, idx) => (
                            <div key={comp} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <span className="text-white text-sm font-medium">{comp}</span>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[10px] text-white/40 uppercase">Domain Authority</p>
                                        <p className="text-xs font-bold text-white">{92 - idx * 5}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-white/40 uppercase">Traffic Share</p>
                                        <p className="text-xs font-bold text-indigo-400">{15 - idx * 2}%</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
