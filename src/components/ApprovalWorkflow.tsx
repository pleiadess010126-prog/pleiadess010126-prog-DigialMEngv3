'use client';

import { useState } from 'react';
import {
    CheckCircle2, Clock, AlertCircle, MessageSquare,
    User, ChevronRight, MoreHorizontal, Send,
    ThumbsUp, ThumbsDown, Eye, FileEdit,
    ExternalLink, Sparkles, Filter, Search
} from 'lucide-react';
import type { ContentItem } from '@/types';

interface ApprovalItem extends Omit<ContentItem, 'createdAt'> {
    createdAt: string; // Keep as string for mock but satisfy Omit
    assignedTo: string;
    reviewer: string;
    commentsCount: number;
    priority: 'low' | 'medium' | 'high';
    deadline: string;
    platform: string;
}

const MOCK_APPROVALS: ApprovalItem[] = [
    {
        id: '1',
        title: '10 AI Productivity Hacks for 2025',
        type: 'blog',
        status: 'pending',
        createdAt: '2025-12-30T10:00:00Z',
        platform: 'wordpress',
        assignedTo: 'Alex Content',
        reviewer: 'Sarah Manager',
        commentsCount: 3,
        priority: 'high',
        deadline: '2026-01-02',
        content: '...',
        metadata: { keywords: [], topicPillar: '', seoScore: 0 }
    } as any,
    {
        id: '2',
        title: 'Future of SaaS: AI Agents',
        type: 'youtube-short',
        status: 'pending',
        createdAt: '2025-12-30T11:30:00Z',
        platform: 'youtube',
        assignedTo: 'James Video',
        reviewer: 'Sarah Manager',
        commentsCount: 0,
        priority: 'medium',
        deadline: '2026-01-05',
        content: '...',
        metadata: { keywords: [], topicPillar: '', seoScore: 0 }
    } as any,
    {
        id: '3',
        title: 'Organic Growth Strategies',
        type: 'instagram-reel',
        status: 'approved',
        createdAt: '2025-12-29T15:00:00Z',
        platform: 'instagram',
        assignedTo: 'Marta Social',
        reviewer: 'Sarah Manager',
        commentsCount: 2,
        priority: 'low',
        deadline: '2025-12-31',
        content: '...',
        metadata: { keywords: [], topicPillar: '', seoScore: 0 }
    } as any
];

export default function ApprovalWorkflow() {
    const [approvals, setApprovals] = useState<ApprovalItem[]>(MOCK_APPROVALS);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-rose-500';
            case 'medium': return 'text-amber-500';
            case 'low': return 'text-blue-500';
            default: return 'text-slate-500';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        Approval Pipeline
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium">
                        Manage content reviews and maintain brand quality across the team.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 cursor-pointer"
                    >
                        <option value="all">All Content</option>
                        <option value="pending">Needs Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Needs Changes</option>
                    </select>
                </div>
            </div>

            {/* Pipeline Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Awaiting Review', count: 12, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Approved Today', count: 8, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Needs Changes', count: 3, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
                    { label: 'Active Tasks', count: 24, icon: User, color: 'text-violet-500', bg: 'bg-violet-50' },
                ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="flex ms-items justify-between mb-2">
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-slate-800">{stat.count}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Pipeline List */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Content</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Assigned To</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Priority</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Deadline</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {approvals.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                                                <FileEdit className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{item.title}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                                                        {item.type}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                                                        {item.platform}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                                                {item.assignedTo.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="text-sm text-slate-600 font-medium">{item.assignedTo}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center gap-1.5 text-xs font-bold capitalize ${getPriorityStyles(item.priority)}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full fill-current`} />
                                            {item.priority}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            {item.deadline}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 rounded-lg hover:bg-slate-200 text-slate-400 transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-violet-100 text-violet-600 transition-colors relative">
                                                <MessageSquare className="w-4 h-4" />
                                                {item.commentsCount > 0 && (
                                                    <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 text-white text-[8px] flex items-center justify-center rounded-full border border-white">
                                                        {item.commentsCount}
                                                    </span>
                                                )}
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-emerald-100 text-emerald-600 transition-colors">
                                                <ThumbsUp className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-slate-900 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-5 h-5 text-violet-400" />
                        <h3 className="font-bold">AI Review Assistant</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        The AI agent has pre-screened all pending items. <span className="text-emerald-400">4 items</span> are highly compliant with your brand voice and ready for 1-click approval.
                    </p>
                    <button className="mt-6 w-full py-3 bg-violet-600 hover:bg-violet-500 transition-colors rounded-xl font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Approve AI-Verified Items
                    </button>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800 mb-2">Weekly Summary</h3>
                        <p className="text-sm text-slate-500">You've approved 42 pieces of content this week. Your team's average review time is 2.4 hours.</p>
                    </div>
                    <button className="mt-6 flex items-center gap-2 text-violet-600 font-bold hover:gap-3 transition-all">
                        View Detailed Reports <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
