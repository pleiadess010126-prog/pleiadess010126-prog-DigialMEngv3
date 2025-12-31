'use client';

import React, { useState } from 'react';
import {
    Users, UserPlus, Shield, Eye, Edit, Trash2, Mail, Check, X,
    Crown, ChevronDown, Clock, MoreVertical, Send, Copy
} from 'lucide-react';

// Role definitions
const ROLES = [
    {
        id: 'admin',
        label: 'Admin',
        description: 'Full access to all features and settings',
        icon: Crown,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
    },
    {
        id: 'manager',
        label: 'Manager',
        description: 'Manage team, approve content, view analytics',
        icon: Shield,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
    },
    {
        id: 'editor',
        label: 'Editor',
        description: 'Create and edit content, submit for approval',
        icon: Edit,
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
    },
    {
        id: 'viewer',
        label: 'Viewer',
        description: 'View content and analytics only',
        icon: Eye,
        color: 'text-slate-400',
        bgColor: 'bg-slate-500/20',
    },
];

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'editor' | 'viewer';
    status: 'active' | 'pending' | 'inactive';
    avatar?: string;
    joinedAt: Date;
    lastActive?: Date;
}

interface PendingInvite {
    id: string;
    email: string;
    role: 'admin' | 'manager' | 'editor' | 'viewer';
    invitedAt: Date;
    inviteLink: string;
}

// Mock data
const mockTeamMembers: TeamMember[] = [
    {
        id: '1',
        name: 'Priya Sharma',
        email: 'priya@company.com',
        role: 'admin',
        status: 'active',
        joinedAt: new Date('2024-01-15'),
        lastActive: new Date(),
    },
    {
        id: '2',
        name: 'Rahul Verma',
        email: 'rahul@company.com',
        role: 'manager',
        status: 'active',
        joinedAt: new Date('2024-03-22'),
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
        id: '3',
        name: 'Anita Patel',
        email: 'anita@company.com',
        role: 'editor',
        status: 'active',
        joinedAt: new Date('2024-06-10'),
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
];

const mockPendingInvites: PendingInvite[] = [
    {
        id: 'inv-1',
        email: 'newhire@company.com',
        role: 'editor',
        invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        inviteLink: 'https://app.digitalmeng.com/invite/abc123',
    },
];

export default function TeamMembers() {
    const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
    const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>(mockPendingInvites);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'manager' | 'editor' | 'viewer'>('editor');
    const [showRoleDropdown, setShowRoleDropdown] = useState<string | null>(null);
    const [copiedInvite, setCopiedInvite] = useState<string | null>(null);
    const [editingMember, setEditingMember] = useState<string | null>(null);

    const getCurrentUser = () => members.find(m => m.role === 'admin');

    const getRoleInfo = (roleId: string) => ROLES.find(r => r.id === roleId);

    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const handleInvite = () => {
        if (!inviteEmail.trim()) return;

        const newInvite: PendingInvite = {
            id: `inv-${Date.now()}`,
            email: inviteEmail.trim(),
            role: inviteRole,
            invitedAt: new Date(),
            inviteLink: `https://app.digitalmeng.com/invite/${Math.random().toString(36).slice(2)}`,
        };

        setPendingInvites(prev => [newInvite, ...prev]);
        setInviteEmail('');
        setShowInviteModal(false);
    };

    const handleRoleChange = (memberId: string, newRole: TeamMember['role']) => {
        setMembers(prev => prev.map(m =>
            m.id === memberId ? { ...m, role: newRole } : m
        ));
        setShowRoleDropdown(null);
    };

    const handleRemoveMember = (memberId: string) => {
        if (confirm('Are you sure you want to remove this team member?')) {
            setMembers(prev => prev.filter(m => m.id !== memberId));
        }
    };

    const handleCancelInvite = (inviteId: string) => {
        setPendingInvites(prev => prev.filter(i => i.id !== inviteId));
    };

    const handleResendInvite = (inviteId: string) => {
        // Simulate resend
        alert('Invitation resent successfully!');
    };

    const copyInviteLink = async (invite: PendingInvite) => {
        await navigator.clipboard.writeText(invite.inviteLink);
        setCopiedInvite(invite.id);
        setTimeout(() => setCopiedInvite(null), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Team Members</h2>
                        <p className="text-white/60 text-sm">Manage your team&apos;s access and roles</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-white font-medium flex items-center gap-2 transition-all"
                >
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                </button>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Total Members', value: members.length, color: 'text-blue-400' },
                    { label: 'Admins', value: members.filter(m => m.role === 'admin').length, color: 'text-yellow-400' },
                    { label: 'Editors', value: members.filter(m => m.role === 'editor').length, color: 'text-green-400' },
                    { label: 'Pending', value: pendingInvites.length, color: 'text-orange-400' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-white/60 text-sm">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Members List */}
            <div className="card">
                <div className="p-4 border-b border-white/10">
                    <h3 className="font-semibold text-white">Active Members</h3>
                </div>
                <div className="divide-y divide-white/10">
                    {members.map((member) => {
                        const roleInfo = getRoleInfo(member.role);
                        const isCurrentUser = member.role === 'admin';

                        return (
                            <div key={member.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                                        {member.name.charAt(0)}
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-white">{member.name}</p>
                                            {isCurrentUser && (
                                                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">You</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-white/50">{member.email}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-white/40 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {member.lastActive ? getTimeAgo(member.lastActive) : 'Never'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Role Badge */}
                                    <div className="relative">
                                        <button
                                            onClick={() => !isCurrentUser && setShowRoleDropdown(showRoleDropdown === member.id ? null : member.id)}
                                            disabled={isCurrentUser}
                                            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 ${roleInfo?.bgColor} ${roleInfo?.color} ${!isCurrentUser ? 'hover:brightness-110 cursor-pointer' : 'cursor-default'}`}
                                        >
                                            {roleInfo && <roleInfo.icon className="w-4 h-4" />}
                                            <span className="text-sm font-medium">{roleInfo?.label}</span>
                                            {!isCurrentUser && <ChevronDown className="w-3 h-3" />}
                                        </button>

                                        {showRoleDropdown === member.id && (
                                            <div className="absolute top-full mt-1 right-0 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-50 min-w-[200px]">
                                                {ROLES.filter(r => r.id !== 'admin').map(role => (
                                                    <button
                                                        key={role.id}
                                                        onClick={() => handleRoleChange(member.id, role.id as TeamMember['role'])}
                                                        className={`w-full px-4 py-3 text-left hover:bg-white/10 flex items-center gap-3 ${member.role === role.id ? 'bg-white/5' : ''}`}
                                                    >
                                                        <role.icon className={`w-4 h-4 ${role.color}`} />
                                                        <div>
                                                            <p className={`text-sm font-medium ${role.color}`}>{role.label}</p>
                                                            <p className="text-xs text-white/40">{role.description}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    {!isCurrentUser && (
                                        <button
                                            onClick={() => handleRemoveMember(member.id)}
                                            className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pending Invites */}
            {pendingInvites.length > 0 && (
                <div className="card">
                    <div className="p-4 border-b border-white/10 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-400" />
                        <h3 className="font-semibold text-white">Pending Invitations</h3>
                    </div>
                    <div className="divide-y divide-white/10">
                        {pendingInvites.map((invite) => {
                            const roleInfo = getRoleInfo(invite.role);

                            return (
                                <div key={invite.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-orange-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{invite.email}</p>
                                            <p className="text-sm text-white/50">
                                                Invited {getTimeAgo(invite.invitedAt)} as {roleInfo?.label}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => copyInviteLink(invite)}
                                            className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 text-sm flex items-center gap-2"
                                        >
                                            {copiedInvite === invite.id ? (
                                                <>
                                                    <Check className="w-4 h-4 text-green-400" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    Copy Link
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleResendInvite(invite.id)}
                                            className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 text-sm flex items-center gap-2"
                                        >
                                            <Send className="w-4 h-4" />
                                            Resend
                                        </button>
                                        <button
                                            onClick={() => handleCancelInvite(invite.id)}
                                            className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-purple-400" />
                                Invite Team Member
                            </h3>
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="colleague@company.com"
                                    className="input w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Role
                                </label>
                                <div className="space-y-2">
                                    {ROLES.filter(r => r.id !== 'admin').map(role => (
                                        <button
                                            key={role.id}
                                            onClick={() => setInviteRole(role.id as 'manager' | 'editor' | 'viewer')}
                                            className={`w-full p-3 rounded-lg border-2 text-left flex items-center gap-3 transition-all ${inviteRole === role.id
                                                    ? `border-purple-500 ${role.bgColor}`
                                                    : 'border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <role.icon className={`w-5 h-5 ${role.color}`} />
                                            <div>
                                                <p className={`font-medium ${role.color}`}>{role.label}</p>
                                                <p className="text-xs text-white/50">{role.description}</p>
                                            </div>
                                            {inviteRole === role.id && (
                                                <Check className="w-5 h-5 text-purple-400 ml-auto" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleInvite}
                                disabled={!inviteEmail.trim()}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 rounded-lg text-white font-medium flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Send Invitation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
