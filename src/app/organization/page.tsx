'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useOrganization } from '@/lib/db/OrganizationContext';
import Link from 'next/link';
import {
    Sparkles, Building2, Users, Settings, Shield, Mail,
    Globe, Clock, Bell, Check, X, Plus, Trash2, Crown,
    ArrowLeft, Save, AlertCircle
} from 'lucide-react';

export default function OrganizationSettingsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { organization, members, updateOrganization, updateSettings, inviteMember, removeMember, isLoading } = useOrganization();

    const [activeTab, setActiveTab] = useState<'general' | 'team' | 'billing'>('general');
    const [saving, setSaving] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: organization?.name || '',
        brandName: organization?.settings?.brandName || '',
        websiteUrl: organization?.settings?.websiteUrl || '',
        timezone: organization?.settings?.timezone || '',
        emailNotifications: organization?.settings?.emailNotifications ?? true,
        weeklyReports: organization?.settings?.weeklyReports ?? true,
    });

    const handleSave = async () => {
        if (!organization) return;

        setSaving(true);
        setMessage(null);

        try {
            await updateOrganization({ name: formData.name });
            await updateSettings({
                brandName: formData.brandName,
                websiteUrl: formData.websiteUrl,
                timezone: formData.timezone,
                emailNotifications: formData.emailNotifications,
                weeklyReports: formData.weeklyReports,
            });
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    const handleInvite = async () => {
        if (!inviteEmail) return;

        try {
            await inviteMember(inviteEmail, inviteRole);
            setMessage({ type: 'success', text: `Invitation sent to ${inviteEmail}` });
            setInviteEmail('');
            setShowInviteForm(false);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to send invitation' });
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!confirm('Are you sure you want to remove this member?')) return;

        try {
            await removeMember(userId);
            setMessage({ type: 'success', text: 'Member removed successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to remove member' });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            </div>
        );
    }

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'billing', label: 'Billing', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800">Organization Settings</h1>
                                <p className="text-sm text-slate-500">{organization?.name}</p>
                            </div>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${organization?.plan === 'pro' ? 'bg-violet-100 text-violet-700' :
                            organization?.plan === 'enterprise' ? 'bg-orange-100 text-orange-700' :
                                organization?.plan === 'starter' ? 'bg-blue-100 text-blue-700' :
                                    'bg-slate-100 text-slate-700'
                        }`}>
                        {organization?.plan || 'free'} plan
                    </span>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-8 py-8">
                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex border-b border-slate-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === tab.id
                                        ? 'text-violet-600 border-b-2 border-violet-600 bg-violet-50/50'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {/* General Settings */}
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Organization Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Brand Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.brandName}
                                        onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Website URL
                                    </label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="url"
                                            value={formData.websiteUrl}
                                            onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Timezone
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <select
                                            value={formData.timezone}
                                            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        >
                                            <option value="America/New_York">Eastern Time (ET)</option>
                                            <option value="America/Chicago">Central Time (CT)</option>
                                            <option value="America/Denver">Mountain Time (MT)</option>
                                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                            <option value="Europe/London">London (GMT)</option>
                                            <option value="Europe/Paris">Paris (CET)</option>
                                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                                            <option value="Asia/Kolkata">India (IST)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Notification Settings */}
                                <div className="pt-6 border-t border-slate-200">
                                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                        <Bell className="w-4 h-4" />
                                        Notifications
                                    </h3>
                                    <div className="space-y-4">
                                        <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer">
                                            <div>
                                                <p className="font-medium text-slate-800">Email Notifications</p>
                                                <p className="text-sm text-slate-500">Receive updates about your campaigns</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={formData.emailNotifications}
                                                onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                                                className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                                            />
                                        </label>
                                        <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer">
                                            <div>
                                                <p className="font-medium text-slate-800">Weekly Reports</p>
                                                <p className="text-sm text-slate-500">Receive weekly performance summaries</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={formData.weeklyReports}
                                                onChange={(e) => setFormData({ ...formData, weeklyReports: e.target.checked })}
                                                className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Save className="w-5 h-5" />
                                        )}
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Team Settings */}
                        {activeTab === 'team' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">Team Members</h3>
                                        <p className="text-sm text-slate-500">Manage who has access to your organization</p>
                                    </div>
                                    <button
                                        onClick={() => setShowInviteForm(true)}
                                        className="px-4 py-2 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Invite Member
                                    </button>
                                </div>

                                {/* Invite Form */}
                                {showInviteForm && (
                                    <div className="p-4 bg-violet-50 rounded-xl border border-violet-200">
                                        <h4 className="font-medium text-slate-800 mb-4">Invite New Member</h4>
                                        <div className="flex gap-3">
                                            <div className="flex-1 relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="email"
                                                    value={inviteEmail}
                                                    onChange={(e) => setInviteEmail(e.target.value)}
                                                    placeholder="email@example.com"
                                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                                />
                                            </div>
                                            <select
                                                value={inviteRole}
                                                onChange={(e) => setInviteRole(e.target.value as typeof inviteRole)}
                                                className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                            >
                                                <option value="viewer">Viewer</option>
                                                <option value="editor">Editor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <button
                                                onClick={handleInvite}
                                                className="px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500"
                                            >
                                                Send Invite
                                            </button>
                                            <button
                                                onClick={() => setShowInviteForm(false)}
                                                className="px-4 py-3 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Members List */}
                                <div className="space-y-3">
                                    {/* Current User (Owner) */}
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center">
                                                <span className="text-white font-semibold">{user?.name?.[0] || 'U'}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">{user?.name} <span className="text-slate-400">(you)</span></p>
                                                <p className="text-sm text-slate-500">{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold flex items-center gap-1">
                                                <Crown className="w-4 h-4" />
                                                Owner
                                            </span>
                                        </div>
                                    </div>

                                    {/* Demo members */}
                                    {[
                                        { name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
                                        { name: 'Bob Johnson', email: 'bob@example.com', role: 'editor' },
                                    ].map((member, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                                                    <span className="text-slate-600 font-semibold">{member.name[0]}</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">{member.name}</p>
                                                    <p className="text-sm text-slate-500">{member.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${member.role === 'admin' ? 'bg-violet-100 text-violet-700' :
                                                        member.role === 'editor' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {member.role}
                                                </span>
                                                <button className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Billing Settings */}
                        {activeTab === 'billing' && (
                            <div className="space-y-6">
                                <div className="p-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white/80 text-sm">Current Plan</p>
                                            <h3 className="text-2xl font-bold capitalize">{organization?.plan || 'Free'}</h3>
                                        </div>
                                        <Link
                                            href="/pricing"
                                            className="px-4 py-2 bg-white text-violet-700 rounded-xl font-semibold hover:bg-violet-50"
                                        >
                                            Upgrade Plan
                                        </Link>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-sm text-slate-500">Billing Period</p>
                                        <p className="text-lg font-semibold text-slate-800">Monthly</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-sm text-slate-500">Next Invoice</p>
                                        <p className="text-lg font-semibold text-slate-800">Jan 30, 2025</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-slate-800 mb-4">Payment Method</h4>
                                    <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-slate-200 rounded-lg">
                                                <Shield className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">•••• •••• •••• 4242</p>
                                                <p className="text-sm text-slate-500">Expires 12/25</p>
                                            </div>
                                        </div>
                                        <button className="text-violet-600 font-medium hover:text-violet-700">
                                            Update
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-slate-800 mb-4">Recent Invoices</h4>
                                    <div className="space-y-2">
                                        {[
                                            { date: 'Dec 30, 2024', amount: '$149.00', status: 'Paid' },
                                            { date: 'Nov 30, 2024', amount: '$149.00', status: 'Paid' },
                                            { date: 'Oct 30, 2024', amount: '$49.00', status: 'Paid' },
                                        ].map((invoice, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                                                <div>
                                                    <p className="font-medium text-slate-800">{invoice.date}</p>
                                                    <p className="text-sm text-slate-500">{invoice.amount}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                                                        {invoice.status}
                                                    </span>
                                                    <button className="text-violet-600 text-sm font-medium hover:text-violet-700">
                                                        Download
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
