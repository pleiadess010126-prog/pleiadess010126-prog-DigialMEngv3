'use client';

import React, { useState } from 'react';
import {
    Calendar, Download, ExternalLink, Copy, Check, FileDown,
    Share2, Link, Clock, ChevronDown, Printer
} from 'lucide-react';

// Types for calendar export
interface ScheduledContent {
    id: string;
    title: string;
    platform: string;
    scheduledFor: Date;
    status: 'scheduled' | 'published' | 'draft';
    type: string;
}

interface CalendarExportProps {
    scheduledContent?: ScheduledContent[];
}

// Mock scheduled content
const mockScheduledContent: ScheduledContent[] = [
    {
        id: '1',
        title: '10 Marketing Tips for 2025',
        platform: 'WordPress',
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'scheduled',
        type: 'blog',
    },
    {
        id: '2',
        title: 'Quick Tips Reel #42',
        platform: 'Instagram',
        scheduledFor: new Date(Date.now() + 48 * 60 * 60 * 1000),
        status: 'scheduled',
        type: 'instagram-reel',
    },
    {
        id: '3',
        title: 'Behind the Scenes Story',
        platform: 'Facebook',
        scheduledFor: new Date(Date.now() + 72 * 60 * 60 * 1000),
        status: 'scheduled',
        type: 'facebook-story',
    },
    {
        id: '4',
        title: 'YouTube Short: AI Marketing',
        platform: 'YouTube',
        scheduledFor: new Date(Date.now() + 96 * 60 * 60 * 1000),
        status: 'scheduled',
        type: 'youtube-short',
    },
];

export default function CalendarExport({ scheduledContent = mockScheduledContent }: CalendarExportProps) {
    const [copied, setCopied] = useState(false);
    const [exportFormat, setExportFormat] = useState<'ical' | 'gcal' | 'outlook'>('gcal');
    const [showFormatDropdown, setShowFormatDropdown] = useState(false);
    const [dateRange, setDateRange] = useState<'week' | 'month' | 'all'>('month');

    // Generate iCal format string
    const generateICalEvents = () => {
        const events = scheduledContent.map(content => {
            const startDate = content.scheduledFor;
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

            const formatDate = (date: Date) => {
                return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            };

            return `BEGIN:VEVENT
UID:${content.id}@digitalmeng.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:[${content.platform}] ${content.title}
DESCRIPTION:Content Type: ${content.type}\\nPlatform: ${content.platform}\\nStatus: ${content.status}
CATEGORIES:${content.platform},DigitalMEng
STATUS:CONFIRMED
END:VEVENT`;
        }).join('\n');

        return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DigitalMEng//Content Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:DigitalMEng Content Calendar
X-WR-TIMEZONE:UTC
${events}
END:VCALENDAR`;
    };

    // Generate Google Calendar URL for a single event
    const generateGoogleCalendarUrl = (content: ScheduledContent) => {
        const startDate = content.scheduledFor;
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        const formatDate = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: `[${content.platform}] ${content.title}`,
            dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
            details: `Content Type: ${content.type}\nPlatform: ${content.platform}\nManaged by DigitalMEng`,
            sf: 'true',
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    // Generate shareable calendar URL
    const generateShareableUrl = () => {
        // In production, this would be a real API endpoint
        return `https://app.digitalmeng.com/calendar/share/${Math.random().toString(36).slice(2)}`;
    };

    // Download iCal file
    const downloadICal = () => {
        const icalContent = generateICalEvents();
        const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `digitalmeng-content-calendar-${new Date().toISOString().split('T')[0]}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Copy shareable URL
    const copyShareableUrl = async () => {
        const url = generateShareableUrl();
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Add all to Google Calendar
    const addAllToGoogleCalendar = () => {
        // Open first event, user can add more manually
        if (scheduledContent.length > 0) {
            window.open(generateGoogleCalendarUrl(scheduledContent[0]), '_blank');
        }
    };

    // Print calendar view
    const printCalendar = () => {
        window.print();
    };

    // Filter content by date range
    const getFilteredContent = () => {
        const now = new Date();
        return scheduledContent.filter(content => {
            if (dateRange === 'all') return true;
            if (dateRange === 'week') {
                const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                return content.scheduledFor >= now && content.scheduledFor <= weekFromNow;
            }
            if (dateRange === 'month') {
                const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                return content.scheduledFor >= now && content.scheduledFor <= monthFromNow;
            }
            return true;
        });
    };

    const filteredContent = getFilteredContent();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                        <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Calendar Export</h2>
                        <p className="text-white/60 text-sm">Export and share your content schedule</p>
                    </div>
                </div>

                {/* Date Range Filter */}
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                    {(['week', 'month', 'all'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dateRange === range
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {range === 'week' ? '7 Days' : range === 'month' ? '30 Days' : 'All'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Export Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Download iCal */}
                <button
                    onClick={downloadICal}
                    className="card p-5 hover:bg-white/10 transition-all group text-left"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                            <FileDown className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Download .ICS</h3>
                            <p className="text-sm text-white/50">Import to any calendar app</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm">
                        <Download className="w-4 h-4" />
                        Download Calendar File
                    </div>
                </button>

                {/* Add to Google Calendar */}
                <button
                    onClick={addAllToGoogleCalendar}
                    className="card p-5 hover:bg-white/10 transition-all group text-left"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/20 rounded-xl group-hover:bg-red-500/30 transition-colors">
                            <Calendar className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Google Calendar</h3>
                            <p className="text-sm text-white/50">Add directly to Google Cal</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-red-400 text-sm">
                        <ExternalLink className="w-4 h-4" />
                        Open in Google Calendar
                    </div>
                </button>

                {/* Share Calendar Link */}
                <button
                    onClick={copyShareableUrl}
                    className="card p-5 hover:bg-white/10 transition-all group text-left"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                            <Share2 className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Share Calendar</h3>
                            <p className="text-sm text-white/50">Get a shareable link</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-purple-400 text-sm">
                        {copied ? (
                            <>
                                <Check className="w-4 h-4" />
                                Link Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                Copy Shareable Link
                            </>
                        )}
                    </div>
                </button>
            </div>

            {/* Upcoming Content Preview */}
            <div className="card">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-400" />
                        Upcoming Content ({filteredContent.length} items)
                    </h3>
                    <button
                        onClick={printCalendar}
                        className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <Printer className="w-5 h-5" />
                    </button>
                </div>

                <div className="divide-y divide-white/10 max-h-96 overflow-y-auto">
                    {filteredContent.length === 0 ? (
                        <div className="p-8 text-center text-white/40">
                            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No scheduled content in this period</p>
                        </div>
                    ) : (
                        filteredContent.map((content) => (
                            <div key={content.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    {/* Date Badge */}
                                    <div className="text-center bg-emerald-500/20 rounded-lg p-2 min-w-[50px]">
                                        <p className="text-xs text-emerald-300 font-medium">
                                            {content.scheduledFor.toLocaleDateString('en-US', { month: 'short' })}
                                        </p>
                                        <p className="text-xl font-bold text-emerald-400">
                                            {content.scheduledFor.getDate()}
                                        </p>
                                    </div>

                                    {/* Content Info */}
                                    <div>
                                        <p className="font-medium text-white">{content.title}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded">
                                                {content.platform}
                                            </span>
                                            <span className="text-xs text-white/40">
                                                {content.scheduledFor.toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => window.open(generateGoogleCalendarUrl(content), '_blank')}
                                    className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 text-sm flex items-center gap-2 transition-colors"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Add
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Integration Info */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <h4 className="font-medium text-emerald-300 mb-2 flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Calendar Sync Options
                </h4>
                <div className="text-sm text-white/60 space-y-2">
                    <p>• <strong>.ICS File:</strong> Works with Apple Calendar, Outlook, Google Calendar, and more</p>
                    <p>• <strong>Google Calendar:</strong> Click &quot;Add&quot; on any event to add it directly</p>
                    <p>• <strong>Share Link:</strong> Share with team members or clients for read-only access</p>
                </div>
            </div>
        </div>
    );
}
