'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Sparkles,
    X,
    Send,
    Maximize2,
    Minimize2,
    MessageSquare,
    Zap,
    RefreshCw,
    ChevronUp,
    ChevronDown,
    Wand2,
    BarChart3,
    Calendar,
    TrendingUp,
    HelpCircle,
    Repeat2,
    Mic,
    MicOff,
    Volume2,
    Bot,
} from 'lucide-react';
import {
    processAgentCommand,
    QUICK_ACTIONS,
    getProactiveInsights,
    AgentMessage,
    AgentAction
} from '@/lib/ai/copilotAgent';

interface AICopilotProps {
    currentPage?: string;
    userPlan?: string;
    onAction?: (action: string, data?: any) => void;
}

export default function AICopilot({ currentPage = 'dashboard', userPlan = 'free', onAction }: AICopilotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<AgentMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(true);
    const [proactiveMessage, setProactiveMessage] = useState<string | null>(null);
    const [pulseEffect, setPulseEffect] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize with welcome message
    useEffect(() => {
        if (messages.length === 0) {
            const welcomeMessage: AgentMessage = {
                id: 'welcome',
                role: 'agent',
                content: "Hey! 👋 I'm Nandu, your AI assistant. I can help you generate content, analyze performance, schedule posts, and much more. Just ask me anything!",
                timestamp: new Date(),
            };
            setMessages([welcomeMessage]);
        }
    }, [messages.length]);

    // Proactive insights
    useEffect(() => {
        const insight = getProactiveInsights({
            currentPage,
            userPlan,
            usage: null,
            recentActions: []
        });
        if (insight && !isOpen) {
            setProactiveMessage(insight);
            setPulseEffect(true);
            setTimeout(() => setPulseEffect(false), 3000);
        }
    }, [currentPage, isOpen, userPlan]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: AgentMessage = {
            id: `user_${Date.now()}`,
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        setShowQuickActions(false);

        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

        const response = await processAgentCommand(input, {
            currentPage,
            userPlan,
            usage: null,
            recentActions: [],
        });

        setIsTyping(false);
        setMessages(prev => [...prev, response]);
    };

    const handleQuickAction = async (command: string) => {
        setInput(command);
        setTimeout(() => handleSend(), 100);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleActionClick = (action: AgentAction) => {
        if (onAction) {
            onAction(action.type, { actionId: action.id });
        }
        // Add feedback message
        const feedbackMessage: AgentMessage = {
            id: `feedback_${Date.now()}`,
            role: 'agent',
            content: `✅ Starting "${action.label}"... I'll help you complete this action!`,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, feedbackMessage]);
    };

    const clearChat = () => {
        setMessages([{
            id: 'welcome',
            role: 'agent',
            content: "Chat cleared! How can I help you next?",
            timestamp: new Date(),
        }]);
        setShowQuickActions(true);
    };

    // Floating button when closed
    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                {/* Proactive message bubble */}
                {proactiveMessage && (
                    <div className="absolute bottom-16 right-0 w-72 p-4 bg-white rounded-2xl shadow-2xl border border-slate-200 animate-slideIn">
                        <button
                            onClick={() => setProactiveMessage(null)}
                            className="absolute top-2 right-2 p-1 hover:bg-slate-100 rounded-full"
                        >
                            <X className="w-3 h-3 text-slate-400" />
                        </button>
                        <div className="flex gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-sm text-slate-700 pr-4">{proactiveMessage}</p>
                        </div>
                        <button
                            onClick={() => {
                                setIsOpen(true);
                                setProactiveMessage(null);
                            }}
                            className="mt-3 text-sm text-violet-600 font-medium hover:text-violet-700"
                        >
                            Chat with Nandu →
                        </button>
                    </div>
                )}

                {/* Main floating button with comet effect */}
                <button
                    onClick={() => setIsOpen(true)}
                    className={`group relative w-16 h-16 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-full shadow-2xl hover:shadow-violet-500/40 transition-all duration-300 hover:scale-110 ${pulseEffect ? 'animate-pulse' : ''
                        }`}
                >
                    {/* Comet trail effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 opacity-0 group-hover:opacity-30 blur-md transition-opacity animate-spin-slow" />

                    {/* Icon */}
                    <div className="relative flex items-center justify-center w-full h-full">
                        <Sparkles className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
                    </div>

                    {/* Notification dot */}
                    {proactiveMessage && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-bounce" />
                    )}
                </button>
            </div>
        );
    }

    return (
        <div
            className={`fixed z-50 transition-all duration-300 ${isExpanded
                ? 'inset-4 md:inset-8'
                : isMinimized
                    ? 'bottom-6 right-6 w-80'
                    : 'bottom-6 right-6 w-96 h-[600px]'
                }`}
        >
            <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-fuchsia-600/20 animate-gradient" />
                </div>

                {/* Header */}
                <div className="relative flex items-center justify-between p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">Agent Nandu</h3>
                            <p className="text-xs text-white/60">Your AI assistant</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={clearChat}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="Clear chat"
                        >
                            <RefreshCw className="w-4 h-4 text-white/60" />
                        </button>
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title={isMinimized ? 'Expand' : 'Minimize'}
                        >
                            {isMinimized ? (
                                <ChevronUp className="w-4 h-4 text-white/60" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-white/60" />
                            )}
                        </button>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title={isExpanded ? 'Collapse' : 'Expand'}
                        >
                            {isExpanded ? (
                                <Minimize2 className="w-4 h-4 text-white/60" />
                            ) : (
                                <Maximize2 className="w-4 h-4 text-white/60" />
                            )}
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="Close"
                        >
                            <X className="w-4 h-4 text-white/60" />
                        </button>
                    </div>
                </div>

                {/* Chat Messages */}
                {!isMinimized && (
                    <div className="relative flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                {message.role === 'agent' && (
                                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] ${message.role === 'user' ? '' : ''}`}>
                                    <div
                                        className={`px-4 py-3 rounded-2xl ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-br-md'
                                            : 'bg-white/10 text-white rounded-bl-md'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    </div>

                                    {/* Action buttons */}
                                    {message.actions && message.actions.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {message.actions.map((action) => (
                                                <button
                                                    key={action.id}
                                                    onClick={() => handleActionClick(action)}
                                                    className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white transition-colors"
                                                >
                                                    <span>{action.icon}</span>
                                                    <span>{action.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="px-4 py-3 bg-white/10 rounded-2xl rounded-bl-md">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                )}

                {/* Quick Actions */}
                {!isMinimized && showQuickActions && messages.length <= 1 && (
                    <div className="relative px-4 pb-2">
                        <p className="text-xs text-white/40 mb-2">Quick actions:</p>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_ACTIONS.map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => handleQuickAction(action.command)}
                                    className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white transition-all hover:scale-105"
                                >
                                    <span>{action.icon}</span>
                                    <span>{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                {!isMinimized && (
                    <div className="relative p-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask Nandu anything..."
                                    className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                                />
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="p-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Suggestions */}
                        <div className="flex items-center gap-2 mt-2 text-xs text-white/40">
                            <span>Try:</span>
                            <button
                                onClick={() => setInput('Generate a LinkedIn post about AI')}
                                className="hover:text-white/70 transition-colors"
                            >
                                "Generate a LinkedIn post"
                            </button>
                            <span>•</span>
                            <button
                                onClick={() => setInput('Show my analytics')}
                                className="hover:text-white/70 transition-colors"
                            >
                                "Show analytics"
                            </button>
                        </div>
                    </div>
                )}

                {/* Minimized state */}
                {isMinimized && (
                    <div className="p-3 flex items-center justify-between">
                        <span className="text-white/60 text-sm">Agent Nandu ready to help</span>
                        <button
                            onClick={() => setIsMinimized(false)}
                            className="px-3 py-1 bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg transition-colors"
                        >
                            Open
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
