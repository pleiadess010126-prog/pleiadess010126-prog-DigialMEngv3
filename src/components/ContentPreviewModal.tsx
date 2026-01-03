'use client';

import { useState, useEffect } from 'react';
import { X, Save, Sparkles, Edit3, Check, FileText, Tag, Hash, BarChart3 } from 'lucide-react';
import type { ContentItem } from '@/types';

interface ContentPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: ContentItem | null;
    onSave?: (updatedContent: ContentItem) => void;
    onApprove?: (content: ContentItem) => void;
}

export default function ContentPreviewModal({
    isOpen,
    onClose,
    content,
    onSave,
    onApprove,
}: ContentPreviewModalProps) {
    const [editedContent, setEditedContent] = useState<ContentItem | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (content) {
            setEditedContent({ ...content });
        }
    }, [content]);

    if (!isOpen || !editedContent) return null;

    const handleSave = () => {
        if (editedContent && onSave) {
            onSave(editedContent);
            setIsEditing(false);
        }
    };

    const handleApprove = () => {
        if (editedContent && onApprove) {
            onApprove({ ...editedContent, status: 'approved' });
            onClose();
        }
    };

    const statusStyles: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700 border-amber-200',
        approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        published: 'bg-blue-100 text-blue-700 border-blue-200',
        draft: 'bg-slate-100 text-slate-700 border-slate-200',
        rejected: 'bg-red-100 text-red-700 border-red-200',
    };

    const typeStyles: Record<string, { color: string; label: string }> = {
        blog: { color: 'bg-violet-500', label: 'Blog Post' },
        'youtube-short': { color: 'bg-red-500', label: 'YouTube Short' },
        'instagram-reel': { color: 'bg-pink-500', label: 'Instagram Reel' },
        'facebook-story': { color: 'bg-blue-600', label: 'Facebook Story' },
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-blue-50">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedContent.title}
                                    onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
                                    className="w-full text-xl font-bold text-slate-800 bg-white rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            ) : (
                                <h2 className="text-xl font-bold text-slate-800">{editedContent.title}</h2>
                            )}
                            <div className="flex items-center gap-3 mt-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[editedContent.status] || statusStyles.draft}`}>
                                    {editedContent.status}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${typeStyles[editedContent.type]?.color || 'bg-slate-500'}`}>
                                    {typeStyles[editedContent.type]?.label || editedContent.type}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-slate-600">SEO Score:</span>
                        <span className="text-sm font-bold text-emerald-600">{editedContent.metadata.seoScore}/100</span>
                    </div>
                    {editedContent.metadata.geoScore && (
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span className="text-sm text-slate-600">GEO Score:</span>
                            <span className="text-sm font-bold text-amber-500">{editedContent.metadata.geoScore}/100</span>
                        </div>
                    )}
                    {editedContent.metadata.wordCount && (
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-slate-600">Words:</span>
                            <span className="text-sm font-bold text-blue-600">{editedContent.metadata.wordCount}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-violet-600" />
                        <span className="text-sm text-slate-600">Topic:</span>
                        <span className="text-sm font-bold text-violet-600">{editedContent.metadata.topicPillar}</span>
                    </div>
                </div>

                {/* Enhanced GEO Analysis Panel */}
                {editedContent.metadata.geoBreakdown && (
                    <div className="px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                        {/* GEO Grade Badge */}
                        {editedContent.metadata.geoGrade && (
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${editedContent.metadata.geoGrade === 'A+' || editedContent.metadata.geoGrade === 'A'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : editedContent.metadata.geoGrade === 'B'
                                            ? 'bg-blue-100 text-blue-700'
                                            : editedContent.metadata.geoGrade === 'C'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-red-100 text-red-700'
                                    }`}>
                                    GEO Grade: {editedContent.metadata.geoGrade}
                                </span>
                                <span className="text-xs text-slate-500">Optimized for AI Search Engines</span>
                            </div>
                        )}

                        {/* 8-Metric Grid */}
                        <div className="grid grid-cols-4 gap-3 mb-3">
                            <div className="bg-white/60 rounded-lg p-2 text-center">
                                <div className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Directness</div>
                                <div className="text-lg font-bold text-slate-900">{editedContent.metadata.geoBreakdown.directness}%</div>
                            </div>
                            <div className="bg-white/60 rounded-lg p-2 text-center">
                                <div className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Authority</div>
                                <div className="text-lg font-bold text-slate-900">{editedContent.metadata.geoBreakdown.authority}%</div>
                            </div>
                            <div className="bg-white/60 rounded-lg p-2 text-center">
                                <div className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Structure</div>
                                <div className="text-lg font-bold text-slate-900">{editedContent.metadata.geoBreakdown.structure}%</div>
                            </div>
                            <div className="bg-white/60 rounded-lg p-2 text-center">
                                <div className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Conversational</div>
                                <div className="text-lg font-bold text-slate-900">{editedContent.metadata.geoBreakdown.conversational}%</div>
                            </div>
                            <div className="bg-white/60 rounded-lg p-2 text-center">
                                <div className="text-[10px] uppercase font-bold text-orange-700 tracking-wider">Freshness</div>
                                <div className="text-lg font-bold text-slate-900">{editedContent.metadata.geoBreakdown.freshness}%</div>
                            </div>
                            <div className="bg-white/60 rounded-lg p-2 text-center">
                                <div className="text-[10px] uppercase font-bold text-orange-700 tracking-wider">Snippet Opt</div>
                                <div className="text-lg font-bold text-slate-900">{editedContent.metadata.geoBreakdown.snippetOptimization}%</div>
                            </div>
                            <div className="bg-white/60 rounded-lg p-2 text-center">
                                <div className="text-[10px] uppercase font-bold text-orange-700 tracking-wider">Semantic</div>
                                <div className="text-lg font-bold text-slate-900">{editedContent.metadata.geoBreakdown.semanticRichness}%</div>
                            </div>
                            <div className="bg-white/60 rounded-lg p-2 text-center">
                                <div className="text-[10px] uppercase font-bold text-orange-700 tracking-wider">Readability</div>
                                <div className="text-lg font-bold text-slate-900">{editedContent.metadata.geoBreakdown.readability}%</div>
                            </div>
                        </div>

                        {/* Strengths */}
                        {editedContent.metadata.geoStrengths && editedContent.metadata.geoStrengths.length > 0 && (
                            <div className="mb-2">
                                <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider mb-1">Strengths</div>
                                <div className="flex flex-wrap gap-1">
                                    {editedContent.metadata.geoStrengths.slice(0, 4).map((strength: string, idx: number) => (
                                        <span key={idx} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px]">
                                            {strength.replace('✓ ', '')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recommendations */}
                        {editedContent.metadata.geoRecommendations && editedContent.metadata.geoRecommendations.length > 0 && (
                            <div>
                                <div className="text-[10px] uppercase font-bold text-amber-700 tracking-wider mb-1">Recommendations</div>
                                <div className="flex flex-wrap gap-1">
                                    {editedContent.metadata.geoRecommendations.slice(0, 3).map((rec: string, idx: number) => (
                                        <span key={idx} className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px]">
                                            {rec.replace('→ ', '')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Content</h3>
                        {isEditing ? (
                            <textarea
                                value={editedContent.content}
                                onChange={(e) => setEditedContent({ ...editedContent, content: e.target.value })}
                                className="w-full min-h-[300px] p-4 text-slate-700 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                            />
                        ) : (
                            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {editedContent.content}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Keywords */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {editedContent.metadata.keywords.map((keyword, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg text-sm font-medium">
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Target Keyword */}
                    {editedContent.metadata.targetKeyword && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                                Target Keyword
                            </h3>
                            <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold inline-block">
                                {editedContent.metadata.targetKeyword}
                            </span>
                        </div>
                    )}

                    {/* Hashtags (if social media content) */}
                    {editedContent.metadata.hashtags && editedContent.metadata.hashtags.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <Hash className="w-4 h-4" />
                                Hashtags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {editedContent.metadata.hashtags.map((tag, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Performance (if published) */}
                    {editedContent.performance && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                                Performance
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-emerald-50 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-emerald-600">{editedContent.performance.views.toLocaleString()}</div>
                                    <div className="text-sm text-slate-500">Views</div>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-blue-600">{editedContent.performance.engagement}%</div>
                                    <div className="text-sm text-slate-500">Engagement</div>
                                </div>
                                <div className="p-4 bg-violet-50 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-violet-600">{editedContent.performance.dwellTime}s</div>
                                    <div className="text-sm text-slate-500">Dwell Time</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-medium hover:bg-slate-300 flex items-center gap-2"
                            >
                                <Edit3 className="w-4 h-4" />
                                Edit
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-medium hover:bg-slate-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {editedContent.status === 'pending' && (
                            <button
                                onClick={handleApprove}
                                className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold hover:from-emerald-600 hover:to-green-600 flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                            >
                                <Check className="w-4 h-4" />
                                Approve & Publish
                            </button>
                        )}
                        {editedContent.status === 'approved' && (
                            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:from-violet-600 hover:to-fuchsia-600 flex items-center gap-2 shadow-lg shadow-violet-500/25">
                                <Sparkles className="w-4 h-4" />
                                Publish Now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
