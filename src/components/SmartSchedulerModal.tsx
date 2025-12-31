'use client';

import React, { useState } from 'react';
import {
    Clock, Calendar, Zap, TrendingUp, Settings,
    ChevronLeft, ChevronRight, Check, X, Sparkles
} from 'lucide-react';

interface SchedulerModalProps {
    isOpen: boolean;
    onClose: () => void;
    content?: {
        id: string;
        title: string;
        platform: string;
    };
    onSchedule?: (date: Date) => void;
}

interface TimeSlot {
    hour: number;
    score: number;
    reason: string;
}

interface DaySchedule {
    date: Date;
    slots: TimeSlot[];
    optimalHour?: number;
}

const PLATFORMS = [
    { id: 'instagram', name: 'Instagram', icon: '📸', bestDays: [1, 2, 3], bestHours: [11, 14, 19] },
    { id: 'youtube', name: 'YouTube', icon: '🎬', bestDays: [4, 5, 6], bestHours: [12, 15, 21] },
    { id: 'twitter', name: 'Twitter/X', icon: '𝕏', bestDays: [1, 2, 3], bestHours: [8, 12, 17] },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', bestDays: [1, 2, 3], bestHours: [7, 10, 12] },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', bestDays: [1, 2, 4], bestHours: [7, 12, 19] },
    { id: 'facebook', name: 'Facebook', icon: '📘', bestDays: [1, 2, 3, 4], bestHours: [9, 13, 16] },
];

const generateTimeSlots = (date: Date, platformId: string): TimeSlot[] => {
    const platform = PLATFORMS.find(p => p.id === platformId) || PLATFORMS[0];
    const dayOfWeek = date.getDay();
    const isOptimalDay = platform.bestDays.includes(dayOfWeek);

    return Array.from({ length: 24 }, (_, hour) => {
        const isOptimalHour = platform.bestHours.includes(hour);
        let score = 40 + Math.random() * 20;
        let reason = 'Average engagement expected';

        if (isOptimalDay && isOptimalHour) {
            score = 85 + Math.random() * 15;
            reason = 'Peak engagement time for your audience!';
        } else if (isOptimalDay) {
            score = 60 + Math.random() * 20;
            reason = 'Good day, but consider optimal hours';
        } else if (isOptimalHour) {
            score = 55 + Math.random() * 20;
            reason = 'Good time, but consider optimal days';
        }

        return { hour, score, reason };
    });
};

export default function SmartSchedulerModal({ isOpen, onClose, content, onSchedule }: SchedulerModalProps) {
    const [selectedPlatform, setSelectedPlatform] = useState(content?.platform || 'instagram');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedHour, setSelectedHour] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'calendar' | 'smart'>('smart');
    const [calendarMonth, setCalendarMonth] = useState(new Date());

    const timeSlots = generateTimeSlots(selectedDate, selectedPlatform);
    const platform = PLATFORMS.find(p => p.id === selectedPlatform) || PLATFORMS[0];
    const optimalSlots = timeSlots.filter(s => s.score >= 80).sort((a, b) => b.score - a.score);

    const formatHour = (hour: number) => {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h = hour % 12 || 12;
        return `${h}:00 ${ampm}`;
    };

    const getDayName = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-gray-500';
    };

    const handleSchedule = () => {
        if (selectedHour === null) return;
        const scheduledDate = new Date(selectedDate);
        scheduledDate.setHours(selectedHour, 0, 0, 0);
        onSchedule?.(scheduledDate);
        onClose();
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
        const days: (Date | null)[] = [];

        // Add empty slots for days before the first
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Smart Scheduler</h2>
                            <p className="text-white/60 text-sm">AI-optimized posting times for maximum engagement</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-white/60" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Platform & Date Selection */}
                        <div className="space-y-6">
                            {/* Platform Selection */}
                            <div>
                                <label className="text-white font-medium mb-3 block">Platform</label>
                                <div className="space-y-2">
                                    {PLATFORMS.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => setSelectedPlatform(p.id)}
                                            className={`w-full p-3 rounded-lg border transition-all flex items-center gap-3 ${selectedPlatform === p.id
                                                    ? 'bg-purple-500/20 border-purple-500'
                                                    : 'bg-white/5 border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <span className="text-xl">{p.icon}</span>
                                            <span className="text-white">{p.name}</span>
                                            {selectedPlatform === p.id && <Check className="w-4 h-4 text-purple-400 ml-auto" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* View Toggle */}
                            <div className="flex bg-white/5 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('smart')}
                                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${viewMode === 'smart' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'
                                        }`}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Smart
                                </button>
                                <button
                                    onClick={() => setViewMode('calendar')}
                                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${viewMode === 'calendar' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'
                                        }`}
                                >
                                    <Calendar className="w-4 h-4" />
                                    Calendar
                                </button>
                            </div>
                        </div>

                        {/* Right Column - Time Selection */}
                        <div className="lg:col-span-2 space-y-4">
                            {viewMode === 'smart' && (
                                <>
                                    {/* Optimal Times */}
                                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                        <div className="flex items-center gap-2 text-green-400 mb-3">
                                            <Zap className="w-5 h-5" />
                                            <span className="font-medium">AI Recommended Times</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {optimalSlots.slice(0, 6).map(slot => (
                                                <button
                                                    key={slot.hour}
                                                    onClick={() => setSelectedHour(slot.hour)}
                                                    className={`p-3 rounded-lg border transition-all ${selectedHour === slot.hour
                                                            ? 'bg-green-500 border-green-400 text-white'
                                                            : 'bg-white/5 border-white/10 hover:border-green-500/50 text-white'
                                                        }`}
                                                >
                                                    <p className="font-medium">{formatHour(slot.hour)}</p>
                                                    <p className="text-xs opacity-80">{slot.score.toFixed(0)}% score</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* All Time Slots */}
                                    <div>
                                        <h4 className="text-white font-medium mb-3">All Time Slots</h4>
                                        <div className="grid grid-cols-6 gap-2">
                                            {timeSlots.map(slot => (
                                                <button
                                                    key={slot.hour}
                                                    onClick={() => setSelectedHour(slot.hour)}
                                                    className={`p-2 rounded-lg border transition-all relative group ${selectedHour === slot.hour
                                                            ? 'bg-purple-500 border-purple-400'
                                                            : 'bg-white/5 border-white/10 hover:border-white/30'
                                                        }`}
                                                >
                                                    <div className="text-center">
                                                        <p className={`text-sm font-medium ${selectedHour === slot.hour ? 'text-white' : 'text-white/80'}`}>
                                                            {formatHour(slot.hour)}
                                                        </p>
                                                        <div className="mt-1 h-1.5 rounded-full overflow-hidden bg-white/10">
                                                            <div
                                                                className={`h-full ${getScoreColor(slot.score)}`}
                                                                style={{ width: `${slot.score}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* Tooltip */}
                                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                        {slot.reason}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {viewMode === 'calendar' && (
                                <div className="space-y-4">
                                    {/* Month Navigation */}
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-white/60" />
                                        </button>
                                        <h4 className="text-white font-medium">
                                            {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </h4>
                                        <button
                                            onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5 text-white/60" />
                                        </button>
                                    </div>

                                    {/* Calendar Grid */}
                                    <div className="grid grid-cols-7 gap-1">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                            <div key={day} className="p-2 text-center text-white/40 text-xs font-medium">
                                                {day}
                                            </div>
                                        ))}
                                        {generateCalendarDays().map((day, i) => {
                                            if (!day) return <div key={`empty-${i}`} />;
                                            const isSelected = day.toDateString() === selectedDate.toDateString();
                                            const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
                                            const isOptimalDay = platform.bestDays.includes(day.getDay());

                                            return (
                                                <button
                                                    key={day.toISOString()}
                                                    onClick={() => !isPast && setSelectedDate(day)}
                                                    disabled={isPast}
                                                    className={`p-2 rounded-lg transition-all relative ${isSelected
                                                            ? 'bg-purple-500 text-white'
                                                            : isPast
                                                                ? 'text-white/20 cursor-not-allowed'
                                                                : isOptimalDay
                                                                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                                    : 'text-white/80 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {day.getDate()}
                                                    {isOptimalDay && !isSelected && (
                                                        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-400 rounded-full" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Time Selection for Selected Date */}
                                    <div>
                                        <h4 className="text-white font-medium mb-2">
                                            Select Time for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </h4>
                                        <div className="grid grid-cols-6 gap-2">
                                            {timeSlots.filter(s => s.score >= 50).slice(0, 12).map(slot => (
                                                <button
                                                    key={slot.hour}
                                                    onClick={() => setSelectedHour(slot.hour)}
                                                    className={`p-2 rounded-lg border transition-all ${selectedHour === slot.hour
                                                            ? 'bg-purple-500 border-purple-400 text-white'
                                                            : 'bg-white/5 border-white/10 hover:border-white/30 text-white/80'
                                                        }`}
                                                >
                                                    {formatHour(slot.hour)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex items-center justify-between">
                    <div className="text-white/60 text-sm">
                        {selectedHour !== null && (
                            <span className="text-white">
                                Scheduled for: <span className="font-medium text-purple-400">
                                    {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {formatHour(selectedHour)}
                                </span>
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="px-4 py-2 border border-white/20 text-white/80 rounded-lg hover:bg-white/5 transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSchedule}
                            disabled={selectedHour === null}
                            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Clock className="w-4 h-4" />
                            Schedule Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
