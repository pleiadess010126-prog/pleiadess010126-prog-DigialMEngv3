'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Plus, X, Globe, ChevronDown } from 'lucide-react';
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
                            language: selectedLanguage,  // Include selected language
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

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="card w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up">
                {/* Header - Fixed at top */}
                <div className="flex-shrink-0 card-header flex-row items-center justify-between pb-4 border-b border-border">
                    <div>
                        <h2 className="card-title flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Batch Content Generation
                        </h2>
                        <p className="card-description mt-1">
                            Generate multiple pieces of content at once
                        </p>
                    </div>
                    <button onClick={onClose} disabled={generating} className="btn-ghost btn-sm p-2 hover:bg-red-500/20 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto card-content space-y-6 py-4">
                    {/* Select Topic Pillars */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3">Select Topic Pillars</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {topicPillars.slice(0, 6).map((pillar) => (
                                <button
                                    key={pillar.id}
                                    onClick={() => togglePillar(pillar.id)}
                                    disabled={generating}
                                    className={`p-3 rounded-lg border transition-all text-left ${selectedPillars.includes(pillar.id)
                                        ? 'bg-primary/10 border-primary/30 text-primary'
                                        : 'bg-muted/30 border-border hover:border-primary/20'
                                        }`}
                                >
                                    <div className="font-medium text-sm">{pillar.name}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {pillar.keywords.length} keywords
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Select Content Types - Moved BEFORE Language Selection */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3">Content Types</h3>
                        <div className="space-y-2">
                            {Object.entries(contentTypes).map(([type, enabled]) => (
                                <label key={type} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={enabled}
                                        onChange={(e) => setContentTypes({ ...contentTypes, [type]: e.target.checked })}
                                        disabled={generating}
                                        className="w-4 h-4 rounded border-border"
                                    />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium capitalize">
                                            {type.replace('-', ' ')}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {type === 'blog' && 'Full blog posts with SEO'}
                                            {type === 'youtube-short' && '60-second video scripts'}
                                            {type === 'instagram-reel' && 'Captions with hashtags'}
                                            {type === 'facebook-story' && 'Story text with prompts'}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Language Selection - Now at bottom, dropdown opens UPWARD */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-500" />
                            Content Language
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3">
                            AI will generate content directly in this language
                        </p>
                        <div className="relative">
                            <button
                                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                                disabled={generating}
                                className="w-full p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{selectedLang.flag}</span>
                                    <span className="font-medium">{selectedLang.name}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showLanguageDropdown && (
                                <div className="absolute bottom-full mb-1 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-2xl z-[100] max-h-48 overflow-y-auto">
                                    {POPULAR_LANGUAGES.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setSelectedLanguage(lang.code);
                                                setShowLanguageDropdown(false);
                                            }}
                                            className={`w-full p-3 flex items-center gap-3 hover:bg-gray-100 transition-colors text-gray-800 ${lang.code === selectedLanguage ? 'bg-blue-50 text-blue-700' : ''
                                                }`}
                                        >
                                            <span className="text-lg">{lang.flag}</span>
                                            <span className="text-sm font-medium">{lang.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Estimation */}
                    <div className="card p-4 bg-primary/5 border-primary/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Estimated Content</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {selectedPillars.length} topics × {Object.values(contentTypes).filter(Boolean).length} types
                                </p>
                            </div>
                            <div className="text-3xl font-bold text-primary">
                                {getEstimatedCount()}
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    {generating && (
                        <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-muted-foreground">Generating content...</span>
                                <span className="font-semibold">{progress}%</span>
                            </div>
                            <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer - Fixed at bottom */}
                <div className="flex-shrink-0 card-header border-t border-border pt-4 flex-row items-center justify-between">
                    <button onClick={onClose} disabled={generating} className="btn-ghost btn-md px-6">
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={generating || selectedPillars.length === 0 || getEstimatedCount() === 0}
                        className="btn-primary btn-md"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate {getEstimatedCount()} Items
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
