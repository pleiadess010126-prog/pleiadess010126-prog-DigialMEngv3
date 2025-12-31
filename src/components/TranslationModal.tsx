'use client';

import React, { useState } from 'react';
import {
    Languages, Globe, Check, Loader2, Copy, ArrowRight,
    X, Sparkles, ChevronDown, Search
} from 'lucide-react';

interface TranslationModalProps {
    isOpen: boolean;
    onClose: () => void;
    content?: {
        title: string;
        content: string;
        keywords?: string[];
    };
    onTranslate?: (translations: TranslatedContent[]) => void;
}

interface Language {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
}

interface TranslatedContent {
    language: string;
    title: string;
    content: string;
    keywords?: string[];
}

const POPULAR_LANGUAGES: Language[] = [
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
];

export default function TranslationModal({ isOpen, onClose, content, onTranslate }: TranslationModalProps) {
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [isTranslating, setIsTranslating] = useState(false);
    const [translations, setTranslations] = useState<TranslatedContent[]>([]);
    const [currentStep, setCurrentStep] = useState<'select' | 'translating' | 'results'>('select');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedTranslation, setExpandedTranslation] = useState<string | null>(null);

    const filteredLanguages = POPULAR_LANGUAGES.filter(lang =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleLanguage = (code: string) => {
        setSelectedLanguages(prev =>
            prev.includes(code)
                ? prev.filter(c => c !== code)
                : [...prev, code]
        );
    };

    const selectAll = () => {
        setSelectedLanguages(POPULAR_LANGUAGES.map(l => l.code));
    };

    const clearAll = () => {
        setSelectedLanguages([]);
    };

    const handleTranslate = async () => {
        if (!content || selectedLanguages.length === 0) return;

        setCurrentStep('translating');
        setIsTranslating(true);
        const newTranslations: TranslatedContent[] = [];

        // Simulate translation for each language
        for (let i = 0; i < selectedLanguages.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

            const langCode = selectedLanguages[i];
            const lang = POPULAR_LANGUAGES.find(l => l.code === langCode);

            newTranslations.push({
                language: langCode,
                title: `[${lang?.nativeName}] ${content.title}`,
                content: `[Translated to ${lang?.name}]\n\n${content.content}`,
                keywords: content.keywords?.map(k => `${k} (${lang?.code})`),
            });

            setTranslations([...newTranslations]);
        }

        setIsTranslating(false);
        setCurrentStep('results');
        onTranslate?.(newTranslations);
    };

    const copyTranslation = (translation: TranslatedContent) => {
        navigator.clipboard.writeText(`${translation.title}\n\n${translation.content}`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                            <Languages className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Multi-Language Translation</h2>
                            <p className="text-white/60 text-sm">Translate your content to reach global audiences</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-white/60" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] custom-scrollbar">
                    {currentStep === 'select' && (
                        <div className="space-y-6">
                            {/* Source Content Preview */}
                            {content && (
                                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                                        <Globe className="w-4 h-4" />
                                        Source Content (English)
                                    </div>
                                    <h4 className="text-white font-medium mb-1">{content.title}</h4>
                                    <p className="text-white/60 text-sm line-clamp-2">{content.content}</p>
                                </div>
                            )}

                            {/* Language Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search languages..."
                                    className="input w-full pl-10"
                                />
                            </div>

                            {/* Quick Actions */}
                            <div className="flex items-center justify-between">
                                <p className="text-white/60 text-sm">
                                    {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''} selected
                                </p>
                                <div className="flex items-center gap-2">
                                    <button onClick={selectAll} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                                        Select All
                                    </button>
                                    <span className="text-white/20">|</span>
                                    <button onClick={clearAll} className="text-sm text-white/60 hover:text-white transition-colors">
                                        Clear
                                    </button>
                                </div>
                            </div>

                            {/* Language Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {filteredLanguages.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => toggleLanguage(lang.code)}
                                        className={`p-3 rounded-lg border transition-all flex items-center gap-3 ${selectedLanguages.includes(lang.code)
                                                ? 'bg-purple-500/20 border-purple-500'
                                                : 'bg-white/5 border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <span className="text-xl">{lang.flag}</span>
                                        <div className="flex-1 text-left">
                                            <p className="text-white text-sm font-medium">{lang.name}</p>
                                            <p className="text-white/50 text-xs">{lang.nativeName}</p>
                                        </div>
                                        {selectedLanguages.includes(lang.code) && (
                                            <Check className="w-4 h-4 text-purple-400" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 'translating' && (
                        <div className="space-y-4">
                            <div className="text-center py-6">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Translating Content</h3>
                                <p className="text-white/60 text-sm mt-1">
                                    {translations.length} of {selectedLanguages.length} languages complete
                                </p>
                            </div>

                            {/* Progress List */}
                            <div className="space-y-2">
                                {selectedLanguages.map((code, index) => {
                                    const lang = POPULAR_LANGUAGES.find(l => l.code === code);
                                    const isComplete = index < translations.length;
                                    const isActive = index === translations.length;

                                    return (
                                        <div
                                            key={code}
                                            className={`p-3 rounded-lg flex items-center gap-3 ${isComplete ? 'bg-green-500/10' : isActive ? 'bg-blue-500/10' : 'bg-white/5'
                                                }`}
                                        >
                                            <span className="text-lg">{lang?.flag}</span>
                                            <span className="text-white flex-1">{lang?.name}</span>
                                            {isComplete && <Check className="w-4 h-4 text-green-400" />}
                                            {isActive && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {currentStep === 'results' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-green-400">
                                    <Check className="w-5 h-5" />
                                    <span className="font-medium">Successfully translated to {translations.length} languages</span>
                                </div>
                            </div>

                            {/* Results List */}
                            <div className="space-y-2">
                                {translations.map((translation) => {
                                    const lang = POPULAR_LANGUAGES.find(l => l.code === translation.language);
                                    const isExpanded = expandedTranslation === translation.language;

                                    return (
                                        <div key={translation.language} className="border border-white/10 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => setExpandedTranslation(isExpanded ? null : translation.language)}
                                                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">{lang?.flag}</span>
                                                    <div className="text-left">
                                                        <p className="text-white font-medium">{lang?.name}</p>
                                                        <p className="text-white/60 text-sm truncate max-w-sm">{translation.title}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); copyTranslation(translation); }}
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    >
                                                        <Copy className="w-4 h-4 text-white/60" />
                                                    </button>
                                                    <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                </div>
                                            </button>
                                            {isExpanded && (
                                                <div className="p-4 bg-white/5 border-t border-white/10">
                                                    <h5 className="text-white font-medium mb-2">{translation.title}</h5>
                                                    <p className="text-white/70 text-sm whitespace-pre-wrap">{translation.content}</p>
                                                    {translation.keywords && (
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            {translation.keywords.map((kw, i) => (
                                                                <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                                                                    {kw}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex items-center justify-between">
                    {currentStep === 'select' && (
                        <>
                            <div className="text-white/60 text-sm">
                                Est. cost: <span className="text-white font-medium">${(selectedLanguages.length * 0.02).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={onClose} className="px-4 py-2 border border-white/20 text-white/80 rounded-lg hover:bg-white/5 transition-colors">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleTranslate}
                                    disabled={selectedLanguages.length === 0}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Translate to {selectedLanguages.length} Languages
                                </button>
                            </div>
                        </>
                    )}
                    {currentStep === 'results' && (
                        <>
                            <button
                                onClick={() => { setCurrentStep('select'); setTranslations([]); }}
                                className="text-white/60 hover:text-white transition-colors text-sm"
                            >
                                ← Translate to More Languages
                            </button>
                            <button onClick={onClose} className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
                                Done
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
