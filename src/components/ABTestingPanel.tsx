'use client';

import React, { useState } from 'react';
import {
    FlaskConical, Play, Pause, Trophy, BarChart2, Target,
    Check, X, ChevronRight, Percent, Users, MousePointerClick
} from 'lucide-react';

interface ABTestVariant {
    id: string;
    name: string;
    title: string;
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
}

interface ABTest {
    id: string;
    name: string;
    contentId: string;
    status: 'draft' | 'running' | 'completed' | 'paused';
    startDate: string;
    variants: ABTestVariant[];
    winner?: string;
    confidence?: number;
}

const mockTests: ABTest[] = [
    {
        id: '1',
        name: 'Homepage CTA Test',
        contentId: 'post-123',
        status: 'running',
        startDate: '2025-12-28',
        variants: [
            { id: 'control', name: 'Control', title: 'Start Your Free Trial', impressions: 1250, clicks: 87, conversions: 12, ctr: 6.96 },
            { id: 'variant-a', name: 'Variant A', title: 'Get Started Free Today!', impressions: 1180, clicks: 112, conversions: 18, ctr: 9.49 },
        ],
    },
    {
        id: '2',
        name: 'Blog Title Test',
        contentId: 'post-456',
        status: 'completed',
        startDate: '2025-12-20',
        variants: [
            { id: 'control', name: 'Control', title: 'SEO Tips for 2025', impressions: 3200, clicks: 256, conversions: 34, ctr: 8.0 },
            { id: 'variant-a', name: 'Variant A', title: '10 SEO Secrets Nobody Tells You', impressions: 3150, clicks: 378, conversions: 52, ctr: 12.0 },
        ],
        winner: 'variant-a',
        confidence: 0.97,
    },
    {
        id: '3',
        name: 'Video Thumbnail Test',
        contentId: 'post-789',
        status: 'paused',
        startDate: '2025-12-25',
        variants: [
            { id: 'control', name: 'Control', title: 'Standard Thumbnail', impressions: 890, clicks: 45, conversions: 8, ctr: 5.06 },
            { id: 'variant-a', name: 'Variant A', title: 'Face Thumbnail', impressions: 920, clicks: 52, conversions: 10, ctr: 5.65 },
        ],
    },
];

interface ABTestingPanelProps {
    onCreateTest?: () => void;
}

export default function ABTestingPanel({ onCreateTest }: ABTestingPanelProps) {
    const [tests, setTests] = useState<ABTest[]>(mockTests);
    const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const getStatusColor = (status: ABTest['status']) => {
        switch (status) {
            case 'running': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusIcon = (status: ABTest['status']) => {
        switch (status) {
            case 'running': return <Play className="w-3 h-3" />;
            case 'completed': return <Trophy className="w-3 h-3" />;
            case 'paused': return <Pause className="w-3 h-3" />;
            default: return null;
        }
    };

    const toggleTestStatus = (testId: string) => {
        setTests(tests.map(test => {
            if (test.id === testId) {
                if (test.status === 'running') return { ...test, status: 'paused' as const };
                if (test.status === 'paused') return { ...test, status: 'running' as const };
            }
            return test;
        }));
    };

    const calculateImprovement = (test: ABTest): number | null => {
        if (test.variants.length < 2) return null;
        const control = test.variants[0];
        const variant = test.variants[1];
        return ((variant.ctr - control.ctr) / control.ctr) * 100;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FlaskConical className="w-7 h-7 text-purple-400" />
                        A/B Testing
                    </h2>
                    <p className="text-white/60 mt-1">Optimize content with split testing</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <FlaskConical className="w-4 h-4" />
                    New Test
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <Play className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{tests.filter(t => t.status === 'running').length}</p>
                            <p className="text-white/60 text-sm">Active Tests</p>
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Trophy className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{tests.filter(t => t.status === 'completed').length}</p>
                            <p className="text-white/60 text-sm">Completed</p>
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Percent className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">+36%</p>
                            <p className="text-white/60 text-sm">Avg. Improvement</p>
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                            <Users className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {tests.reduce((sum, t) => sum + t.variants.reduce((s, v) => s + v.impressions, 0), 0).toLocaleString()}
                            </p>
                            <p className="text-white/60 text-sm">Total Samples</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tests List */}
            <div className="card overflow-hidden">
                <div className="p-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">All Tests</h3>
                </div>
                <div className="divide-y divide-white/5">
                    {tests.map((test) => {
                        const improvement = calculateImprovement(test);
                        return (
                            <div
                                key={test.id}
                                className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                                onClick={() => setSelectedTest(test)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                            <BarChart2 className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium">{test.name}</h4>
                                            <p className="text-white/50 text-sm">Started {test.startDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(test.status)}`}>
                                            {getStatusIcon(test.status)}
                                            {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                                        </span>
                                        {improvement !== null && (
                                            <span className={`text-sm font-medium ${improvement > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
                                            </span>
                                        )}
                                        {test.winner && (
                                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center gap-1">
                                                <Trophy className="w-3 h-3" />
                                                Winner: {test.variants.find(v => v.id === test.winner)?.name}
                                            </span>
                                        )}
                                        {test.status === 'running' || test.status === 'paused' ? (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleTestStatus(test.id); }}
                                                className={`p-2 rounded-lg transition-colors ${test.status === 'running'
                                                        ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                                                        : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                                                    }`}
                                            >
                                                {test.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                            </button>
                                        ) : null}
                                        <ChevronRight className="w-5 h-5 text-white/30" />
                                    </div>
                                </div>

                                {/* Variant Comparison */}
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    {test.variants.map((variant, index) => {
                                        const isWinner = test.winner === variant.id;
                                        const isLeading = !test.winner && variant.ctr === Math.max(...test.variants.map(v => v.ctr));
                                        return (
                                            <div
                                                key={variant.id}
                                                className={`p-3 rounded-lg border ${isWinner
                                                        ? 'bg-green-500/10 border-green-500/30'
                                                        : isLeading && test.status === 'running'
                                                            ? 'bg-blue-500/10 border-blue-500/30'
                                                            : 'bg-white/5 border-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-white/80 text-sm font-medium flex items-center gap-2">
                                                        {variant.name}
                                                        {isWinner && <Trophy className="w-4 h-4 text-yellow-400" />}
                                                        {isLeading && test.status === 'running' && <Target className="w-4 h-4 text-blue-400" />}
                                                    </span>
                                                    <span className={`text-lg font-bold ${isWinner || isLeading ? 'text-green-400' : 'text-white'}`}>
                                                        {variant.ctr.toFixed(2)}%
                                                    </span>
                                                </div>
                                                <p className="text-white/50 text-xs truncate" title={variant.title}>"{variant.title}"</p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" /> {variant.impressions.toLocaleString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MousePointerClick className="w-3 h-3" /> {variant.clicks}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Check className="w-3 h-3" /> {variant.conversions}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Confidence Bar */}
                                {test.confidence && (
                                    <div className="mt-3 flex items-center gap-3">
                                        <span className="text-white/50 text-xs">Statistical Confidence:</span>
                                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                                                style={{ width: `${test.confidence * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-green-400 text-xs font-medium">{(test.confidence * 100).toFixed(0)}%</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Create Test Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="card w-full max-w-lg mx-4 p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                <FlaskConical className="w-5 h-5 text-purple-400" />
                                Create New A/B Test
                            </h3>
                            <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-white/60" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-white/80 text-sm mb-2 block">Test Name</label>
                                <input type="text" className="input w-full" placeholder="e.g., Homepage CTA Test" />
                            </div>
                            <div>
                                <label className="text-white/80 text-sm mb-2 block">Content to Test</label>
                                <select className="input w-full">
                                    <option value="">Select content...</option>
                                    <option value="1">Blog: SEO Tips for 2025</option>
                                    <option value="2">Video: Marketing Masterclass</option>
                                    <option value="3">Post: Product Launch</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-white/80 text-sm mb-2 block">Test Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Headline', 'Thumbnail', 'CTA Button', 'Posting Time'].map(type => (
                                        <button key={type} className="p-3 rounded-lg border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 text-white/80 text-sm transition-all">
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-white/20 text-white/80 rounded-lg hover:bg-white/5 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
                                    Create Test
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
