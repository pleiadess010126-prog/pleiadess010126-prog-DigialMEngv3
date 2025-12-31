'use client';

import { useState } from 'react';
import {
    Search, Users, Star, TrendingUp, Filter,
    Plus, Download, ExternalLink, Heart, MessageCircle,
    UserPlus, CheckCircle2, Globe, MapPin,
    Instagram, Youtube, Twitter, Facebook, Sparkles, Bot
} from 'lucide-react';

interface Influencer {
    id: string;
    name: string;
    handle: string;
    platform: 'instagram' | 'youtube' | 'tiktok' | 'twitter';
    category: string;
    location: string;
    followers: string;
    engagementRate: string;
    avgLikes: string;
    status: 'new' | 'contacted' | 'partner';
    avatar: string;
}

const MOCK_INFLUENCERS: Influencer[] = [
    {
        id: '1',
        name: 'Sarah Chen',
        handle: '@sarahmarketing',
        platform: 'instagram',
        category: 'Tech & SaaS',
        location: 'San Francisco, CA',
        followers: '125K',
        engagementRate: '4.8%',
        avgLikes: '5.2K',
        status: 'new',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
    },
    {
        id: '2',
        name: 'Marcus Digital',
        handle: 'MarcusVlogs',
        platform: 'youtube',
        category: 'Business Automation',
        location: 'London, UK',
        followers: '850K',
        engagementRate: '3.2%',
        avgLikes: '12K',
        status: 'partner',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
    },
    {
        id: '3',
        name: 'Elena AI',
        handle: '@elena_tech',
        platform: 'twitter',
        category: 'Artificial Intelligence',
        location: 'Berlin, Germany',
        followers: '45K',
        engagementRate: '6.5%',
        avgLikes: '800',
        status: 'contacted',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
    }
];

export default function InfluencerDiscovery() {
    const [influencers, setInfluencers] = useState<Influencer[]>(MOCK_INFLUENCERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const categories = ['All', 'Tech & SaaS', 'Business Automation', 'Artificial Intelligence', 'Lifestyle', 'E-commerce'];

    // Filter influencers based on search term, category, and platform
    const filteredInfluencers = influencers.filter((inf) => {
        // Search filter - check name, handle, category, and location
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === '' ||
            inf.name.toLowerCase().includes(searchLower) ||
            inf.handle.toLowerCase().includes(searchLower) ||
            inf.category.toLowerCase().includes(searchLower) ||
            inf.location.toLowerCase().includes(searchLower);

        // Category filter
        const matchesCategory = selectedCategory === 'All' || inf.category === selectedCategory;

        // Platform filter
        const matchesPlatform = selectedPlatform === null || inf.platform === selectedPlatform;

        return matchesSearch && matchesCategory && matchesPlatform;
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API delay
        setTimeout(() => setLoading(false), 500);
    };

    const togglePlatformFilter = (platform: string) => {
        setSelectedPlatform(prev => prev === platform ? null : platform);
    };

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Users className="w-6 h-6 text-fuchsia-600" />
                        Influencer Discovery
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium">
                        Find and connect with high-impact creators in your niche.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all">
                        <Download className="w-4 h-4" />
                        Export List
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white rounded-xl font-semibold hover:from-fuchsia-500 hover:to-violet-500 transition-all shadow-lg shadow-fuchsia-500/25">
                        <Sparkles className="w-5 h-5" />
                        AI Search
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by keywords, name, or social handle..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10 transition-all font-medium"
                    />
                </form>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-2 mr-4">
                        <button
                            onClick={() => togglePlatformFilter('instagram')}
                            className={`p-2 rounded-lg border transition-all ${selectedPlatform === 'instagram' ? 'bg-pink-100 border-pink-500' : 'bg-slate-50 border-slate-200 hover:border-fuchsia-500'}`}
                        >
                            <Instagram className="w-4 h-4 text-pink-600" />
                        </button>
                        <button
                            onClick={() => togglePlatformFilter('youtube')}
                            className={`p-2 rounded-lg border transition-all ${selectedPlatform === 'youtube' ? 'bg-red-100 border-red-500' : 'bg-slate-50 border-slate-200 hover:border-red-500'}`}
                        >
                            <Youtube className="w-4 h-4 text-red-600" />
                        </button>
                        <button
                            onClick={() => togglePlatformFilter('twitter')}
                            className={`p-2 rounded-lg border transition-all ${selectedPlatform === 'twitter' ? 'bg-blue-100 border-blue-400' : 'bg-slate-50 border-slate-200 hover:border-blue-400'}`}
                        >
                            <Twitter className="w-4 h-4 text-blue-400" />
                        </button>
                    </div>

                    <div className="h-8 w-px bg-slate-200 mx-2" />

                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${selectedCategory === cat
                                ? 'bg-fuchsia-100 text-fuchsia-700 border-2 border-fuchsia-200'
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-2 border-transparent'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}

                    <button className="ml-auto flex items-center gap-2 text-sm font-bold text-fuchsia-600 hover:text-fuchsia-700">
                        <Filter className="w-4 h-4" />
                        Advanced Filters
                    </button>
                </div>
            </div>

            {/* AI Recommendation Alert */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white flex items-center justify-between shadow-xl shadow-fuchsia-500/20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="font-bold">AI Opportunity Identified</p>
                        <p className="text-sm text-white/80">3 new creators in your niche just crossed 100K followers with high engagement. Connect now?</p>
                    </div>
                </div>
                <button className="px-6 py-2 bg-white text-fuchsia-600 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                    View Match
                </button>
            </div>

            {/* Influencer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-10 bg-slate-50 rounded-xl" />
                                <div className="h-10 bg-slate-50 rounded-xl" />
                                <div className="h-10 bg-slate-50 rounded-xl" />
                            </div>
                        </div>
                    ))
                ) : filteredInfluencers.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <Search className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-600 mb-2">No influencers found</h3>
                        <p className="text-slate-400 max-w-md">
                            Try adjusting your search terms, category, or platform filters to find more creators.
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedPlatform(null); }}
                            className="mt-4 px-6 py-2 bg-fuchsia-100 text-fuchsia-600 rounded-xl font-semibold hover:bg-fuchsia-200 transition-all"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    filteredInfluencers.map((inf) => (
                        <div key={inf.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                            {/* Platform Icon Overlay */}
                            <div className="absolute top-4 right-4">
                                {inf.platform === 'instagram' && <Instagram className="w-5 h-5 text-pink-500" />}
                                {inf.platform === 'youtube' && <Youtube className="w-5 h-5 text-red-500" />}
                                {inf.platform === 'twitter' && <Twitter className="w-5 h-5 text-blue-400" />}
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative">
                                    <img
                                        src={inf.avatar}
                                        alt={inf.name}
                                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100"
                                    />
                                    {inf.status === 'partner' && (
                                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                                            <CheckCircle2 className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 flex items-center gap-1">
                                        {inf.name}
                                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                                    </h4>
                                    <p className="text-sm text-slate-500">{inf.handle}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <MapPin className="w-3 h-3 text-slate-400" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{inf.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 mb-6 font-bold text-center">
                                <div>
                                    <p className="text-lg text-slate-800">{inf.followers}</p>
                                    <p className="text-[10px] text-slate-400 uppercase">Followers</p>
                                </div>
                                <div>
                                    <p className="text-lg text-emerald-600">{inf.engagementRate}</p>
                                    <p className="text-[10px] text-slate-400 uppercase">Eng. Rate</p>
                                </div>
                                <div>
                                    <p className="text-lg text-slate-800">{inf.avgLikes}</p>
                                    <p className="text-[10px] text-slate-400 uppercase">Avg Likes</p>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-600 text-[10px] font-bold uppercase tracking-wider">
                                    {inf.category}
                                </span>
                                {inf.status === 'partner' && (
                                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                                        Active Partner
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    Contact
                                </button>
                                <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-pink-500">
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-400">
                                    <ExternalLink className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
