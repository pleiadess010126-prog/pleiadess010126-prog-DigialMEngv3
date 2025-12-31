'use client';

import { useState } from 'react';
import {
    Scissors, Copy, Check, Sparkles,
    Facebook, Instagram, Twitter, Youtube,
    ArrowRight, ArrowDown, ChevronRight,
    FileText, Zap, Bot, RefreshCcw, Save
} from 'lucide-react';

interface SplinterOutput {
    id: string;
    platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
    content: string;
    type: string;
}

export default function ContentSplintering() {
    const [sourceContent, setSourceContent] = useState('');
    const [splintering, setSplintering] = useState(false);
    const [outputs, setOutputs] = useState<SplinterOutput[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleSplinter = () => {
        if (!sourceContent) return;
        setSplintering(true);
        // Simulate AI splintering logic
        setTimeout(() => {
            const mockOutputs: SplinterOutput[] = [
                {
                    id: '1',
                    platform: 'twitter',
                    type: 'Thread Opener',
                    content: "🚀 AI is changing the marketing game. But most people are still doing manual work. Here's how we're automating content at DigitalMEng... 🧵"
                },
                {
                    id: '2',
                    platform: 'instagram',
                    type: 'Bento Box Caption',
                    content: "The future of marketing is autonomous. 🤖 We just launched our smart scheduler that finds YOUR best posting times automatically. Link in bio! 🔗"
                },
                {
                    id: '3',
                    platform: 'linkedin',
                    type: 'Professional Summary',
                    content: "Excited to share our latest research on content velocity. We found that steady, AI-guided publishing increases organic reach by 10x compared to sporadic manual posts. #SaaS #Growth"
                }
            ];
            setOutputs(mockOutputs);
            setSplintering(false);
        }, 2000);
    };

    const copyToClipboard = (id: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Scissors className="w-6 h-6 text-orange-600" />
                        Content Splintering Wizard
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium">
                        Turn one long-form blog post into dozens of high-performing social snippets.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Area */}
                <div className="space-y-4">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Source Content
                            </h3>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paste your blog or article below</span>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <textarea
                                value={sourceContent}
                                onChange={(e) => setSourceContent(e.target.value)}
                                placeholder="Paste your long-form content here..."
                                className="w-full h-[400px] p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium resize-none"
                            />
                            <button
                                onClick={handleSplinter}
                                disabled={splintering || !sourceContent}
                                className="mt-6 w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl font-bold shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {splintering ? (
                                    <>
                                        <RefreshCcw className="w-5 h-5 animate-spin" />
                                        AI Splintering...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5" />
                                        Splinter This Content
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Output Area */}
                <div className="space-y-4">
                    {outputs.length > 0 ? (
                        <div className="space-y-4">
                            {outputs.map((output) => (
                                <div key={output.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
                                    <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {output.platform === 'twitter' && <Twitter className="w-4 h-4 text-blue-400" />}
                                            {output.platform === 'instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                                            {output.platform === 'linkedin' && <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center text-[8px] font-bold text-white">in</div>}
                                            <span className="text-xs font-bold text-slate-700">{output.type}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => copyToClipboard(output.id, output.content)}
                                                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-orange-600 transition-all"
                                            >
                                                {copiedId === output.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                            <button className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 transition-all">
                                                <Save className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                            {output.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div className="p-6 rounded-3xl bg-indigo-900 text-white relative overflow-hidden">
                                <Sparkles className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-white/10" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold mb-1">Scale This Further</p>
                                        <p className="text-xs text-indigo-300">Convert these snippets into 10 video scripts with AI.</p>
                                    </div>
                                    <button className="px-5 py-2 bg-white text-indigo-900 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors">
                                        Draft Scripts
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-8">
                            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                                <Bot className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to splinter?</h3>
                            <p className="text-slate-500 max-w-sm">Paste your content on the left and our AI will extract the most viral hooks and summaries for all social platforms.</p>
                            <div className="mt-8 flex gap-2">
                                <div className="p-2 rounded-lg bg-white border border-slate-200"><Twitter className="w-5 h-5 text-slate-300" /></div>
                                <div className="p-2 rounded-lg bg-white border border-slate-200"><Instagram className="w-5 h-5 text-slate-300" /></div>
                                <div className="p-2 rounded-lg bg-white border border-slate-200"><Facebook className="w-5 h-5 text-slate-300" /></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
