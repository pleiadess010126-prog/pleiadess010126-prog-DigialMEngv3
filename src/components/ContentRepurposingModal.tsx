'use client';

import React, { useState } from 'react';
import {
    Repeat2,
    X,
    Loader2,
    Check,
    Copy,
    Download,
    Twitter,
    Linkedin,
    Instagram,
    Youtube,
    Facebook,
    Mail,
    MessageCircle,
    FileText,
    Sparkles,
    Zap,
    ChevronRight,
    ArrowRight,
    Eye,
    TrendingUp,
    Clock,
    Save,
} from 'lucide-react';
import { quickRepurpose, RepurposedContent, RepurposingResult } from '@/lib/content/repurposingEngine';

interface ContentRepurposingModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialContent?: {
        title: string;
        content: string;
    };
}

const PLATFORMS = [
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'from-sky-400 to-blue-500', description: 'Thread format' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'from-blue-600 to-blue-700', description: 'Professional post' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-600', description: 'Carousel & caption' },
    { id: 'tiktok', name: 'TikTok', icon: MessageCircle, color: 'from-black to-gray-800', description: 'Video script' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600', description: 'Video script' },
    { id: 'threads', name: 'Threads', icon: MessageCircle, color: 'from-gray-700 to-black', description: 'Conversational' },
    { id: 'newsletter', name: 'Newsletter', icon: Mail, color: 'from-emerald-500 to-teal-600', description: 'Email format' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'from-blue-500 to-blue-600', description: 'Post format' },
];

export default function ContentRepurposingModal({
    isOpen,
    onClose,
    initialContent,
}: ContentRepurposingModalProps) {
    const [step, setStep] = useState<'input' | 'select' | 'processing' | 'results'>('input');
    const [title, setTitle] = useState(initialContent?.title || '');
    const [content, setContent] = useState(initialContent?.content || '');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<RepurposingResult | null>(null);
    const [expandedResult, setExpandedResult] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handlePlatformToggle = (platformId: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(platformId)
                ? prev.filter(p => p !== platformId)
                : [...prev, platformId]
        );
    };

    const handleSelectAll = () => {
        if (selectedPlatforms.length === PLATFORMS.length) {
            setSelectedPlatforms([]);
        } else {
            setSelectedPlatforms(PLATFORMS.map(p => p.id));
        }
    };

    const handleRepurpose = async () => {
        if (selectedPlatforms.length === 0) return;

        setStep('processing');
        setIsProcessing(true);

        try {
            const result = await quickRepurpose(content, title, selectedPlatforms);
            setResults(result);
            setStep('results');
        } catch (error) {
            console.error('Repurposing failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCopy = async (id: string, text: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDownloadAll = () => {
        if (!results) return;

        const content = results.repurposedContent
            .map(r => `=== ${r.platform.toUpperCase()} ===\n\n${r.content}\n\nHashtags: ${r.hashtags?.join(' ') || 'None'}\n\n`)
            .join('\n---\n\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `repurposed-content-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getPlatformIcon = (platformId: string) => {
        const platform = PLATFORMS.find(p => p.id === platformId);
        return platform?.icon || FileText;
    };

    const getPlatformColor = (platformId: string) => {
        const platform = PLATFORMS.find(p => p.id === platformId);
        return platform?.color || 'from-gray-500 to-gray-600';
    };

    const resetModal = () => {
        setStep('input');
        setTitle(initialContent?.title || '');
        setContent(initialContent?.content || '');
        setSelectedPlatforms([]);
        setResults(null);
        setExpandedResult(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
                            <Repeat2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Content Repurposing Engine</h2>
                            <p className="text-white/60 text-sm">Transform one piece of content into 8+ formats</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-white/60" />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-4 flex-shrink-0">
                    {['input', 'select', 'results'].map((s, i) => (
                        <React.Fragment key={s}>
                            <div className={`flex items-center gap-2 ${step === s ? 'text-cyan-400' :
                                    ['input', 'select', 'results'].indexOf(step) > i ? 'text-emerald-400' : 'text-white/40'
                                }`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === s ? 'bg-cyan-500/20 border-2 border-cyan-500' :
                                        ['input', 'select', 'results'].indexOf(step) > i ? 'bg-emerald-500/20 border-2 border-emerald-500' :
                                            'bg-white/10 border-2 border-white/20'
                                    }`}>
                                    {['input', 'select', 'results'].indexOf(step) > i ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        i + 1
                                    )}
                                </div>
                                <span className="text-sm font-medium hidden sm:block">
                                    {s === 'input' ? 'Add Content' : s === 'select' ? 'Select Platforms' : 'Results'}
                                </span>
                            </div>
                            {i < 2 && <ChevronRight className="w-4 h-4 text-white/20" />}
                        </React.Fragment>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step 1: Input Content */}
                    {step === 'input' && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Add Your Source Content</h3>
                                <p className="text-white/60">Paste or write the content you want to repurpose</p>
                            </div>

                            <div>
                                <label className="block text-white font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., 10 Tips for Better Productivity"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-medium mb-2">Content</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Paste your blog post, article, or any written content here..."
                                    className="w-full h-64 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 resize-none focus:outline-none focus:border-cyan-500/50"
                                />
                                <div className="flex justify-between mt-2 text-xs text-white/40">
                                    <span>{content.length} characters</span>
                                    <span>~{Math.ceil(content.split(' ').length / 200)} min read</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep('select')}
                                disabled={!title.trim() || !content.trim()}
                                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                Next: Select Platforms
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Select Platforms */}
                    {step === 'select' && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-white mb-2">Select Target Platforms</h3>
                                <p className="text-white/60">Choose where you want to publish this content</p>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <span className="text-white/60 text-sm">
                                    {selectedPlatforms.length} platforms selected
                                </span>
                                <button
                                    onClick={handleSelectAll}
                                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                                >
                                    {selectedPlatforms.length === PLATFORMS.length ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {PLATFORMS.map((platform) => {
                                    const isSelected = selectedPlatforms.includes(platform.id);
                                    const Icon = platform.icon;

                                    return (
                                        <button
                                            key={platform.id}
                                            onClick={() => handlePlatformToggle(platform.id)}
                                            className={`p-4 rounded-xl border-2 transition-all ${isSelected
                                                    ? 'border-cyan-500 bg-cyan-500/10'
                                                    : 'border-white/10 bg-white/5 hover:border-white/30'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center mx-auto mb-3`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <p className="text-white font-medium text-sm">{platform.name}</p>
                                            <p className="text-white/50 text-xs mt-1">{platform.description}</p>

                                            {isSelected && (
                                                <div className="mt-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mx-auto">
                                                    <Check className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => setStep('input')}
                                    className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleRepurpose}
                                    disabled={selectedPlatforms.length === 0}
                                    className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Zap className="w-5 h-5" />
                                    Repurpose Content
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Processing */}
                    {step === 'processing' && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                                <Repeat2 className="w-10 h-10 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Repurposing Your Content...</h3>
                            <p className="text-white/60 text-center max-w-md">
                                Our AI is transforming your content for {selectedPlatforms.length} platforms.
                                This usually takes 10-30 seconds.
                            </p>
                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                {selectedPlatforms.map(pId => {
                                    const platform = PLATFORMS.find(p => p.id === pId);
                                    if (!platform) return null;
                                    return (
                                        <span key={pId} className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-sm flex items-center gap-2">
                                            <platform.icon className="w-4 h-4" />
                                            {platform.name}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {step === 'results' && results && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Repurposed Content Ready! 🎉</h3>
                                    <p className="text-white/60 text-sm">
                                        {results.repurposedContent.length} versions created in {(results.processingTime / 1000).toFixed(1)}s
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDownloadAll}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download All
                                    </button>
                                    <button
                                        onClick={resetModal}
                                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <Repeat2 className="w-4 h-4" />
                                        Repurpose Again
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {results.repurposedContent.map((item) => {
                                    const Icon = getPlatformIcon(item.platform);
                                    const isExpanded = expandedResult === item.id;

                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                                        >
                                            {/* Card Header */}
                                            <div className={`p-4 bg-gradient-to-r ${getPlatformColor(item.platform)} flex items-center justify-between`}>
                                                <div className="flex items-center gap-3">
                                                    <Icon className="w-5 h-5 text-white" />
                                                    <div>
                                                        <p className="text-white font-semibold capitalize">{item.platform}</p>
                                                        <p className="text-white/70 text-xs">{item.format}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.estimatedEngagement === 'high' ? 'bg-emerald-500/20 text-emerald-300' :
                                                            item.estimatedEngagement === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                                                                'bg-red-500/20 text-red-300'
                                                        }`}>
                                                        <TrendingUp className="w-3 h-3 inline mr-1" />
                                                        {item.estimatedEngagement}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content Preview */}
                                            <div className="p-4">
                                                <pre className={`text-white/80 text-sm whitespace-pre-wrap font-sans ${isExpanded ? '' : 'line-clamp-4'
                                                    }`}>
                                                    {item.content}
                                                </pre>

                                                {item.content.length > 200 && (
                                                    <button
                                                        onClick={() => setExpandedResult(isExpanded ? null : item.id)}
                                                        className="text-cyan-400 text-sm mt-2 hover:text-cyan-300"
                                                    >
                                                        {isExpanded ? 'Show less' : 'Show more'}
                                                    </button>
                                                )}

                                                {/* Hashtags */}
                                                {item.hashtags && item.hashtags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-3">
                                                        {item.hashtags.slice(0, 5).map((tag, i) => (
                                                            <span key={i} className="px-2 py-0.5 bg-white/10 rounded text-cyan-300 text-xs">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {item.hashtags.length > 5 && (
                                                            <span className="px-2 py-0.5 bg-white/10 rounded text-white/50 text-xs">
                                                                +{item.hashtags.length - 5} more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Stats & Actions */}
                                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                                                    <span className="text-white/50 text-xs">
                                                        {item.characterCount} characters
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleCopy(item.id, item.content + (item.hashtags ? '\n\n' + item.hashtags.join(' ') : ''))}
                                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                            title="Copy to clipboard"
                                                        >
                                                            {copiedId === item.id ? (
                                                                <Check className="w-4 h-4 text-emerald-400" />
                                                            ) : (
                                                                <Copy className="w-4 h-4 text-white/60" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => setExpandedResult(isExpanded ? null : item.id)}
                                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                            title="Preview"
                                                        >
                                                            <Eye className="w-4 h-4 text-white/60" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
