'use client';

import React, { useState, useMemo } from 'react';
import {
    Link2, Copy, Check, Sparkles, ChevronDown, Tags, Globe, Megaphone,
    FileText, RotateCcw, ExternalLink, Save, History
} from 'lucide-react';

// Predefined UTM sources
const UTM_SOURCES = [
    { value: 'facebook', label: 'Facebook', icon: '📘' },
    { value: 'instagram', label: 'Instagram', icon: '📷' },
    { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { value: 'youtube', label: 'YouTube', icon: '📺' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'google', label: 'Google', icon: '🔍' },
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'newsletter', label: 'Newsletter', icon: '📰' },
    { value: 'direct', label: 'Direct', icon: '🔗' },
];

const UTM_MEDIUMS = [
    { value: 'social', label: 'Social Media' },
    { value: 'cpc', label: 'Paid (CPC)' },
    { value: 'organic', label: 'Organic' },
    { value: 'email', label: 'Email' },
    { value: 'referral', label: 'Referral' },
    { value: 'display', label: 'Display Ads' },
    { value: 'affiliate', label: 'Affiliate' },
    { value: 'video', label: 'Video' },
];

interface UTMParams {
    baseUrl: string;
    source: string;
    medium: string;
    campaign: string;
    term: string;
    content: string;
}

interface SavedUTM {
    id: string;
    name: string;
    params: UTMParams;
    createdAt: Date;
}

interface UTMBuilderProps {
    onUrlGenerated?: (url: string) => void;
}

export default function UTMBuilder({ onUrlGenerated }: UTMBuilderProps) {
    const [params, setParams] = useState<UTMParams>({
        baseUrl: '',
        source: '',
        medium: '',
        campaign: '',
        term: '',
        content: '',
    });

    const [copied, setCopied] = useState(false);
    const [showSourceDropdown, setShowSourceDropdown] = useState(false);
    const [showMediumDropdown, setShowMediumDropdown] = useState(false);
    const [savedLinks, setSavedLinks] = useState<SavedUTM[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [saveName, setSaveName] = useState('');

    // Generate UTM URL
    const generatedUrl = useMemo(() => {
        if (!params.baseUrl) return '';

        try {
            // Ensure URL has protocol
            let url = params.baseUrl;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }

            const urlObj = new URL(url);

            if (params.source) urlObj.searchParams.set('utm_source', params.source);
            if (params.medium) urlObj.searchParams.set('utm_medium', params.medium);
            if (params.campaign) urlObj.searchParams.set('utm_campaign', params.campaign.toLowerCase().replace(/\s+/g, '_'));
            if (params.term) urlObj.searchParams.set('utm_term', params.term.toLowerCase().replace(/\s+/g, '+'));
            if (params.content) urlObj.searchParams.set('utm_content', params.content.toLowerCase().replace(/\s+/g, '_'));

            return urlObj.toString();
        } catch {
            return '';
        }
    }, [params]);

    const updateParam = (key: keyof UTMParams, value: string) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    const copyToClipboard = async () => {
        if (!generatedUrl) return;
        await navigator.clipboard.writeText(generatedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onUrlGenerated?.(generatedUrl);
    };

    const resetForm = () => {
        setParams({
            baseUrl: '',
            source: '',
            medium: '',
            campaign: '',
            term: '',
            content: '',
        });
    };

    const saveLink = () => {
        if (!generatedUrl || !saveName.trim()) return;

        const newSaved: SavedUTM = {
            id: `utm-${Date.now()}`,
            name: saveName.trim(),
            params: { ...params },
            createdAt: new Date(),
        };

        setSavedLinks(prev => [newSaved, ...prev.slice(0, 9)]); // Keep last 10
        setSaveName('');
    };

    const loadSaved = (saved: SavedUTM) => {
        setParams(saved.params);
        setShowHistory(false);
    };

    const autoSuggestCampaign = () => {
        const date = new Date();
        const month = date.toLocaleString('default', { month: 'short' }).toLowerCase();
        const year = date.getFullYear();
        const source = params.source || 'campaign';
        return `${source}_${month}_${year}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                        <Link2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">UTM Builder</h2>
                        <p className="text-white/60 text-sm">Track your marketing campaigns with UTM parameters</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                    >
                        <History className="w-5 h-5" />
                    </button>
                    <button
                        onClick={resetForm}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Saved Links History */}
            {showHistory && savedLinks.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-sm font-medium text-white/70 mb-3">Saved UTM Links</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {savedLinks.map(saved => (
                            <button
                                key={saved.id}
                                onClick={() => loadSaved(saved)}
                                className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                            >
                                <div>
                                    <p className="text-sm font-medium text-white">{saved.name}</p>
                                    <p className="text-xs text-white/50 truncate max-w-[300px]">{saved.params.baseUrl}</p>
                                </div>
                                <span className="text-xs text-white/40">
                                    {saved.createdAt.toLocaleDateString()}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Form */}
            <div className="card p-6 space-y-5">
                {/* Base URL */}
                <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-400" />
                        Destination URL *
                    </label>
                    <input
                        type="url"
                        value={params.baseUrl}
                        onChange={(e) => updateParam('baseUrl', e.target.value)}
                        placeholder="https://yourbrand.com/landing-page"
                        className="input w-full"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Source */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                            <Tags className="w-4 h-4 text-green-400" />
                            Campaign Source *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={params.source}
                                onChange={(e) => updateParam('source', e.target.value)}
                                onFocus={() => setShowSourceDropdown(true)}
                                onBlur={() => setTimeout(() => setShowSourceDropdown(false), 200)}
                                placeholder="e.g., facebook, google, newsletter"
                                className="input w-full pr-10"
                            />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />

                            {showSourceDropdown && (
                                <div className="absolute top-full mt-1 left-0 right-0 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                                    {UTM_SOURCES.map(source => (
                                        <button
                                            key={source.value}
                                            onMouseDown={() => updateParam('source', source.value)}
                                            className="w-full px-4 py-2 text-left hover:bg-white/10 flex items-center gap-3 text-sm"
                                        >
                                            <span>{source.icon}</span>
                                            <span className="text-white">{source.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Medium */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                            <Megaphone className="w-4 h-4 text-purple-400" />
                            Campaign Medium *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={params.medium}
                                onChange={(e) => updateParam('medium', e.target.value)}
                                onFocus={() => setShowMediumDropdown(true)}
                                onBlur={() => setTimeout(() => setShowMediumDropdown(false), 200)}
                                placeholder="e.g., social, cpc, email"
                                className="input w-full pr-10"
                            />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />

                            {showMediumDropdown && (
                                <div className="absolute top-full mt-1 left-0 right-0 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-50">
                                    {UTM_MEDIUMS.map(medium => (
                                        <button
                                            key={medium.value}
                                            onMouseDown={() => updateParam('medium', medium.value)}
                                            className="w-full px-4 py-2 text-left hover:bg-white/10 text-sm text-white"
                                        >
                                            {medium.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Campaign Name */}
                <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-yellow-400" />
                        Campaign Name *
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={params.campaign}
                            onChange={(e) => updateParam('campaign', e.target.value)}
                            placeholder="e.g., spring_sale_2025"
                            className="input flex-1"
                        />
                        <button
                            onClick={() => updateParam('campaign', autoSuggestCampaign())}
                            className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-300 text-sm flex items-center gap-2"
                        >
                            <Sparkles className="w-4 h-4" />
                            Auto
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Term (optional) */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            Campaign Term <span className="text-white/40">(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={params.term}
                            onChange={(e) => updateParam('term', e.target.value)}
                            placeholder="e.g., running shoes, marketing tips"
                            className="input w-full"
                        />
                        <p className="text-xs text-white/40 mt-1">Keywords for paid search</p>
                    </div>

                    {/* Content (optional) */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            Campaign Content <span className="text-white/40">(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={params.content}
                            onChange={(e) => updateParam('content', e.target.value)}
                            placeholder="e.g., header_cta, sidebar_banner"
                            className="input w-full"
                        />
                        <p className="text-xs text-white/40 mt-1">Differentiate similar links</p>
                    </div>
                </div>
            </div>

            {/* Generated URL */}
            {generatedUrl && (
                <div className="card p-5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-400" />
                            Generated UTM Link
                        </h4>
                        <div className="flex gap-2">
                            <a
                                href={generatedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                                onClick={copyToClipboard}
                                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${copied
                                        ? 'bg-green-500 text-white'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-3 overflow-x-auto">
                        <code className="text-cyan-300 text-sm break-all">{generatedUrl}</code>
                    </div>

                    {/* Save Link */}
                    <div className="flex gap-2 mt-4">
                        <input
                            type="text"
                            value={saveName}
                            onChange={(e) => setSaveName(e.target.value)}
                            placeholder="Name this link to save..."
                            className="input flex-1 text-sm"
                        />
                        <button
                            onClick={saveLink}
                            disabled={!saveName.trim()}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-lg text-white flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save
                        </button>
                    </div>
                </div>
            )}

            {/* UTM Parameter Reference */}
            <div className="text-xs text-white/40 space-y-1">
                <p><strong>utm_source:</strong> Where traffic comes from (facebook, google, newsletter)</p>
                <p><strong>utm_medium:</strong> Marketing channel (social, cpc, email)</p>
                <p><strong>utm_campaign:</strong> Specific campaign name (summer_sale_2025)</p>
                <p><strong>utm_term:</strong> Paid search keywords (optional)</p>
                <p><strong>utm_content:</strong> Differentiate ads/links (optional)</p>
            </div>
        </div>
    );
}
