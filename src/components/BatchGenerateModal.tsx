'use client';

import { useState } from 'react';
import { Sparkles, Loader2, X, Globe, ChevronDown, FileText, Youtube, Instagram, Facebook, Zap, Check } from 'lucide-react';
import type { TopicPillar } from '@/types';

// Popular languages for content generation
const POPULAR_LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
    { code: 'th', name: 'Thai', flag: '🇹🇭' },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
    { code: 'pl', name: 'Polish', flag: '🇵🇱' },
    { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
    { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
];

const CONTENT_TYPES = [
    { id: 'blog', label: 'Blog Post', description: 'Full SEO-optimized articles', icon: FileText, color: 'bg-violet-500' },
    { id: 'youtube-short', label: 'YouTube Short', description: '60-second video scripts', icon: Youtube, color: 'bg-red-500' },
    { id: 'instagram-reel', label: 'Instagram Reel', description: 'Captions with hashtags', icon: Instagram, color: 'bg-pink-500' },
    { id: 'facebook-story', label: 'Facebook Story', description: 'Story text with prompts', icon: Facebook, color: 'bg-blue-600' },
];

interface BatchGenerateModalProps {
    isOpen: boolean;
    onClose: () => void;
    topicPillars: TopicPillar[];
    onGenerate?: (results: any[]) => void;
}

export default function BatchGenerateModal({
    isOpen,
    onClose,
    topicPillars,
    onGenerate,
}: BatchGenerateModalProps) {
    const [selectedPillars, setSelectedPillars] = useState<string[]>([]);
    const [contentTypes, setContentTypes] = useState({
        blog: true,
        'youtube-short': true,
        'instagram-reel': true,
        'facebook-story': false,
    });
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    if (!isOpen) return null;

    const togglePillar = (pillarId: string) => {
        setSelectedPillars(prev =>
            prev.includes(pillarId)
                ? prev.filter(id => id !== pillarId)
                : [...prev, pillarId]
        );
    };

    const getEstimatedCount = () => {
        const typesCount = Object.values(contentTypes).filter(Boolean).length;
        return selectedPillars.length * typesCount;
    };

    const selectedLang = POPULAR_LANGUAGES.find(l => l.code === selectedLanguage) || POPULAR_LANGUAGES[0];

    const handleGenerate = async () => {
        setGenerating(true);
        setProgress(0);

        const results: any[] = [];
        const selectedTypes = Object.entries(contentTypes)
            .filter(([, enabled]) => enabled)
            .map(([type]) => type);

        const totalTasks = selectedPillars.length * selectedTypes.length;
        let completed = 0;

        for (const pillarId of selectedPillars) {
            const pillar = topicPillars.find(p => p.id === pillarId);
            if (!pillar) continue;

            for (const contentType of selectedTypes) {
                try {
                    const response = await fetch('/api/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            topic: pillar.name,
                            keywords: pillar.keywords,
                            contentType,
                            targetAudience: 'digital marketers and content creators',
                            language: selectedLanguage,
                            useSupervisor: true,
                        }),
                    });

                    const data = await response.json();
                    if (data.success) {
                        results.push(data.content);
                    }
                } catch (error) {
                    console.error('Batch generation error:', error);
                }

                completed++;
                setProgress(Math.round((completed / totalTasks) * 100));
            }
        }

        setGenerating(false);
        onGenerate?.(results);
        onClose();
    };

    const pillarColors = ['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500'];

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div
                className="w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                style={{ animation: 'fadeInUp 0.3s ease-out' }}
            >
                {/* Header */}
                <div className="flex-shrink-0 p-6 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">AI Batch Generation</h2>
                                <p className="text-white/70 text-sm">Generate multiple content pieces at once</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={generating}
                            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Select Topic Pillars */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center text-xs font-black">1</span>
                            Select Topic Pillars
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {topicPillars.slice(0, 6).map((pillar, index) => (
                                <button
                                    key={pillar.id}
                                    onClick={() => togglePillar(pillar.id)}
                                    disabled={generating}
                                    className={`relative p-4 rounded-2xl border-2 transition-all text-left group ${selectedPillars.includes(pillar.id)
                                        ? 'border-violet-500 bg-violet-50 shadow-lg shadow-violet-500/20'
                                        : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                                        }`}
                                >
                                    {selectedPillars.includes(pillar.id) && (
                                        <div className="absolute top-3 right-3 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                    <div className={`w-8 h-8 rounded-xl ${pillarColors[index % pillarColors.length]} flex items-center justify-center mb-3`}>
                                        <Zap className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="font-semibold text-slate-800 text-sm">{pillar.name}</div>
                                    <div className="text-xs text-slate-500 mt-1">
                                        {pillar.keywords.length} keywords
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Types */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-black">2</span>
                            Content Types
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {CONTENT_TYPES.map((type) => {
                                const isSelected = contentTypes[type.id as keyof typeof contentTypes];
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setContentTypes({ ...contentTypes, [type.id]: !isSelected })}
                                        disabled={generating}
                                        className={`relative p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${isSelected
                                            ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                                            : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                                            }`}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                        <div className={`w-10 h-10 rounded-xl ${type.color} flex items-center justify-center flex-shrink-0`}>
                                            <type.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800 text-sm">{type.label}</div>
                                            <div className="text-xs text-slate-500">{type.description}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Language Selection */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-xs font-black">3</span>
                            Content Language
                        </h3>
                        <div className="relative">
                            <button
                                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                                disabled={generating}
                                className="w-full p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{selectedLang.flag}</span>
                                            <span className="font-semibold text-slate-800">{selectedLang.name}</span>
                                        </div>
                                        <div className="text-xs text-slate-500">AI generates directly in this language</div>
                                    </div>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showLanguageDropdown && (
                                <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[100] max-h-64 overflow-y-auto">
                                    <div className="p-2 grid grid-cols-2 gap-1">
                                        {POPULAR_LANGUAGES.map(lang => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setSelectedLanguage(lang.code);
                                                    setShowLanguageDropdown(false);
                                                }}
                                                className={`p-3 flex items-center gap-3 rounded-xl transition-colors ${lang.code === selectedLanguage
                                                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                                                    : 'text-slate-700 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span className="text-lg">{lang.flag}</span>
                                                <span className="text-sm">{lang.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress */}
                    {generating && (
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center">
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Generating Content...</p>
                                        <p className="text-sm text-slate-500">AI is creating your content</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-black text-violet-600">{progress}%</span>
                            </div>
                            <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-6 bg-slate-50 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-3xl font-black text-violet-600">{getEstimatedCount()}</div>
                                <div className="text-xs text-slate-500 font-medium">Items to generate</div>
                            </div>
                            <div className="h-10 w-px bg-slate-200" />
                            <div className="text-sm text-slate-500">
                                {selectedPillars.length} topics × {Object.values(contentTypes).filter(Boolean).length} types
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                disabled={generating}
                                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={generating || selectedPillars.length === 0 || getEstimatedCount() === 0}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {generating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Generate Content
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
