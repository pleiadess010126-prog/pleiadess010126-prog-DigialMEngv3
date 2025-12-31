'use client';

import DashboardHeader from '@/components/DashboardHeader';
import DashboardStats from '@/components/DashboardStats';
import ContentQueue from '@/components/ContentQueue';
import RiskMonitor from '@/components/RiskMonitor';
import AIAgentStatus from '@/components/AIAgentStatus';
import ContentPreviewModal from '@/components/ContentPreviewModal';
import BatchGenerateModal from '@/components/BatchGenerateModal';
import CampaignSettingsModal from '@/components/CampaignSettingsModal';
import PublishingScheduler from '@/components/PublishingScheduler';
import PlatformConnectionStatus from '@/components/PlatformConnectionStatus';
import PublishingCalendar from '@/components/PublishingCalendar';
import CrossPlatformAnalytics from '@/components/CrossPlatformAnalytics';
import ActivityFeed from '@/components/ActivityFeed';
import UsageDisplay from '@/components/UsageDisplay';
import CredentialsSettings from '@/components/CredentialsSettings';
// Phase 5 Components
import AdvancedAnalyticsDashboard from '@/components/AdvancedAnalyticsDashboard';
import ABTestingPanel from '@/components/ABTestingPanel';
import VideoGenerationModal from '@/components/VideoGenerationModal';
import TranslationModal from '@/components/TranslationModal';
import SmartSchedulerModal from '@/components/SmartSchedulerModal';
import PlatformSettings from '@/components/PlatformSettings';
import LanguageSettings from '@/components/LanguageSettings';
import BrandProfileSettings from '@/components/BrandProfileSettings';
import TeamMembers from '@/components/TeamMembers';
import NotificationSettings from '@/components/NotificationSettings';
import UTMBuilder from '@/components/UTMBuilder';
import CalendarExport from '@/components/CalendarExport';
import KeywordResearch from '@/components/KeywordResearch';
import ContentTemplates from '@/components/ContentTemplates';
import CompetitorIntelligence from '@/components/CompetitorIntelligence';
import InfluencerDiscovery from '@/components/InfluencerDiscovery';
import ApprovalWorkflow from '@/components/ApprovalWorkflow';
import HashtagTrends from '@/components/HashtagTrends';
import ContentSplintering from '@/components/ContentSplintering';
import BrandMonitoring from '@/components/BrandMonitoring';
// Phase 7 Components - New Features
import ImageGenerationModal from '@/components/ImageGenerationModal';
import ContentRepurposingModal from '@/components/ContentRepurposingModal';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { canUseFeature } from '@/lib/billing/permissions';
import {
    mockCampaign,
    mockContentItems,
    mockRiskAlerts,
    mockAIAgents,
    mockTopicPillars,
    mockRoadmap,
} from '@/lib/mockData';
import { useState } from 'react';
import Image from 'next/image';
import {
    Folder, TrendingUp, Calendar, Activity, Sparkles, Zap,
    LayoutDashboard, FileText, BarChart3, Settings, Bot,
    Youtube, Instagram, Facebook, Globe, ArrowUpRight, ArrowDownRight, Eye, LogOut, User, Users, Bell, Search, ChevronDown,
    Video, Languages, Clock, FlaskConical, Link2, Building2, Shield, CreditCard, Wrench,
    Scissors, Hash, Target, CheckCircle2, ImageIcon, Wand2, Repeat2
} from 'lucide-react';
import type { ContentItem, Campaign } from '@/types';

type TabType = 'overview' | 'content' | 'analytics' | 'automation' | 'settings';

export default function DashboardPage() {
    const router = useRouter();
    const { user, logout, isAuthenticated } = useAuth();
    const [campaign, setCampaign] = useState(mockCampaign);
    const [contentItems, setContentItems] = useState(mockContentItems);
    const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showBatchGenerate, setShowBatchGenerate] = useState(false);
    const [showCampaignSettings, setShowCampaignSettings] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    // Phase 5 Modal States
    const [showVideoGeneration, setShowVideoGeneration] = useState(false);
    const [showTranslation, setShowTranslation] = useState(false);
    const [showSmartScheduler, setShowSmartScheduler] = useState(false);
    // Phase 7 Modal States - New Features
    const [showImageGeneration, setShowImageGeneration] = useState(false);
    const [showContentRepurposing, setShowContentRepurposing] = useState(false);
    const [analyticsView, setAnalyticsView] = useState<'standard' | 'advanced' | 'abtesting'>('advanced');
    const [settingsTab, setSettingsTab] = useState<string>('brand');
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleApprove = (id: string) => {
        setContentItems((items) =>
            items.map((item) =>
                item.id === id ? { ...item, status: 'approved' as const } : item
            )
        );
    };

    const handleReject = (id: string) => {
        setContentItems((items) =>
            items.map((item) =>
                item.id === id ? { ...item, status: 'rejected' as const } : item
            )
        );
    };

    const handleBatchGenerate = (results: any[]) => {
        const newItems = results.map((content, idx) => ({
            id: `batch-${Date.now()}-${idx}`,
            ...content,
            status: 'pending' as const,
            createdAt: new Date().toISOString(),
        }));
        setContentItems(prev => [...newItems, ...prev]);
    };

    const handleCampaignSettingsSave = (updates: Partial<Campaign>) => {
        setCampaign(prev => ({
            ...prev,
            ...updates,
        }));
    };

    const tabs = [
        { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard, color: 'bg-violet-600' },
        { id: 'content' as TabType, label: 'Content', icon: FileText, color: 'bg-blue-600' },
        { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3, color: 'bg-emerald-600' },
        { id: 'automation' as TabType, label: 'Automation', icon: Bot, color: 'bg-orange-600' },
        { id: 'settings' as TabType, label: 'Settings', icon: Settings, color: 'bg-slate-600' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header - Dark for contrast */}
            <header className="bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 text-white px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/logo.jpg"
                            alt="DigitalMEng Logo"
                            width={44}
                            height={44}
                            className="object-contain"
                            priority
                        />
                        <div>
                            <h1 className="text-xl font-bold">{campaign.name}</h1>
                            <p className="text-sm text-white/60">Autonomous Marketing Engine</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium border border-emerald-500/30">
                            ● Active
                        </span>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm font-medium hidden md:block">
                                    {user?.name || 'Guest'}
                                </span>
                                <ChevronDown className="w-4 h-4 text-white/60" />
                            </button>

                            {/* Dropdown */}
                            {showUserMenu && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                                        <p className="font-semibold text-slate-800">{user?.name || 'Guest User'}</p>
                                        <p className="text-sm text-slate-500">{user?.email || 'guest@demo.com'}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs text-slate-500">{user?.organization || 'Demo Org'}</span>
                                            <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold capitalize">
                                                {user?.plan || 'free'} plan
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                setActiveTab('settings');
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span className="text-sm">Settings</span>
                                        </button>
                                        <button
                                            onClick={() => router.push('/pricing')}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
                                        >
                                            <Zap className="w-4 h-4" />
                                            <span className="text-sm">Upgrade Plan</span>
                                        </button>
                                        {/* Admin Link - Only shown for admin users */}
                                        {user?.isAdmin && (
                                            <>
                                                <button
                                                    onClick={() => router.push('/admin')}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors text-left"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Admin Console</span>
                                                </button>
                                            </>
                                        )}
                                        <hr className="my-2 border-slate-100" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="text-sm">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
                <div className="px-8">
                    <div className="flex gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-6 py-4 text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === tab.id
                                    ? 'text-violet-700'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-8 py-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Content', value: campaign.stats.totalContent.toLocaleString(), change: '+12%', positive: true, icon: FileText, bgColor: 'bg-violet-500', lightBg: 'bg-violet-50' },
                                { label: 'Published', value: campaign.stats.publishedThisMonth.toLocaleString(), change: '+23.5%', positive: true, icon: Globe, bgColor: 'bg-blue-500', lightBg: 'bg-blue-50' },
                                { label: 'Organic Traffic', value: campaign.stats.organicTraffic.toLocaleString(), change: `+${campaign.stats.trafficGrowth}%`, positive: true, icon: TrendingUp, bgColor: 'bg-emerald-500', lightBg: 'bg-emerald-50' },
                                { label: 'Risk Score', value: `${campaign.stats.riskScore}/100`, change: '-5 pts', positive: true, icon: Activity, bgColor: 'bg-orange-500', lightBg: 'bg-orange-50' },
                            ].map((stat, index) => (
                                <div
                                    key={index}
                                    className={`rounded-2xl ${stat.lightBg} border border-slate-200 p-6 hover:shadow-lg transition-all`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                            <stat.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className={`flex items-center gap-1 text-xs font-bold ${stat.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                            {stat.change}
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
                                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Platform Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { name: 'WordPress', icon: Globe, views: '45,892', growth: '+23.5%', bgColor: 'bg-blue-600', lightBg: 'bg-gradient-to-br from-blue-50 to-cyan-50' },
                                { name: 'YouTube', icon: Youtube, views: '127,890', growth: '+67.2%', bgColor: 'bg-red-600', lightBg: 'bg-gradient-to-br from-red-50 to-pink-50' },
                                { name: 'Instagram', icon: Instagram, views: '234,567', growth: '+89.4%', bgColor: 'bg-gradient-to-br from-purple-600 to-pink-600', lightBg: 'bg-gradient-to-br from-purple-50 to-pink-50' },
                                { name: 'Facebook', icon: Facebook, views: '78,234', growth: '+34.8%', bgColor: 'bg-blue-700', lightBg: 'bg-gradient-to-br from-blue-50 to-indigo-50' },
                            ].map((platform, index) => (
                                <div
                                    key={index}
                                    className={`rounded-2xl ${platform.lightBg} border border-slate-200 p-6 hover:shadow-lg transition-all`}
                                >
                                    <div className={`inline-flex p-3 rounded-xl ${platform.bgColor} mb-4`}>
                                        <platform.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-2xl font-bold text-slate-800 mb-1">{platform.views}</div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500 font-medium">{platform.name}</span>
                                        <span className="text-xs font-bold text-emerald-600">{platform.growth}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* AI Agents & Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Bot className="w-5 h-5 text-violet-600" />
                                    AI Agents Status
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {mockAIAgents.map((agent, index) => {
                                        const colors = ['bg-violet-500', 'bg-emerald-500', 'bg-blue-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500'];
                                        return (
                                            <div key={agent.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`w-3 h-3 rounded-full ${agent.status === 'working' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                                    <span className="text-sm font-semibold text-slate-700">{agent.name}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-500">Tasks: {agent.tasksCompleted}</span>
                                                    <span className={`px-2 py-0.5 rounded-full ${agent.status === 'working' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                                        {agent.status}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-emerald-600" />
                                    System Health
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-600 font-medium">Indexation Rate</span>
                                            <span className="font-bold text-slate-800">{campaign.stats.indexationRate}%</span>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: `${campaign.stats.indexationRate}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-600 font-medium">Risk Score</span>
                                            <span className="font-bold text-slate-800">{campaign.stats.riskScore}/100</span>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full" style={{ width: `${campaign.stats.riskScore}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-600 font-medium">AI Uptime</span>
                                            <span className="font-bold text-slate-800">99.9%</span>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: '99.9%' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Tab */}
                {activeTab === 'content' && (
                    <div className="space-y-6">
                        {/* Generate Button */}
                        <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 flex items-center justify-between text-white shadow-lg shadow-violet-500/25">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                                    <Sparkles className="w-6 h-6" />
                                    AI Content Generation
                                </h3>
                                <p className="text-white/80">Generate high-quality content automatically with AI</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowBatchGenerate(true)}
                                    className="px-6 py-3 rounded-xl bg-white text-violet-700 font-bold hover:bg-violet-50 transition-all flex items-center gap-2 shadow-lg"
                                >
                                    <Zap className="w-5 h-5" />
                                    Batch Generate
                                </button>
                            </div>
                        </div>

                        {/* Phase 5+ Quick Actions */}
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                            <button
                                onClick={() => {
                                    if (canUseFeature(user?.plan, 'video-generation')) {
                                        setShowVideoGeneration(true);
                                    } else {
                                        router.push('/pricing');
                                    }
                                }}
                                className={`p-4 rounded-xl text-white hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-3 relative overflow-hidden ${canUseFeature(user?.plan, 'video-generation')
                                    ? 'bg-gradient-to-br from-pink-500 to-rose-600'
                                    : 'bg-slate-400 grayscale'
                                    }`}
                            >
                                {!canUseFeature(user?.plan, 'video-generation') && (
                                    <div className="absolute top-1 right-1">
                                        <Shield className="w-3 h-3 text-white/60" />
                                    </div>
                                )}
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Video className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold flex items-center gap-1">
                                        AI Video
                                        {!canUseFeature(user?.plan, 'video-generation') && <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />}
                                    </p>
                                    <p className="text-xs text-white/80">Generate videos</p>
                                </div>
                            </button>
                            {/* NEW: AI Image Generator */}
                            <button
                                onClick={() => {
                                    if (canUseFeature(user?.plan, 'video-generation')) {
                                        setShowImageGeneration(true);
                                    } else {
                                        router.push('/pricing');
                                    }
                                }}
                                className={`p-4 rounded-xl text-white hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-3 relative overflow-hidden ${canUseFeature(user?.plan, 'video-generation')
                                    ? 'bg-gradient-to-br from-purple-500 to-fuchsia-600'
                                    : 'bg-slate-400 grayscale'
                                    }`}
                            >
                                {!canUseFeature(user?.plan, 'video-generation') && (
                                    <div className="absolute top-1 right-1">
                                        <Shield className="w-3 h-3 text-white/60" />
                                    </div>
                                )}
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Wand2 className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold flex items-center gap-1">
                                        AI Images
                                        {!canUseFeature(user?.plan, 'video-generation') && <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />}
                                    </p>
                                    <p className="text-xs text-white/80">DALL-E / SD</p>
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    if (canUseFeature(user?.plan, 'multi-language')) {
                                        setShowTranslation(true);
                                    } else {
                                        router.push('/pricing');
                                    }
                                }}
                                className={`p-4 rounded-xl text-white hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-3 relative overflow-hidden ${canUseFeature(user?.plan, 'multi-language')
                                    ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                                    : 'bg-slate-400 grayscale'
                                    }`}
                            >
                                {!canUseFeature(user?.plan, 'multi-language') && (
                                    <div className="absolute top-1 right-1">
                                        <Shield className="w-3 h-3 text-white/60" />
                                    </div>
                                )}
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Languages className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold">Translate</p>
                                    <p className="text-xs text-white/80">20+ languages</p>
                                </div>
                            </button>
                            <button
                                onClick={() => setShowSmartScheduler(true)}
                                className="p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-3"
                            >
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold">Smart Schedule</p>
                                    <p className="text-xs text-white/80">AI optimal times</p>
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    if (canUseFeature(user?.plan, 'ab-testing')) {
                                        setActiveTab('analytics');
                                        setAnalyticsView('abtesting');
                                    } else {
                                        router.push('/pricing');
                                    }
                                }}
                                className={`p-4 rounded-xl text-white hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-3 relative overflow-hidden ${canUseFeature(user?.plan, 'ab-testing')
                                    ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                                    : 'bg-slate-400 grayscale'
                                    }`}
                            >
                                {!canUseFeature(user?.plan, 'ab-testing') && (
                                    <div className="absolute top-1 right-1">
                                        <Shield className="w-3 h-3 text-white/60" />
                                    </div>
                                )}
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <FlaskConical className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold">A/B Testing</p>
                                    <p className="text-xs text-white/80">Optimize content</p>
                                </div>
                            </button>
                            {/* NEW: Content Repurposing */}
                            <button
                                onClick={() => setShowContentRepurposing(true)}
                                className="p-4 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-3"
                            >
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Repeat2 className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold">Repurpose</p>
                                    <p className="text-xs text-white/80">8+ formats</p>
                                </div>
                            </button>
                        </div>

                        {/* Content Queue */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    Content Queue
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    {contentItems.slice(0, 6).map((item, index) => {
                                        const statusColors: Record<string, string> = {
                                            published: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                                            approved: 'bg-blue-100 text-blue-700 border-blue-200',
                                            pending: 'bg-amber-100 text-amber-700 border-amber-200',
                                            draft: 'bg-slate-100 text-slate-700 border-slate-200',
                                        };
                                        const typeColors: Record<string, string> = {
                                            blog: 'bg-violet-500',
                                            'youtube-short': 'bg-red-500',
                                            'instagram-reel': 'bg-pink-500',
                                            'facebook-story': 'bg-blue-600',
                                        };
                                        return (
                                            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                                                <div className={`w-2 h-12 rounded-full ${typeColors[item.type] || 'bg-slate-400'}`} />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-slate-800 truncate">{item.title}</h4>
                                                    <p className="text-sm text-slate-500">{item.type.replace('-', ' ')} • SEO Score: {item.metadata.seoScore}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[item.status] || statusColors.draft}`}>
                                                    {item.status}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        setSelectedContent(item);
                                                        setShowPreview(true);
                                                    }}
                                                    className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-300 flex items-center gap-1"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Preview
                                                </button>
                                                {item.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleApprove(item.id)} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600">Approve</button>
                                                        <button onClick={() => handleReject(item.id)} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600">Reject</button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Topic Pillars */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <Folder className="w-5 h-5 text-amber-600" />
                                    Topic Pillars
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {mockTopicPillars.map((pillar, index) => {
                                        const colors = ['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500'];
                                        const lightColors = ['bg-violet-50', 'bg-blue-50', 'bg-emerald-50', 'bg-orange-50', 'bg-pink-50', 'bg-cyan-50'];
                                        return (
                                            <div key={pillar.id} className={`p-5 rounded-xl ${lightColors[index % lightColors.length]} border border-slate-200 hover:shadow-md transition-all`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className={`p-2 rounded-lg ${colors[index % colors.length]}`}>
                                                        <TrendingUp className="w-4 h-4 text-white" />
                                                    </div>
                                                    <span className="text-2xl font-black text-slate-800">{pillar.contentCount}</span>
                                                </div>
                                                <h3 className="font-bold text-slate-800 mb-2">{pillar.name}</h3>
                                                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{pillar.description}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {pillar.keywords.slice(0, 3).map((keyword, idx) => (
                                                        <span key={idx} className="px-2 py-0.5 bg-white rounded text-[10px] text-slate-600 border border-slate-200">
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        {/* Analytics View Toggle */}
                        <div className="flex items-center justify-between">
                            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200">
                                <button
                                    onClick={() => setAnalyticsView('advanced')}
                                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${analyticsView === 'advanced'
                                        ? 'bg-violet-600 text-white shadow-lg'
                                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                                        }`}
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    Advanced Analytics
                                </button>
                                <button
                                    onClick={() => setAnalyticsView('abtesting')}
                                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${analyticsView === 'abtesting'
                                        ? 'bg-violet-600 text-white shadow-lg'
                                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                                        }`}
                                >
                                    <FlaskConical className="w-4 h-4" />
                                    A/B Testing
                                </button>
                                <button
                                    onClick={() => setAnalyticsView('standard')}
                                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${analyticsView === 'standard'
                                        ? 'bg-violet-600 text-white shadow-lg'
                                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                                        }`}
                                >
                                    <Calendar className="w-4 h-4" />
                                    Roadmap
                                </button>
                            </div>
                        </div>

                        {/* Advanced Analytics Dashboard (Phase 5) */}
                        {analyticsView === 'advanced' && (
                            <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                                <AdvancedAnalyticsDashboard />
                            </div>
                        )}

                        {/* A/B Testing Panel (Phase 5) */}
                        {analyticsView === 'abtesting' && (
                            <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                                <ABTestingPanel />
                            </div>
                        )}

                        {/* Standard Roadmap View */}
                        {analyticsView === 'standard' && (
                            <>
                                {/* Weekly Performance */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-emerald-600" />
                                        Weekly Performance
                                    </h3>
                                    <div className="space-y-4">
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                                            const values = [65, 85, 70, 95, 80, 60, 45];
                                            const colors = ['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500', 'bg-indigo-500'];
                                            return (
                                                <div key={day} className="flex items-center gap-4">
                                                    <span className="text-sm text-slate-600 font-medium w-24">{day}</span>
                                                    <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${colors[index]} rounded-full transition-all duration-500`}
                                                            style={{ width: `${values[index]}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700 w-12 text-right">{values[index]}%</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 90-Day Roadmap */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-200">
                                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-orange-600" />
                                            90-Day Content Roadmap
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {mockRoadmap.map((item, index) => {
                                                const statusStyles: Record<string, string> = {
                                                    completed: 'bg-emerald-500 text-white',
                                                    'in-progress': 'bg-amber-500 text-white',
                                                    upcoming: 'bg-slate-200 text-slate-600',
                                                };
                                                const cardStyles: Record<string, string> = {
                                                    completed: 'bg-emerald-50 border-emerald-200',
                                                    'in-progress': 'bg-amber-50 border-amber-200',
                                                    upcoming: 'bg-slate-50 border-slate-200',
                                                };
                                                return (
                                                    <div key={index} className={`p-4 rounded-xl border ${cardStyles[item.status]}`}>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-bold text-slate-700">Week {item.week}</span>
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusStyles[item.status]}`}>
                                                                {item.status}
                                                            </span>
                                                        </div>
                                                        <div className="text-3xl font-black text-slate-800">{item.contentTarget}</div>
                                                        <div className="text-xs text-slate-500">items</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Automation Tab */}
                {activeTab === 'automation' && (
                    <div className="space-y-6">
                        {/* Risk Alerts */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-red-600" />
                                    Risk Monitor
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    {mockRiskAlerts.map((alert) => {
                                        const severityStyles: Record<string, string> = {
                                            low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                                            medium: 'bg-amber-100 text-amber-700 border-amber-200',
                                            high: 'bg-orange-100 text-orange-700 border-orange-200',
                                            critical: 'bg-red-100 text-red-700 border-red-200',
                                        };
                                        return (
                                            <div key={alert.id} className={`p-4 rounded-xl border ${alert.resolved ? 'bg-slate-50 border-slate-200' : severityStyles[alert.severity]}`}>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{alert.message}</p>
                                                        <p className="text-sm text-slate-500 mt-1">{alert.recommendation}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${alert.resolved ? 'bg-emerald-100 text-emerald-700' : severityStyles[alert.severity]}`}>
                                                        {alert.resolved ? 'Resolved' : alert.severity}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Publishing Schedule */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                Publishing Schedule
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { label: 'Today', count: 3, color: 'bg-violet-500' },
                                    { label: 'This Week', count: 12, color: 'bg-blue-500' },
                                    { label: 'This Month', count: 45, color: 'bg-emerald-500' },
                                ].map((item, index) => (
                                    <div key={index} className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center">
                                        <div className={`inline-flex p-3 rounded-xl ${item.color} mb-4`}>
                                            <FileText className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-4xl font-black text-slate-800 mb-1">{item.count}</div>
                                        <div className="text-sm text-slate-500 font-medium">{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="flex gap-6 min-h-[600px]">
                        {/* Settings Sidebar */}
                        <div className="w-64 flex-shrink-0">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-20">
                                <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-fuchsia-50">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <Settings className="w-5 h-5 text-violet-600" />
                                        Settings
                                    </h3>
                                </div>
                                <nav className="p-2 space-y-4">
                                    {[
                                        {
                                            group: 'Brand & Setup',
                                            items: [
                                                { id: 'brand', label: 'Brand Profile', icon: Building2, color: 'text-violet-600', bg: 'bg-violet-50' },
                                                { id: 'language', label: 'Languages', icon: Languages, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                                                { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-rose-600', bg: 'bg-rose-50' },
                                            ]
                                        },
                                        {
                                            group: 'Content Studio',
                                            items: [
                                                { id: 'campaign', label: 'Campaign', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' },
                                                { id: 'approval', label: 'Approval Pipeline', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                                { id: 'splinter', label: 'Splinter Wizard', icon: Scissors, color: 'text-orange-600', bg: 'bg-orange-50' },
                                                { id: 'seo', label: 'SEO & Content', icon: Search, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                            ]
                                        },
                                        {
                                            group: 'Intelligence',
                                            items: [
                                                { id: 'competitor', label: 'Competitive Intel', icon: Target, color: 'text-rose-600', bg: 'bg-rose-50' },
                                                { id: 'influencers', label: 'Influencer Discovery', icon: Users, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
                                                { id: 'hashtags', label: 'Hashtag Trends', icon: Hash, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                                { id: 'monitoring', label: 'Reputation Monitor', icon: Shield, color: 'text-red-600', bg: 'bg-red-50' },
                                            ]
                                        },
                                        {
                                            group: 'Operations',
                                            items: [
                                                { id: 'team', label: 'Team', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
                                                { id: 'platforms', label: 'Platforms', icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                                { id: 'automation', label: 'Automation', icon: Bot, color: 'text-orange-600', bg: 'bg-orange-50' },
                                                { id: 'tools', label: 'Marketing Tools', icon: Wrench, color: 'text-slate-600', bg: 'bg-slate-50' },
                                            ]
                                        },
                                        {
                                            group: 'System',
                                            items: [
                                                { id: 'credentials', label: 'API Keys', icon: Shield, color: 'text-red-600', bg: 'bg-red-50' },
                                                { id: 'billing', label: 'Usage & Billing', icon: CreditCard, color: 'text-pink-600', bg: 'bg-pink-50' },
                                            ]
                                        }
                                    ].map((section) => (
                                        <div key={section.group} className="space-y-1">
                                            <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 mt-4 ml-1">
                                                {section.group}
                                            </p>
                                            {section.items.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => setSettingsTab(item.id)}
                                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all ${settingsTab === item.id
                                                        ? `${item.bg} ${item.color} font-bold shadow-sm ring-1 ring-inset ring-black/5`
                                                        : 'text-slate-600 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <item.icon className={`w-4 h-4 ${settingsTab === item.id ? item.color : 'text-slate-400'}`} />
                                                    <span className="text-sm">{item.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Settings Content */}
                        <div className="flex-1 space-y-6">
                            {/* Brand Profile Sub-tab */}
                            {settingsTab === 'brand' && (
                                <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                                    <BrandProfileSettings
                                        initialProfile={{
                                            brandName: campaign.name,
                                            industry: 'Technology / SaaS',
                                            websiteUrl: 'https://digitalmeng.com',
                                            targetAudience: 'Digital marketers and content creators looking to scale their organic reach',
                                            voiceType: 'professional',
                                        }}
                                        onSave={(profile) => {
                                            console.log('Brand profile saved:', profile);
                                            setCampaign(prev => ({ ...prev, name: profile.brandName }));
                                        }}
                                    />
                                </div>
                            )}

                            {/* Campaign Sub-tab */}
                            {settingsTab === 'campaign' && (
                                <div className="space-y-6">
                                    {/* Campaign Info */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                <Zap className="w-5 h-5 text-blue-600" />
                                                Campaign Settings
                                            </h2>
                                            <p className="text-sm text-slate-500 mt-1">Configure your marketing campaign parameters</p>
                                        </div>
                                        <div className="p-6 space-y-5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Campaign Name</label>
                                                    <input
                                                        type="text"
                                                        value={campaign.name}
                                                        onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                                                    <div className="flex gap-2">
                                                        {['active', 'paused', 'completed'].map((status) => (
                                                            <button
                                                                key={status}
                                                                onClick={() => setCampaign({ ...campaign, status: status as 'active' | 'paused' | 'completed' })}
                                                                className={`flex-1 px-4 py-3 rounded-xl font-medium capitalize transition-all ${campaign.status === status
                                                                    ? status === 'active' ? 'bg-emerald-500 text-white'
                                                                        : status === 'paused' ? 'bg-amber-500 text-white'
                                                                            : 'bg-slate-500 text-white'
                                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                                    }`}
                                                            >
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Publishing Velocity */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="p-5 border-b border-slate-200">
                                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                                                Publishing Velocity
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-1">Content publishing pace over 90 days</p>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {[
                                                    { label: 'Month 1', key: 'month1', color: 'from-violet-500 to-purple-600' },
                                                    { label: 'Month 2', key: 'month2', color: 'from-blue-500 to-cyan-600' },
                                                    { label: 'Month 3', key: 'month3', color: 'from-emerald-500 to-teal-600' },
                                                ].map((month) => (
                                                    <div key={month.key} className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <span className="font-semibold text-slate-700">{month.label}</span>
                                                            <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${month.color} text-white text-sm font-bold`}>
                                                                {campaign.settings.velocity[month.key as keyof typeof campaign.settings.velocity]} items
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="5"
                                                            max="100"
                                                            value={campaign.settings.velocity[month.key as keyof typeof campaign.settings.velocity]}
                                                            onChange={(e) => setCampaign({
                                                                ...campaign,
                                                                settings: { ...campaign.settings, velocity: { ...campaign.settings.velocity, [month.key]: parseInt(e.target.value) } }
                                                            })}
                                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Types */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="p-5 border-b border-slate-200">
                                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                                Content Types
                                            </h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {[
                                                    { key: 'blog', label: 'Blog Posts', icon: Globe, color: 'bg-violet-500' },
                                                    { key: 'youtube', label: 'YouTube', icon: Youtube, color: 'bg-red-500' },
                                                    { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
                                                    { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
                                                ].map((type) => {
                                                    const isEnabled = campaign.settings.contentTypes[type.key as keyof typeof campaign.settings.contentTypes];
                                                    return (
                                                        <button
                                                            key={type.key}
                                                            onClick={() => setCampaign({
                                                                ...campaign,
                                                                settings: { ...campaign.settings, contentTypes: { ...campaign.settings.contentTypes, [type.key]: !isEnabled } }
                                                            })}
                                                            className={`p-5 rounded-xl border-2 transition-all ${isEnabled ? 'border-violet-500 bg-violet-50' : 'border-slate-200 bg-slate-50 opacity-60'}`}
                                                        >
                                                            <div className={`inline-flex p-3 rounded-xl ${isEnabled ? type.color : 'bg-slate-300'} mb-3`}>
                                                                <type.icon className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div className="font-semibold text-slate-800 text-sm">{type.label}</div>
                                                            <div className={`text-xs mt-1 ${isEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                                {isEnabled ? '✓ Enabled' : 'Disabled'}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Platforms Sub-tab */}
                            {settingsTab === 'platforms' && (
                                <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                                    <PlatformSettings />
                                </div>
                            )}

                            {/* Language Sub-tab */}
                            {settingsTab === 'language' && (
                                <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                                    <LanguageSettings
                                        primaryLanguage="en"
                                        targetMarkets={['es', 'fr', 'de', 'zh', 'ja']}
                                    />
                                </div>
                            )}

                            {/* Team Sub-tab */}
                            {settingsTab === 'team' && (
                                <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                                    <TeamMembers />
                                </div>
                            )}

                            {/* Notifications Sub-tab */}
                            {settingsTab === 'notifications' && (
                                <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                                    <NotificationSettings />
                                </div>
                            )}

                            {/* Tools Sub-tab */}
                            {settingsTab === 'tools' && (
                                <div className="space-y-6">
                                    <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                                        <UTMBuilder />
                                    </div>
                                    <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                                        <CalendarExport />
                                    </div>
                                </div>
                            )}

                            {/* SEO & Content Sub-tab */}
                            {settingsTab === 'seo' && (
                                <div className="space-y-6">
                                    <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                                        <KeywordResearch />
                                    </div>
                                    <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                                        <ContentTemplates />
                                    </div>
                                </div>
                            )}

                            {/* Competitor Sub-tab */}
                            {settingsTab === 'competitor' && (
                                <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                                    <CompetitorIntelligence />
                                </div>
                            )}

                            {/* Influencer Discovery Sub-tab */}
                            {settingsTab === 'influencers' && (
                                <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                                    <InfluencerDiscovery />
                                </div>
                            )}

                            {/* Approval Pipeline Sub-tab */}
                            {settingsTab === 'approval' && (
                                <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                                    <ApprovalWorkflow />
                                </div>
                            )}

                            {/* Hashtag Trends Sub-tab */}
                            {settingsTab === 'hashtags' && (
                                <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                                    <HashtagTrends />
                                </div>
                            )}

                            {/* Content Splintering Sub-tab */}
                            {settingsTab === 'splinter' && (
                                <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                                    <ContentSplintering />
                                </div>
                            )}

                            {/* Brand Monitoring Sub-tab */}
                            {settingsTab === 'monitoring' && (
                                <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                                    <BrandMonitoring />
                                </div>
                            )}

                            {/* Automation Sub-tab */}
                            {settingsTab === 'automation' && (
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-amber-50">
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            <Bot className="w-5 h-5 text-orange-600" />
                                            Automation Settings
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">Configure how content is automatically processed</p>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {[
                                            { key: 'autoPublish', label: 'Auto-Publish', description: 'Automatically publish approved content', enabled: campaign.settings.autoPublish },
                                            { key: 'requireApproval', label: 'Require Approval', description: 'Review content before publishing', enabled: campaign.settings.requireApproval },
                                        ].map((setting) => (
                                            <div key={setting.key} className="flex items-center justify-between p-5 rounded-xl bg-slate-50 border border-slate-200">
                                                <div>
                                                    <div className="font-semibold text-slate-800">{setting.label}</div>
                                                    <div className="text-sm text-slate-500">{setting.description}</div>
                                                </div>
                                                <button
                                                    onClick={() => setCampaign({
                                                        ...campaign,
                                                        settings: { ...campaign.settings, [setting.key]: !setting.enabled }
                                                    })}
                                                    className={`relative w-14 h-8 rounded-full transition-colors ${setting.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                                >
                                                    <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${setting.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                                </button>
                                            </div>
                                        ))}

                                        {/* AI Agent Settings */}
                                        <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
                                            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-violet-600" />
                                                AI Agent Configuration
                                            </h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-slate-600">Content Quality Check</span>
                                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">Enabled</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-slate-600">SEO Optimization</span>
                                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">Enabled</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-slate-600">Plagiarism Detection</span>
                                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">Enabled</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Credentials Sub-tab */}
                            {settingsTab === 'credentials' && (
                                <CredentialsSettings />
                            )}

                            {/* Billing Sub-tab */}
                            {settingsTab === 'billing' && (
                                <UsageDisplay />
                            )}

                            {/* Save Button */}
                            <div className="flex justify-end pt-4">
                                <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/25 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Save All Settings
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ContentPreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                content={selectedContent}
                onSave={(updated) => {
                    setContentItems(prev => prev.map(item => item.id === updated.id ? updated : item));
                    setShowPreview(false);
                }}
                onApprove={(content) => {
                    setContentItems(prev => prev.map(item => item.id === content.id ? { ...content, status: 'approved' } : item));
                }}
            />

            <BatchGenerateModal
                isOpen={showBatchGenerate}
                onClose={() => setShowBatchGenerate(false)}
                topicPillars={mockTopicPillars}
                onGenerate={handleBatchGenerate}
            />

            <CampaignSettingsModal
                campaign={campaign}
                isOpen={showCampaignSettings}
                onClose={() => setShowCampaignSettings(false)}
                onSave={handleCampaignSettingsSave}
            />

            {/* Phase 5 Modals */}
            <VideoGenerationModal
                isOpen={showVideoGeneration}
                onClose={() => setShowVideoGeneration(false)}
                content={selectedContent ? { title: selectedContent.title, content: selectedContent.content } : undefined}
            />

            <TranslationModal
                isOpen={showTranslation}
                onClose={() => setShowTranslation(false)}
                content={selectedContent ? {
                    title: selectedContent.title,
                    content: selectedContent.content,
                    keywords: selectedContent.metadata?.keywords
                } : undefined}
            />

            <SmartSchedulerModal
                isOpen={showSmartScheduler}
                onClose={() => setShowSmartScheduler(false)}
                content={selectedContent ? {
                    id: selectedContent.id,
                    title: selectedContent.title,
                    platform: selectedContent.type
                } : undefined}
            />

            {/* Phase 7 Modals - New Features */}
            <ImageGenerationModal
                isOpen={showImageGeneration}
                onClose={() => setShowImageGeneration(false)}
                onSelectImage={(imageUrl) => {
                    console.log('Selected image:', imageUrl);
                    // Could be used to add image to content
                }}
            />

            <ContentRepurposingModal
                isOpen={showContentRepurposing}
                onClose={() => setShowContentRepurposing(false)}
                initialContent={selectedContent ? {
                    title: selectedContent.title,
                    content: selectedContent.content
                } : undefined}
            />
        </div>
    );
}
