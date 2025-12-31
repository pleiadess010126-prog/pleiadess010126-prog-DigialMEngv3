'use client';

import React, { useState, useRef } from 'react';
import {
    Building2, Palette, Upload, Sparkles, Target, Users, MessageSquare,
    Globe, Edit3, Save, X, Image, Check, Plus, Trash2, RefreshCw
} from 'lucide-react';

// Brand Voice Options
const VOICE_OPTIONS = [
    { id: 'professional', label: 'Professional', description: 'Formal, authoritative, trust-building' },
    { id: 'casual', label: 'Casual', description: 'Friendly, approachable, conversational' },
    { id: 'educational', label: 'Educational', description: 'Informative, clear, helpful' },
    { id: 'entertaining', label: 'Entertaining', description: 'Fun, engaging, creative' },
    { id: 'inspirational', label: 'Inspirational', description: 'Motivating, uplifting, empowering' },
    { id: 'technical', label: 'Technical', description: 'Detailed, precise, expert-level' },
];

// Industry Options
const INDUSTRY_OPTIONS = [
    'Technology / SaaS',
    'E-commerce / Retail',
    'Healthcare / Medical',
    'Finance / Banking',
    'Education / EdTech',
    'Real Estate',
    'Marketing / Agency',
    'Travel / Hospitality',
    'Food & Beverage',
    'Entertainment / Media',
    'Manufacturing',
    'Professional Services',
    'Non-profit',
    'Other',
];

// Predefined Color Palettes
const COLOR_PALETTES = [
    { name: 'Ocean Blue', primary: '#0EA5E9', secondary: '#06B6D4', accent: '#8B5CF6' },
    { name: 'Forest Green', primary: '#10B981', secondary: '#059669', accent: '#F59E0B' },
    { name: 'Royal Purple', primary: '#8B5CF6', secondary: '#A855F7', accent: '#EC4899' },
    { name: 'Sunset Orange', primary: '#F97316', secondary: '#EF4444', accent: '#FBBF24' },
    { name: 'Modern Dark', primary: '#6366F1', secondary: '#8B5CF6', accent: '#22D3EE' },
    { name: 'Nature', primary: '#84CC16', secondary: '#22C55E', accent: '#0EA5E9' },
];

interface BrandProfile {
    // Basic Info
    brandName: string;
    tagline: string;
    industry: string;
    websiteUrl: string;

    // Target Audience
    targetAudience: string;
    audienceAge: string;
    audienceLocation: string;
    audienceInterests: string[];

    // Brand Identity
    uniqueValueProposition: string;
    missionStatement: string;
    brandValues: string[];

    // Voice & Tone
    voiceType: string;
    toneKeywords: string[];
    contentStyle: string;

    // Visual Identity
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl: string;

    // Content Preferences
    preferredTopics: string[];
    avoidTopics: string[];
    competitorUrls: string[];
}

interface BrandProfileSettingsProps {
    initialProfile?: Partial<BrandProfile>;
    onSave?: (profile: BrandProfile) => void;
}

export default function BrandProfileSettings({
    initialProfile,
    onSave
}: BrandProfileSettingsProps) {
    const [profile, setProfile] = useState<BrandProfile>({
        brandName: initialProfile?.brandName || '',
        tagline: initialProfile?.tagline || '',
        industry: initialProfile?.industry || '',
        websiteUrl: initialProfile?.websiteUrl || '',
        targetAudience: initialProfile?.targetAudience || '',
        audienceAge: initialProfile?.audienceAge || '25-45',
        audienceLocation: initialProfile?.audienceLocation || 'Global',
        audienceInterests: initialProfile?.audienceInterests || [],
        uniqueValueProposition: initialProfile?.uniqueValueProposition || '',
        missionStatement: initialProfile?.missionStatement || '',
        brandValues: initialProfile?.brandValues || [],
        voiceType: initialProfile?.voiceType || 'professional',
        toneKeywords: initialProfile?.toneKeywords || [],
        contentStyle: initialProfile?.contentStyle || 'balanced',
        primaryColor: initialProfile?.primaryColor || '#8B5CF6',
        secondaryColor: initialProfile?.secondaryColor || '#EC4899',
        accentColor: initialProfile?.accentColor || '#22D3EE',
        logoUrl: initialProfile?.logoUrl || '',
        preferredTopics: initialProfile?.preferredTopics || [],
        avoidTopics: initialProfile?.avoidTopics || [],
        competitorUrls: initialProfile?.competitorUrls || [],
    });

    const [activeSection, setActiveSection] = useState<string>('basic');
    const [newValue, setNewValue] = useState('');
    const [newTopic, setNewTopic] = useState('');
    const [newAvoidTopic, setNewAvoidTopic] = useState('');
    const [newCompetitor, setNewCompetitor] = useState('');
    const [newInterest, setNewInterest] = useState('');
    const [newToneKeyword, setNewToneKeyword] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const updateField = (field: keyof BrandProfile, value: any) => {
        setProfile(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const addToArray = (field: keyof BrandProfile, value: string) => {
        if (value.trim()) {
            const current = profile[field] as string[];
            if (!current.includes(value.trim())) {
                updateField(field, [...current, value.trim()]);
            }
        }
    };

    const removeFromArray = (field: keyof BrandProfile, index: number) => {
        const current = profile[field] as string[];
        updateField(field, current.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        onSave?.(profile);
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateField('logoUrl', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const applyColorPalette = (palette: typeof COLOR_PALETTES[0]) => {
        updateField('primaryColor', palette.primary);
        updateField('secondaryColor', palette.secondary);
        updateField('accentColor', palette.accent);
    };

    const sections = [
        { id: 'basic', label: 'Basic Info', icon: Building2 },
        { id: 'audience', label: 'Target Audience', icon: Users },
        { id: 'identity', label: 'Brand Identity', icon: Sparkles },
        { id: 'voice', label: 'Voice & Tone', icon: MessageSquare },
        { id: 'visual', label: 'Visual Identity', icon: Palette },
        { id: 'content', label: 'Content Preferences', icon: Edit3 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Brand Profile</h2>
                        <p className="text-white/60 text-sm">Define your brand identity for AI-powered content</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${saved
                            ? 'bg-green-500 text-white'
                            : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white'
                        }`}
                >
                    {saving ? (
                        <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : saved ? (
                        <>
                            <Check className="w-4 h-4" />
                            Saved!
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Profile
                        </>
                    )}
                </button>
            </div>

            {/* Section Tabs */}
            <div className="flex flex-wrap gap-2">
                {sections.map(section => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${activeSection === section.id
                                ? 'bg-violet-500 text-white'
                                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <section.icon className="w-4 h-4" />
                        {section.label}
                    </button>
                ))}
            </div>

            {/* Basic Info Section */}
            {activeSection === 'basic' && (
                <div className="card p-6 space-y-5">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-violet-400" />
                        Basic Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Brand Name *</label>
                            <input
                                type="text"
                                value={profile.brandName}
                                onChange={(e) => updateField('brandName', e.target.value)}
                                placeholder="Your Brand Name"
                                className="input w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Tagline</label>
                            <input
                                type="text"
                                value={profile.tagline}
                                onChange={(e) => updateField('tagline', e.target.value)}
                                placeholder="Your catchy tagline"
                                className="input w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Industry *</label>
                            <select
                                value={profile.industry}
                                onChange={(e) => updateField('industry', e.target.value)}
                                className="input w-full"
                            >
                                <option value="">Select Industry</option>
                                {INDUSTRY_OPTIONS.map(industry => (
                                    <option key={industry} value={industry}>{industry}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Website URL</label>
                            <input
                                type="url"
                                value={profile.websiteUrl}
                                onChange={(e) => updateField('websiteUrl', e.target.value)}
                                placeholder="https://yourbrand.com"
                                className="input w-full"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Target Audience Section */}
            {activeSection === 'audience' && (
                <div className="card p-6 space-y-5">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        Target Audience
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Audience Description</label>
                        <textarea
                            value={profile.targetAudience}
                            onChange={(e) => updateField('targetAudience', e.target.value)}
                            placeholder="Describe your ideal customer in detail..."
                            rows={3}
                            className="textarea w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Age Range</label>
                            <select
                                value={profile.audienceAge}
                                onChange={(e) => updateField('audienceAge', e.target.value)}
                                className="input w-full"
                            >
                                <option value="18-24">18-24 (Gen Z)</option>
                                <option value="25-34">25-34 (Millennials)</option>
                                <option value="35-44">35-44 (Gen X)</option>
                                <option value="45-54">45-54</option>
                                <option value="55+">55+ (Boomers)</option>
                                <option value="25-45">25-45 (Working Professionals)</option>
                                <option value="all">All Ages</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Primary Location</label>
                            <input
                                type="text"
                                value={profile.audienceLocation}
                                onChange={(e) => updateField('audienceLocation', e.target.value)}
                                placeholder="e.g., North America, Global, India"
                                className="input w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Audience Interests</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newInterest}
                                onChange={(e) => setNewInterest(e.target.value)}
                                placeholder="Add an interest..."
                                className="input flex-1"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addToArray('audienceInterests', newInterest);
                                        setNewInterest('');
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    addToArray('audienceInterests', newInterest);
                                    setNewInterest('');
                                }}
                                className="btn-primary px-4"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {profile.audienceInterests.map((interest, index) => (
                                <span key={index} className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center gap-2">
                                    {interest}
                                    <button onClick={() => removeFromArray('audienceInterests', index)} className="hover:text-red-400">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Brand Identity Section */}
            {activeSection === 'identity' && (
                <div className="card p-6 space-y-5">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        Brand Identity
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Unique Value Proposition</label>
                        <textarea
                            value={profile.uniqueValueProposition}
                            onChange={(e) => updateField('uniqueValueProposition', e.target.value)}
                            placeholder="What makes your brand unique? What problem do you solve better than anyone else?"
                            rows={3}
                            className="textarea w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Mission Statement</label>
                        <textarea
                            value={profile.missionStatement}
                            onChange={(e) => updateField('missionStatement', e.target.value)}
                            placeholder="Why does your brand exist? What impact do you want to make?"
                            rows={2}
                            className="textarea w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Core Brand Values</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                placeholder="Add a value (e.g., Innovation, Trust)"
                                className="input flex-1"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addToArray('brandValues', newValue);
                                        setNewValue('');
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    addToArray('brandValues', newValue);
                                    setNewValue('');
                                }}
                                className="btn-primary px-4"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {profile.brandValues.map((value, index) => (
                                <span key={index} className="px-3 py-1.5 bg-yellow-500/20 text-yellow-300 rounded-full text-sm flex items-center gap-2">
                                    {value}
                                    <button onClick={() => removeFromArray('brandValues', index)} className="hover:text-red-400">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Voice & Tone Section */}
            {activeSection === 'voice' && (
                <div className="card p-6 space-y-5">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-emerald-400" />
                        Voice & Tone
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-3">Brand Voice Type</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {VOICE_OPTIONS.map(voice => (
                                <button
                                    key={voice.id}
                                    onClick={() => updateField('voiceType', voice.id)}
                                    className={`p-4 rounded-xl border transition-all text-left ${profile.voiceType === voice.id
                                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                            : 'bg-white/5 border-white/10 hover:border-white/30 text-white/70'
                                        }`}
                                >
                                    <p className="font-medium">{voice.label}</p>
                                    <p className="text-xs mt-1 opacity-70">{voice.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Tone Keywords</label>
                        <p className="text-xs text-white/50 mb-3">Add words that describe how your content should feel</p>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newToneKeyword}
                                onChange={(e) => setNewToneKeyword(e.target.value)}
                                placeholder="e.g., Confident, Warm, Expert"
                                className="input flex-1"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addToArray('toneKeywords', newToneKeyword);
                                        setNewToneKeyword('');
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    addToArray('toneKeywords', newToneKeyword);
                                    setNewToneKeyword('');
                                }}
                                className="btn-primary px-4"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {profile.toneKeywords.map((keyword, index) => (
                                <span key={index} className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-sm flex items-center gap-2">
                                    {keyword}
                                    <button onClick={() => removeFromArray('toneKeywords', index)} className="hover:text-red-400">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-3">Content Style</label>
                        <div className="flex gap-3">
                            {['concise', 'balanced', 'detailed'].map(style => (
                                <button
                                    key={style}
                                    onClick={() => updateField('contentStyle', style)}
                                    className={`flex-1 p-3 rounded-lg border transition-all capitalize ${profile.contentStyle === style
                                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                            : 'bg-white/5 border-white/10 hover:border-white/30 text-white/70'
                                        }`}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Visual Identity Section */}
            {activeSection === 'visual' && (
                <div className="card p-6 space-y-5">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Palette className="w-5 h-5 text-pink-400" />
                        Visual Identity
                    </h3>

                    {/* Logo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-3">Brand Logo</label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden">
                                {profile.logoUrl ? (
                                    <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <Image className="w-8 h-8 text-white/30" />
                                )}
                            </div>
                            <div className="space-y-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm flex items-center gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload Logo
                                </button>
                                {profile.logoUrl && (
                                    <button
                                        onClick={() => updateField('logoUrl', '')}
                                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 text-sm flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Color Palette */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-3">Brand Colors</label>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <p className="text-xs text-white/50 mb-2">Primary</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={profile.primaryColor}
                                        onChange={(e) => updateField('primaryColor', e.target.value)}
                                        className="w-12 h-12 rounded-lg cursor-pointer border-0"
                                    />
                                    <input
                                        type="text"
                                        value={profile.primaryColor}
                                        onChange={(e) => updateField('primaryColor', e.target.value)}
                                        className="input flex-1 text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-white/50 mb-2">Secondary</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={profile.secondaryColor}
                                        onChange={(e) => updateField('secondaryColor', e.target.value)}
                                        className="w-12 h-12 rounded-lg cursor-pointer border-0"
                                    />
                                    <input
                                        type="text"
                                        value={profile.secondaryColor}
                                        onChange={(e) => updateField('secondaryColor', e.target.value)}
                                        className="input flex-1 text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-white/50 mb-2">Accent</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={profile.accentColor}
                                        onChange={(e) => updateField('accentColor', e.target.value)}
                                        className="w-12 h-12 rounded-lg cursor-pointer border-0"
                                    />
                                    <input
                                        type="text"
                                        value={profile.accentColor}
                                        onChange={(e) => updateField('accentColor', e.target.value)}
                                        className="input flex-1 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quick Palettes */}
                        <p className="text-xs text-white/50 mb-2">Quick Palettes</p>
                        <div className="flex flex-wrap gap-2">
                            {COLOR_PALETTES.map(palette => (
                                <button
                                    key={palette.name}
                                    onClick={() => applyColorPalette(palette)}
                                    className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <div className="flex -space-x-1">
                                        <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: palette.primary }} />
                                        <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: palette.secondary }} />
                                        <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: palette.accent }} />
                                    </div>
                                    <span className="text-xs text-white/70">{palette.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    <div>
                        <p className="text-xs text-white/50 mb-2">Preview</p>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                                {profile.logoUrl && (
                                    <img src={profile.logoUrl} alt="Logo" className="w-10 h-10 rounded-lg object-contain" />
                                )}
                                <div>
                                    <p className="font-bold" style={{ color: profile.primaryColor }}>{profile.brandName || 'Your Brand'}</p>
                                    <p className="text-xs text-white/50">{profile.tagline || 'Your tagline here'}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: profile.primaryColor }}>
                                    Primary Button
                                </button>
                                <button className="px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: profile.secondaryColor }}>
                                    Secondary
                                </button>
                                <span className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: profile.accentColor + '30', color: profile.accentColor }}>
                                    Accent Tag
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Preferences Section */}
            {activeSection === 'content' && (
                <div className="card p-6 space-y-5">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Edit3 className="w-5 h-5 text-orange-400" />
                        Content Preferences
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Preferred Topics</label>
                        <p className="text-xs text-white/50 mb-3">Topics the AI should prioritize in content creation</p>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newTopic}
                                onChange={(e) => setNewTopic(e.target.value)}
                                placeholder="Add a topic..."
                                className="input flex-1"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addToArray('preferredTopics', newTopic);
                                        setNewTopic('');
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    addToArray('preferredTopics', newTopic);
                                    setNewTopic('');
                                }}
                                className="btn-primary px-4"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {profile.preferredTopics.map((topic, index) => (
                                <span key={index} className="px-3 py-1.5 bg-orange-500/20 text-orange-300 rounded-full text-sm flex items-center gap-2">
                                    {topic}
                                    <button onClick={() => removeFromArray('preferredTopics', index)} className="hover:text-red-400">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Topics to Avoid</label>
                        <p className="text-xs text-white/50 mb-3">Topics the AI should never include in content</p>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newAvoidTopic}
                                onChange={(e) => setNewAvoidTopic(e.target.value)}
                                placeholder="Add a topic to avoid..."
                                className="input flex-1"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addToArray('avoidTopics', newAvoidTopic);
                                        setNewAvoidTopic('');
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    addToArray('avoidTopics', newAvoidTopic);
                                    setNewAvoidTopic('');
                                }}
                                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {profile.avoidTopics.map((topic, index) => (
                                <span key={index} className="px-3 py-1.5 bg-red-500/20 text-red-300 rounded-full text-sm flex items-center gap-2">
                                    {topic}
                                    <button onClick={() => removeFromArray('avoidTopics', index)} className="hover:text-white">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Competitor URLs</label>
                        <p className="text-xs text-white/50 mb-3">AI will analyze competitors for content inspiration</p>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="url"
                                value={newCompetitor}
                                onChange={(e) => setNewCompetitor(e.target.value)}
                                placeholder="https://competitor.com"
                                className="input flex-1"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addToArray('competitorUrls', newCompetitor);
                                        setNewCompetitor('');
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    addToArray('competitorUrls', newCompetitor);
                                    setNewCompetitor('');
                                }}
                                className="btn-primary px-4"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {profile.competitorUrls.map((url, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                                    <Globe className="w-4 h-4 text-white/40" />
                                    <span className="text-sm text-white/70 flex-1 truncate">{url}</span>
                                    <button onClick={() => removeFromArray('competitorUrls', index)} className="p-1 hover:bg-red-500/20 rounded text-red-400">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
