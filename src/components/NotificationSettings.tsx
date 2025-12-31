'use client';

import React, { useState } from 'react';
import {
    Bell, Mail, Smartphone, MessageSquare, Save, Check, X,
    Clock, AlertTriangle, FileText, Users, TrendingUp, Zap,
    Volume2, VolumeX, Settings
} from 'lucide-react';

interface NotificationSetting {
    id: string;
    category: string;
    title: string;
    description: string;
    email: boolean;
    push: boolean;
    slack: boolean;
    icon: React.ElementType;
}

const defaultSettings: NotificationSetting[] = [
    {
        id: 'content-approved',
        category: 'Content',
        title: 'Content Approved',
        description: 'When your content is approved by a manager',
        email: true,
        push: true,
        slack: true,
        icon: Check,
    },
    {
        id: 'content-rejected',
        category: 'Content',
        title: 'Content Needs Revision',
        description: 'When content is sent back for changes',
        email: true,
        push: true,
        slack: true,
        icon: AlertTriangle,
    },
    {
        id: 'content-pending',
        category: 'Content',
        title: 'Content Pending Review',
        description: 'When new content needs your approval',
        email: true,
        push: true,
        slack: false,
        icon: FileText,
    },
    {
        id: 'content-published',
        category: 'Publishing',
        title: 'Content Published',
        description: 'When content goes live on platforms',
        email: false,
        push: true,
        slack: true,
        icon: Zap,
    },
    {
        id: 'publish-failed',
        category: 'Publishing',
        title: 'Publishing Failed',
        description: 'When content fails to publish',
        email: true,
        push: true,
        slack: true,
        icon: X,
    },
    {
        id: 'scheduled-reminder',
        category: 'Publishing',
        title: 'Scheduled Content Reminder',
        description: '1 hour before scheduled publish time',
        email: false,
        push: true,
        slack: false,
        icon: Clock,
    },
    {
        id: 'team-invite',
        category: 'Team',
        title: 'Team Invitations',
        description: 'When someone accepts your invite',
        email: true,
        push: false,
        slack: false,
        icon: Users,
    },
    {
        id: 'analytics-report',
        category: 'Analytics',
        title: 'Weekly Analytics Report',
        description: 'Performance summary every Monday',
        email: true,
        push: false,
        slack: true,
        icon: TrendingUp,
    },
    {
        id: 'usage-warning',
        category: 'Billing',
        title: 'Usage Limit Warning',
        description: 'When you&apos;re approaching plan limits',
        email: true,
        push: true,
        slack: false,
        icon: AlertTriangle,
    },
];

interface SlackIntegration {
    connected: boolean;
    workspace?: string;
    channel?: string;
}

export default function NotificationSettings() {
    const [settings, setSettings] = useState<NotificationSetting[]>(defaultSettings);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [slackIntegration, setSlackIntegration] = useState<SlackIntegration>({
        connected: false,
    });
    const [emailDigest, setEmailDigest] = useState<'instant' | 'daily' | 'weekly'>('instant');
    const [quietHours, setQuietHours] = useState({
        enabled: false,
        start: '22:00',
        end: '08:00',
    });
    const [globalMute, setGlobalMute] = useState(false);

    const toggleSetting = (id: string, channel: 'email' | 'push' | 'slack') => {
        setSettings(prev => prev.map(s =>
            s.id === id ? { ...s, [channel]: !s[channel] } : s
        ));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const connectSlack = () => {
        // In production, this would open OAuth flow
        window.open('https://slack.com/oauth/v2/authorize?client_id=YOUR_CLIENT_ID&scope=chat:write,channels:read', '_blank');
        // Simulate successful connection after a delay
        setTimeout(() => {
            setSlackIntegration({
                connected: true,
                workspace: 'Your Workspace',
                channel: '#marketing',
            });
        }, 2000);
    };

    const disconnectSlack = () => {
        if (confirm('Disconnect Slack integration?')) {
            setSlackIntegration({ connected: false });
            // Turn off all Slack notifications
            setSettings(prev => prev.map(s => ({ ...s, slack: false })));
        }
    };

    const categories = [...new Set(settings.map(s => s.category))];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                        <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Notification Settings</h2>
                        <p className="text-white/60 text-sm">Manage how you receive alerts and updates</p>
                    </div>
                </div>
                <button
                    onClick={() => setGlobalMute(!globalMute)}
                    className={`p-3 rounded-xl transition-colors ${globalMute
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-white/10 text-white/60 hover:text-white'
                        }`}
                    title={globalMute ? 'Unmute All' : 'Mute All'}
                >
                    {globalMute ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
            </div>

            {globalMute && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                    <VolumeX className="w-5 h-5 text-red-400" />
                    <div>
                        <p className="font-medium text-red-300">All Notifications Muted</p>
                        <p className="text-sm text-white/50">You won&apos;t receive any notifications until you unmute.</p>
                    </div>
                </div>
            )}

            {/* Quick Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Email Digest */}
                <div className="card p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <Mail className="w-5 h-5 text-blue-400" />
                        <h3 className="font-medium text-white">Email Frequency</h3>
                    </div>
                    <div className="space-y-2">
                        {(['instant', 'daily', 'weekly'] as const).map((freq) => (
                            <button
                                key={freq}
                                onClick={() => setEmailDigest(freq)}
                                className={`w-full px-4 py-2 rounded-lg text-left text-sm transition-colors ${emailDigest === freq
                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                                    }`}
                            >
                                {freq.charAt(0).toUpperCase() + freq.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quiet Hours */}
                <div className="card p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-purple-400" />
                            <h3 className="font-medium text-white">Quiet Hours</h3>
                        </div>
                        <button
                            onClick={() => setQuietHours(prev => ({ ...prev, enabled: !prev.enabled }))}
                            className={`relative w-12 h-6 rounded-full transition-colors ${quietHours.enabled ? 'bg-purple-500' : 'bg-white/20'
                                }`}
                        >
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${quietHours.enabled ? 'translate-x-6' : 'translate-x-0'
                                }`} />
                        </button>
                    </div>
                    {quietHours.enabled && (
                        <div className="flex items-center gap-2 text-sm">
                            <input
                                type="time"
                                value={quietHours.start}
                                onChange={(e) => setQuietHours(prev => ({ ...prev, start: e.target.value }))}
                                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
                            />
                            <span className="text-white/50">to</span>
                            <input
                                type="time"
                                value={quietHours.end}
                                onChange={(e) => setQuietHours(prev => ({ ...prev, end: e.target.value }))}
                                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
                            />
                        </div>
                    )}
                </div>

                {/* Slack Integration */}
                <div className="card p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <MessageSquare className="w-5 h-5 text-green-400" />
                        <h3 className="font-medium text-white">Slack</h3>
                    </div>
                    {slackIntegration.connected ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-green-400">
                                <Check className="w-4 h-4" />
                                Connected to {slackIntegration.workspace}
                            </div>
                            <p className="text-xs text-white/50">Channel: {slackIntegration.channel}</p>
                            <button
                                onClick={disconnectSlack}
                                className="text-xs text-red-400 hover:text-red-300"
                            >
                                Disconnect
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={connectSlack}
                            className="w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 text-sm flex items-center justify-center gap-2"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Connect Slack
                        </button>
                    )}
                </div>
            </div>

            {/* Notification Types */}
            {categories.map((category) => (
                <div key={category} className="card">
                    <div className="p-4 border-b border-white/10">
                        <h3 className="font-semibold text-white">{category}</h3>
                    </div>

                    {/* Channel Headers */}
                    <div className="px-4 py-2 bg-white/5 grid grid-cols-[1fr,auto] items-center">
                        <span className="text-xs text-white/40 uppercase">Notification Type</span>
                        <div className="flex gap-8">
                            <span className="text-xs text-white/40 uppercase w-12 text-center">Email</span>
                            <span className="text-xs text-white/40 uppercase w-12 text-center">Push</span>
                            <span className="text-xs text-white/40 uppercase w-12 text-center">Slack</span>
                        </div>
                    </div>

                    <div className="divide-y divide-white/10">
                        {settings
                            .filter(s => s.category === category)
                            .map((setting) => (
                                <div key={setting.id} className="p-4 grid grid-cols-[1fr,auto] items-center hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/10 rounded-lg">
                                            <setting.icon className="w-4 h-4 text-white/70" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{setting.title}</p>
                                            <p className="text-sm text-white/50">{setting.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-8">
                                        {/* Email Toggle */}
                                        <button
                                            onClick={() => toggleSetting(setting.id, 'email')}
                                            disabled={globalMute}
                                            className={`w-12 h-8 rounded-lg flex items-center justify-center transition-colors ${setting.email && !globalMute
                                                    ? 'bg-blue-500/20 text-blue-400'
                                                    : 'bg-white/10 text-white/30'
                                                } ${globalMute ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'}`}
                                        >
                                            <Mail className="w-4 h-4" />
                                        </button>

                                        {/* Push Toggle */}
                                        <button
                                            onClick={() => toggleSetting(setting.id, 'push')}
                                            disabled={globalMute}
                                            className={`w-12 h-8 rounded-lg flex items-center justify-center transition-colors ${setting.push && !globalMute
                                                    ? 'bg-purple-500/20 text-purple-400'
                                                    : 'bg-white/10 text-white/30'
                                                } ${globalMute ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'}`}
                                        >
                                            <Smartphone className="w-4 h-4" />
                                        </button>

                                        {/* Slack Toggle */}
                                        <button
                                            onClick={() => toggleSetting(setting.id, 'slack')}
                                            disabled={globalMute || !slackIntegration.connected}
                                            className={`w-12 h-8 rounded-lg flex items-center justify-center transition-colors ${setting.slack && slackIntegration.connected && !globalMute
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-white/10 text-white/30'
                                                } ${(globalMute || !slackIntegration.connected) ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'}`}
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ))}

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${saved
                            ? 'bg-green-500 text-white'
                            : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                        }`}
                >
                    {saving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                            Save Preferences
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
