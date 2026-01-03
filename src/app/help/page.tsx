'use client';

import { useState } from 'react';
import {
    BookOpen,
    ChevronRight,
    Rocket,
    Zap,
    Building2,
    Star,
    Search,
    ExternalLink,
    CheckCircle2,
    Clock,
    Users,
    BarChart3,
    Settings,
    Shield,
    Headphones
} from 'lucide-react';

// Type definitions
interface PlaybookItem {
    title: string;
    time?: string;
}

interface PlaybookSection {
    title: string;
    items: PlaybookItem[];
}

interface Playbook {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    badge: string;
    sections: PlaybookSection[];
}

// Playbook content sections
const playbooks: Record<string, Playbook> = {
    free: {
        title: 'Free Quick Start',
        icon: Star,
        color: 'from-gray-500 to-slate-600',
        badge: 'Free',
        sections: [
            {
                title: 'Getting Started',
                items: [
                    { title: 'Create your account', time: '2 min' },
                    { title: 'Complete your profile', time: '5 min' },
                    { title: 'Generate your first content', time: '3 min' },
                    { title: 'Review and edit', time: '5 min' },
                ]
            },
            {
                title: 'Free Plan Features',
                items: [
                    { title: '10 AI content pieces/month' },
                    { title: '1 platform connection' },
                    { title: 'Basic GEO optimization' },
                    { title: 'Community support' },
                ]
            },
            {
                title: 'Best Practices',
                items: [
                    { title: 'Focus on one platform' },
                    { title: 'Quality over quantity' },
                    { title: 'Learn GEO basics' },
                    { title: 'Track your progress' },
                ]
            }
        ]
    },
    starter: {
        title: 'Starter Playbook',
        icon: Zap,
        color: 'from-blue-500 to-cyan-500',
        badge: 'Starter',
        sections: [
            {
                title: 'Quick Setup (30 min)',
                items: [
                    { title: 'Complete brand profile', time: '5 min' },
                    { title: 'Connect first platform', time: '10 min' },
                    { title: 'Set up topic pillars', time: '10 min' },
                    { title: 'Generate first content', time: '5 min' },
                ]
            },
            {
                title: 'Your First Week',
                items: [
                    { title: 'Day 1: Foundation setup' },
                    { title: 'Day 2: Expand to 2nd platform' },
                    { title: 'Day 3: Refine and optimize' },
                    { title: 'Day 4-5: Optimize workflow' },
                    { title: 'Day 6-7: Scale operations' },
                ]
            },
            {
                title: 'Platform Connections',
                items: [
                    { title: 'WordPress setup guide' },
                    { title: 'Meta (Instagram/Facebook) setup' },
                    { title: 'YouTube setup' },
                    { title: 'Platform priority guide' },
                ]
            },
            {
                title: 'Content Generation',
                items: [
                    { title: 'Single content generation' },
                    { title: 'Batch generation (10 at a time)' },
                    { title: 'Content review & editing' },
                    { title: 'Quality checklist' },
                ]
            },
            {
                title: 'GEO Optimization',
                items: [
                    { title: 'Understanding GEO scores' },
                    { title: 'The 8 GEO metrics explained' },
                    { title: 'Improving low scores' },
                    { title: 'Target score: 70+' },
                ]
            },
            {
                title: 'Daily & Weekly Routines',
                items: [
                    { title: 'Daily check-in (10 min)' },
                    { title: 'Weekly review (30 min)' },
                    { title: 'Monthly checkup (1 hour)' },
                ]
            }
        ]
    },
    pro: {
        title: 'Pro User Playbook',
        icon: Rocket,
        color: 'from-violet-500 to-purple-600',
        badge: 'Pro',
        sections: [
            {
                title: 'Quick Start (First 24 Hours)',
                items: [
                    { title: 'Hour 1: Complete setup' },
                    { title: 'Hour 2-4: Generate first content' },
                    { title: 'Hour 4-8: Setup automation' },
                    { title: 'Day 2-7: Monitor & optimize' },
                ]
            },
            {
                title: 'Content Strategy',
                items: [
                    { title: 'Topic pillar framework' },
                    { title: 'Content mix ratio (40/25/20/15)' },
                    { title: 'Velocity ramp-up strategy' },
                    { title: '3-month scaling plan' },
                ]
            },
            {
                title: 'AI Content Generation',
                items: [
                    { title: 'Batch generation workflow' },
                    { title: 'AI model selection guide' },
                    { title: 'Content refinement tools' },
                    { title: 'Pro-exclusive options' },
                ]
            },
            {
                title: 'Multi-Platform Publishing',
                items: [
                    { title: 'Publishing workflow' },
                    { title: 'Platform-specific optimization' },
                    { title: 'Cross-platform repurposing' },
                    { title: 'Content splintering' },
                ]
            },
            {
                title: 'Advanced GEO',
                items: [
                    { title: '8-metric deep dive' },
                    { title: 'Score interpretation (A+ to F)' },
                    { title: 'Quick wins (+5-15 points)' },
                    { title: 'Advanced techniques (+10-25)' },
                ]
            },
            {
                title: 'Automation & Autopilot',
                items: [
                    { title: 'Full autopilot configuration' },
                    { title: 'Smart scheduling' },
                    { title: 'Risk monitoring' },
                    { title: 'Alert configuration' },
                ]
            },
            {
                title: 'Advanced Features',
                items: [
                    { title: 'A/B testing' },
                    { title: 'AI voice cloning' },
                    { title: 'Trend hijacking' },
                    { title: 'Competitor intelligence' },
                    { title: 'API access' },
                ]
            },
            {
                title: 'Team Collaboration',
                items: [
                    { title: 'Roles & permissions' },
                    { title: 'Approval workflows' },
                    { title: 'Activity tracking' },
                ]
            }
        ]
    },
    enterprise: {
        title: 'Enterprise Playbook',
        icon: Building2,
        color: 'from-amber-500 to-orange-600',
        badge: 'Enterprise',
        sections: [
            {
                title: 'Enterprise Onboarding',
                items: [
                    { title: 'Week 1: Foundation' },
                    { title: 'Week 2: Configuration' },
                    { title: 'Week 3: Launch preparation' },
                    { title: 'Week 4: Go-live' },
                ]
            },
            {
                title: 'Organization Setup',
                items: [
                    { title: 'Multi-org architecture' },
                    { title: 'Custom roles & RBAC' },
                    { title: 'Hierarchical structure' },
                    { title: 'Cross-org management' },
                ]
            },
            {
                title: 'Security & Compliance',
                items: [
                    { title: 'SSO/SAML integration' },
                    { title: 'Audit logging' },
                    { title: 'SOC 2 compliance' },
                    { title: 'GDPR & CCPA' },
                    { title: 'Data encryption' },
                ]
            },
            {
                title: 'Identity Management',
                items: [
                    { title: 'Okta integration' },
                    { title: 'Azure AD setup' },
                    { title: 'SCIM provisioning' },
                    { title: 'JIT provisioning' },
                ]
            },
            {
                title: 'Custom AI Training',
                items: [
                    { title: 'Train on your data' },
                    { title: 'Brand voice models' },
                    { title: 'AI guardrails' },
                    { title: 'Priority processing' },
                ]
            },
            {
                title: 'Custom Integrations',
                items: [
                    { title: 'CRM integration (Salesforce, HubSpot)' },
                    { title: 'DAM integration' },
                    { title: 'Webhook configuration' },
                    { title: 'Custom SDK development' },
                ]
            },
            {
                title: 'White-Label',
                items: [
                    { title: 'Custom domain setup' },
                    { title: 'Brand customization' },
                    { title: 'Client portals' },
                    { title: 'Custom email templates' },
                ]
            },
            {
                title: 'Enterprise Analytics',
                items: [
                    { title: 'Executive dashboard' },
                    { title: 'Cross-org reporting' },
                    { title: 'Custom report builder' },
                    { title: 'BI integration' },
                ]
            },
            {
                title: 'Dedicated Support',
                items: [
                    { title: '24/7 support channels' },
                    { title: 'Quarterly business reviews' },
                    { title: '99.99% SLA guarantee' },
                    { title: 'Dedicated account manager' },
                ]
            },
            {
                title: 'Data & Privacy',
                items: [
                    { title: 'Data residency options' },
                    { title: 'Retention policies' },
                    { title: 'DPA coverage' },
                ]
            },
            {
                title: 'Enterprise API',
                items: [
                    { title: '10,000 req/min limit' },
                    { title: 'Bulk operations' },
                    { title: 'Advanced webhooks' },
                    { title: 'SDK downloads' },
                ]
            }
        ]
    }
};

const quickLinks = [
    { title: 'Video Tutorials', icon: ExternalLink, href: 'https://tutorials.digitalme.ng', desc: 'Step-by-step video guides' },
    { title: 'Knowledge Base', icon: BookOpen, href: 'https://help.digitalme.ng', desc: 'Searchable documentation' },
    { title: 'Community Forum', icon: Users, href: 'https://community.digitalme.ng', desc: 'Connect with other users' },
    { title: 'API Docs', icon: Settings, href: 'https://docs.digitalme.ng/api', desc: 'Developer documentation' },
];

export default function HelpPage() {
    const [selectedPlaybook, setSelectedPlaybook] = useState<keyof typeof playbooks>('starter');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const currentPlaybook = playbooks[selectedPlaybook];
    const Icon = currentPlaybook.icon;

    const filteredSections = currentPlaybook.sections.filter(section =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.items.some(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Help & Playbooks</h1>
                    <p className="text-slate-400">
                        Complete guides to master DigitalMEng at every level
                    </p>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {quickLinks.map((link) => (
                        <a
                            key={link.title}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-violet-500/50 transition-all group"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <link.icon className="w-5 h-5 text-violet-400" />
                                <span className="font-medium group-hover:text-violet-400 transition-colors">
                                    {link.title}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500">{link.desc}</p>
                        </a>
                    ))}
                </div>

                {/* Playbook Selector */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {Object.entries(playbooks).map(([key, book]) => {
                        const BookIcon = book.icon;
                        const isSelected = selectedPlaybook === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedPlaybook(key as keyof typeof playbooks)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${isSelected
                                    ? `bg-gradient-to-r ${book.color} border-transparent text-white shadow-lg`
                                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                                    }`}
                            >
                                <BookIcon className="w-4 h-4" />
                                <span className="font-medium">{book.title}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20' : 'bg-slate-700'
                                    }`}>
                                    {book.badge}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search playbook..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                    />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Playbook Header Card */}
                    <div className={`lg:col-span-1 bg-gradient-to-br ${currentPlaybook.color} rounded-2xl p-6 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                        <div className="relative">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                <Icon className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">{currentPlaybook.title}</h2>
                            <p className="text-white/80 mb-4">
                                {selectedPlaybook === 'free' && 'Your quick-start guide to DigitalMEng basics'}
                                {selectedPlaybook === 'starter' && 'Complete guide for Starter plan users'}
                                {selectedPlaybook === 'pro' && 'Advanced strategies for power users'}
                                {selectedPlaybook === 'enterprise' && 'Enterprise-scale operations guide'}
                            </p>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-white/80">
                                    <BarChart3 className="w-4 h-4" />
                                    <span className="text-sm">{currentPlaybook.sections.length} sections</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/80">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">
                                        {selectedPlaybook === 'free' && '15 min read'}
                                        {selectedPlaybook === 'starter' && '30 min read'}
                                        {selectedPlaybook === 'pro' && '45 min read'}
                                        {selectedPlaybook === 'enterprise' && '60 min read'}
                                    </span>
                                </div>
                            </div>

                            <a
                                href={`/${selectedPlaybook.toUpperCase()}-PLAYBOOK.md`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                            >
                                <BookOpen className="w-4 h-4" />
                                <span>View Full Playbook</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="lg:col-span-2 space-y-4">
                        {filteredSections.map((section, idx) => (
                            <div
                                key={section.title}
                                className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedSection(
                                        expandedSection === section.title ? null : section.title
                                    )}
                                    className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${currentPlaybook.color} flex items-center justify-center text-white font-bold text-sm`}>
                                            {idx + 1}
                                        </div>
                                        <span className="font-medium text-lg">{section.title}</span>
                                    </div>
                                    <ChevronRight
                                        className={`w-5 h-5 text-slate-400 transition-transform ${expandedSection === section.title ? 'rotate-90' : ''
                                            }`}
                                    />
                                </button>

                                {expandedSection === section.title && (
                                    <div className="px-4 pb-4 space-y-2">
                                        {section.items.map((item, itemIdx) => (
                                            <div
                                                key={item.title}
                                                className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg"
                                            >
                                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                                <span className="text-slate-300">{item.title}</span>
                                                {item.time && (
                                                    <span className="ml-auto text-xs text-slate-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {item.time}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {filteredSections.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No sections match your search</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Support Section */}
                <div className="mt-12 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl border border-violet-500/20 p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                <Headphones className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold mb-2">Need More Help?</h3>
                            <p className="text-slate-400">
                                Our support team is here to help you succeed. Reach out anytime!
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <a
                                href="mailto:support@digitalme.ng"
                                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
                            >
                                Email Support
                            </a>
                            <a
                                href="https://community.digitalme.ng"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-xl transition-colors"
                            >
                                Join Community
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
