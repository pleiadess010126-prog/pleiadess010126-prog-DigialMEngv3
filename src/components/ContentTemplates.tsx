'use client';

import React, { useState } from 'react';
import {
    FileText, Copy, Check, Plus, Search, Filter,
    Smartphone, Globe, Youtube, Instagram, Facebook,
    MoreVertical, Edit3, Trash2, Layout, Sparkles,
    ChevronRight, BookOpen, Megaphone
} from 'lucide-react';

interface ContentTemplate {
    id: string;
    name: string;
    category: 'blog' | 'social' | 'video' | 'email' | 'ad';
    platform?: string;
    description: string;
    structure: string[];
    isCustom?: boolean;
}

const defaultTemplates: ContentTemplate[] = [
    {
        id: '1',
        name: 'SEO Blog Post: The ultimate guide',
        category: 'blog',
        platform: 'WordPress',
        description: 'Comprehensive long-form guide with table of contents and internal linking.',
        structure: ['H1 Title', 'Intro with Hook', 'Table of Contents', 'H2 Main Points', 'Case Study', 'FAQs', 'Conclusion with CTA'],
    },
    {
        id: '2',
        name: 'Instagram Reel: Behind the Scenes',
        category: 'social',
        platform: 'Instagram',
        description: 'Engaging short-form video script for building brand authenticity.',
        structure: ['Action Hook (3s)', 'Problem Context', 'The "Secret" Reveal', 'Process Montage', 'Result/Vibe', 'CTA'],
    },
    {
        id: '3',
        name: 'YouTube Short: Fact/Myth',
        category: 'video',
        platform: 'YouTube',
        description: 'Fast-paced informational content to drive channel growth.',
        structure: ['Big Myth Hook', 'The Truth Reveal', 'Example/Proof', 'Brief Explanation', 'Subscribe CTA'],
    },
    {
        id: '4',
        name: 'Product Launch Email',
        category: 'email',
        description: 'High-conversion email sequence for announcing new features.',
        structure: ['A/B Tested Subject Line', 'Problem Acknowledgment', 'Solution Intro', 'Benefit Bullets', 'Scarcity/Urgency', 'Primary CTA'],
    },
    {
        id: '5',
        name: 'LinkedIn Thought Leadership',
        category: 'social',
        platform: 'LinkedIn',
        description: 'Opinionated post to establish authority in your industry.',
        structure: ['Contra-Intuitive Statement', 'Personal Experience', 'The Core Lesson', '3 Actionable Tips', 'Question to Audience'],
    },
];

export default function ContentTemplates() {
    const [templates, setTemplates] = useState<ContentTemplate[]>(defaultTemplates);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ContentTemplate['category'] | 'all'>('all');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const filteredTemplates = templates.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const copyTemplate = (id: string) => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getCategoryIcon = (category: ContentTemplate['category']) => {
        switch (category) {
            case 'blog': return <Globe className="w-4 h-4 text-blue-400" />;
            case 'social': return <Instagram className="w-4 h-4 text-pink-400" />;
            case 'video': return <Youtube className="w-4 h-4 text-red-400" />;
            case 'email': return <BookOpen className="w-4 h-4 text-emerald-400" />;
            case 'ad': return <Megaphone className="w-4 h-4 text-yellow-400" />;
            default: return <FileText className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-fuchsia-500 to-rose-600 rounded-lg">
                        <Layout className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Content Templates</h2>
                        <p className="text-white/60 text-sm">Pre-optimized structures for every channel</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium flex items-center gap-2 transition-all">
                    <Plus className="w-4 h-4" />
                    New Template
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search templates..."
                        className="input w-full pl-10"
                    />
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl">
                    {['all', 'blog', 'social', 'video', 'email'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat as any)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${selectedCategory === cat
                                    ? 'bg-fuchsia-500 text-white'
                                    : 'text-white/40 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                    <div key={template.id} className="card group hover:border-fuchsia-500/30 transition-all flex flex-col">
                        <div className="p-5 border-b border-white/5 flex justify-between items-start">
                            <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-white/60 uppercase">
                                {getCategoryIcon(template.category)}
                                {template.category}
                            </div>
                            <button className="text-white/40 hover:text-white transition-colors">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-5 flex-1">
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-fuchsia-400 transition-colors">
                                {template.name}
                            </h3>
                            <p className="text-sm text-white/50 mb-4 line-clamp-2">
                                {template.description}
                            </p>

                            <div className="space-y-2">
                                {template.structure.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs text-white/40">
                                        <ChevronRight className="w-3 h-3 text-fuchsia-500" />
                                        {item}
                                    </div>
                                ))}
                                {template.structure.length > 3 && (
                                    <div className="text-xs text-white/20 pl-5">
                                        +{template.structure.length - 3} more points
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-5 border-t border-white/5 bg-white/5 flex gap-2">
                            <button
                                onClick={() => copyTemplate(template.id)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${copiedId === template.id
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                    }`}
                            >
                                {copiedId === template.id ? (
                                    <>
                                        <Check className="w-3 h-3" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3 h-3 text-white/60" />
                                        Use Template
                                    </>
                                )}
                            </button>
                            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/60 hover:text-white transition-all">
                                <Sparkles className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Create New Card */}
                <button className="card border-dashed border-2 border-white/10 hover:border-white/20 flex flex-col items-center justify-center p-8 gap-4 group transition-all">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-fuchsia-500/20 transition-all">
                        <Plus className="w-6 h-6 text-white/20 group-hover:text-fuchsia-400 transition-all" />
                    </div>
                    <div className="text-center">
                        <p className="text-white font-bold">Create Custom Template</p>
                        <p className="text-xs text-white/40">Define your own content structure</p>
                    </div>
                </button>
            </div>

            {/* AI Optimization Banner */}
            <div className="bg-gradient-to-r from-fuchsia-600/20 to-rose-600/20 border border-fuchsia-500/20 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-rose-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-lg">AI Content Optimization</h4>
                        <p className="text-white/60 text-sm">Our AI will automatically tailor these templates based on your brand voice and target audience.</p>
                    </div>
                </div>
                <button className="px-6 py-2 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-white/90 transition-all">
                    Upgrade to Pro
                </button>
            </div>
        </div>
    );
}
