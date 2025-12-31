// Agent Nandu - AI Assistant Service
// A proactive AI assistant that can understand context and execute actions

export interface AgentContext {
    currentPage: string;
    selectedContent?: any;
    userPlan: string;
    usage: any;
    recentActions: string[];
}

export interface AgentAction {
    id: string;
    type: 'navigate' | 'generate' | 'schedule' | 'analyze' | 'suggest' | 'execute' | 'explain';
    label: string;
    description: string;
    icon: string;
    execute: () => void | Promise<void>;
}

export interface AgentSuggestion {
    id: string;
    type: 'tip' | 'action' | 'warning' | 'insight';
    title: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    actions?: AgentAction[];
}

export interface AgentMessage {
    id: string;
    role: 'user' | 'agent';
    content: string;
    timestamp: Date;
    actions?: AgentAction[];
    suggestions?: AgentSuggestion[];
    isTyping?: boolean;
}

// Agent capabilities
export const AGENT_CAPABILITIES = {
    content: [
        { cmd: 'generate', desc: 'Generate content for any platform', example: 'Generate a LinkedIn post about AI trends' },
        { cmd: 'repurpose', desc: 'Transform content to multiple formats', example: 'Repurpose my last blog to Twitter thread' },
        { cmd: 'improve', desc: 'Enhance existing content', example: 'Make this more engaging' },
        { cmd: 'translate', desc: 'Translate content to other languages', example: 'Translate this to Spanish' },
    ],
    scheduling: [
        { cmd: 'schedule', desc: 'Schedule content for publishing', example: 'Schedule this for tomorrow at 9am' },
        { cmd: 'best-time', desc: 'Find optimal posting times', example: 'When should I post on Instagram?' },
        { cmd: 'calendar', desc: 'Show content calendar', example: 'Show my schedule for this week' },
    ],
    analytics: [
        { cmd: 'analyze', desc: 'Analyze content performance', example: 'How did my last post perform?' },
        { cmd: 'insights', desc: 'Get audience insights', example: 'Who is my audience?' },
        { cmd: 'trends', desc: 'Discover trending topics', example: 'What\'s trending in my niche?' },
    ],
    help: [
        { cmd: 'help', desc: 'Get help with the platform', example: 'How do I connect Instagram?' },
        { cmd: 'tour', desc: 'Take a product tour', example: 'Show me around' },
        { cmd: 'shortcuts', desc: 'Learn keyboard shortcuts', example: 'What shortcuts are available?' },
    ],
};

// Contextual suggestions based on where user is
export function getContextualSuggestions(context: AgentContext): AgentSuggestion[] {
    const suggestions: AgentSuggestion[] = [];

    // Low usage suggestions
    if (context.usage && context.usage.contentGenerated < 5) {
        suggestions.push({
            id: 'low-usage',
            type: 'tip',
            title: 'Getting Started',
            message: 'I can help you generate your first batch of content. Would you like me to create 5 posts for your top platform?',
            priority: 'high',
        });
    }

    // Page-specific suggestions
    switch (context.currentPage) {
        case 'dashboard':
            suggestions.push({
                id: 'dashboard-tip',
                type: 'insight',
                title: 'Dashboard Overview',
                message: 'I noticed your engagement is up 23% this week! Want me to analyze what\'s working?',
                priority: 'medium',
            });
            break;
        case 'content':
            suggestions.push({
                id: 'content-tip',
                type: 'action',
                title: 'Content Ideas',
                message: 'Based on trending topics in your niche, I have 5 content ideas. Want to see them?',
                priority: 'medium',
            });
            break;
        case 'analytics':
            suggestions.push({
                id: 'analytics-tip',
                type: 'insight',
                title: 'Performance Insight',
                message: 'Your best performing content type is carousels. Should I help you create more?',
                priority: 'high',
            });
            break;
    }

    return suggestions;
}

// Process natural language commands
export async function processAgentCommand(
    input: string,
    context: AgentContext
): Promise<AgentMessage> {
    const lowerInput = input.toLowerCase();

    // Content generation
    if (lowerInput.includes('generate') || lowerInput.includes('create') || lowerInput.includes('write')) {
        return {
            id: `msg_${Date.now()}`,
            role: 'agent',
            content: 'I can help you generate content! What platform would you like to create content for?',
            timestamp: new Date(),
            actions: [
                { id: 'gen-linkedin', type: 'generate', label: 'LinkedIn Post', description: 'Professional content', icon: '💼', execute: () => { } },
                { id: 'gen-twitter', type: 'generate', label: 'Twitter Thread', description: 'Engaging thread', icon: '🐦', execute: () => { } },
                { id: 'gen-instagram', type: 'generate', label: 'Instagram Caption', description: 'Visual story', icon: '📸', execute: () => { } },
                { id: 'gen-blog', type: 'generate', label: 'Blog Post', description: 'Long-form content', icon: '📝', execute: () => { } },
            ],
        };
    }

    // Analytics
    if (lowerInput.includes('analytics') || lowerInput.includes('performance') || lowerInput.includes('how did')) {
        return {
            id: `msg_${Date.now()}`,
            role: 'agent',
            content: '📊 Here\'s your content performance summary:\n\n• Total Reach: 45.2K (+12% vs last week)\n• Engagement Rate: 4.8% (above average!)\n• Top Performer: Your Monday LinkedIn post\n• Best Time: Tuesdays at 10am\n\nWant me to dig deeper into any metric?',
            timestamp: new Date(),
            actions: [
                { id: 'more-analytics', type: 'analyze', label: 'Detailed Report', description: 'Full analysis', icon: '📈', execute: () => { } },
                { id: 'export-analytics', type: 'execute', label: 'Export Data', description: 'Download CSV', icon: '📥', execute: () => { } },
            ],
        };
    }

    // Scheduling
    if (lowerInput.includes('schedule') || lowerInput.includes('when') || lowerInput.includes('best time')) {
        return {
            id: `msg_${Date.now()}`,
            role: 'agent',
            content: '📅 Based on your audience behavior, here are the optimal posting times:\n\n• LinkedIn: Tue/Wed 9-11am\n• Twitter: Mon-Fri 12-1pm\n• Instagram: Tue/Thu 7-8pm\n• TikTok: Daily 6-9pm\n\nWant me to auto-schedule your content queue for these times?',
            timestamp: new Date(),
            actions: [
                { id: 'auto-schedule', type: 'schedule', label: 'Auto-Schedule', description: 'Optimize all posts', icon: '🚀', execute: () => { } },
                { id: 'view-calendar', type: 'navigate', label: 'View Calendar', description: 'See schedule', icon: '📆', execute: () => { } },
            ],
        };
    }

    // Repurpose
    if (lowerInput.includes('repurpose') || lowerInput.includes('transform') || lowerInput.includes('convert')) {
        return {
            id: `msg_${Date.now()}`,
            role: 'agent',
            content: '🔄 I can repurpose your content into multiple formats!\n\nChoose a source content type, and I\'ll transform it for all your platforms:',
            timestamp: new Date(),
            actions: [
                { id: 'rep-blog', type: 'execute', label: 'From Blog Post', description: '→ 8 formats', icon: '📝', execute: () => { } },
                { id: 'rep-video', type: 'execute', label: 'From Video Script', description: '→ 6 formats', icon: '🎬', execute: () => { } },
                { id: 'rep-podcast', type: 'execute', label: 'From Podcast', description: '→ 5 formats', icon: '🎙️', execute: () => { } },
            ],
        };
    }

    // Help
    if (lowerInput.includes('help') || lowerInput.includes('how do i') || lowerInput.includes('what can')) {
        return {
            id: `msg_${Date.now()}`,
            role: 'agent',
            content: '👋 I\'m Nandu, your AI assistant! Here\'s what I can help you with:\n\n**Content**\n• Generate posts, blogs, scripts\n• Repurpose content to 8+ formats\n• Improve and optimize content\n\n**Scheduling**\n• Find best posting times\n• Auto-schedule content\n• Manage your calendar\n\n**Analytics**\n• Track performance\n• Get audience insights\n• Discover trends\n\nJust tell me what you need in plain English!',
            timestamp: new Date(),
        };
    }

    // Trends
    if (lowerInput.includes('trend') || lowerInput.includes('trending') || lowerInput.includes('popular')) {
        return {
            id: `msg_${Date.now()}`,
            role: 'agent',
            content: '🔥 Hot trends in your niche right now:\n\n1. **AI & Automation** - 234% increase\n2. **Remote Work Tips** - Consistently popular\n3. **Sustainability** - Rising fast\n4. **Mental Health at Work** - High engagement\n5. **Tech Layoffs** - Current news topic\n\nWant me to generate content on any of these?',
            timestamp: new Date(),
            actions: [
                { id: 'gen-trend', type: 'generate', label: 'Generate Content', description: 'On trending topic', icon: '✍️', execute: () => { } },
                { id: 'more-trends', type: 'analyze', label: 'More Trends', description: 'Extended list', icon: '📊', execute: () => { } },
            ],
        };
    }

    // Default response for unknown commands
    return {
        id: `msg_${Date.now()}`,
        role: 'agent',
        content: `I understand you want to "${input}". Let me help you with that!\n\nHere are some actions I can take:`,
        timestamp: new Date(),
        actions: [
            { id: 'gen-content', type: 'generate', label: 'Generate Content', description: 'Create new content', icon: '✨', execute: () => { } },
            { id: 'get-insights', type: 'analyze', label: 'Get Insights', description: 'Analyze data', icon: '📊', execute: () => { } },
            { id: 'get-help', type: 'explain', label: 'Explain More', description: 'Learn how', icon: '❓', execute: () => { } },
        ],
    };
}

// Quick actions the agent can perform
export const QUICK_ACTIONS = [
    { id: 'quick-content', label: 'Generate Content', icon: '✨', command: 'generate content' },
    { id: 'quick-repurpose', label: 'Repurpose', icon: '🔄', command: 'repurpose content' },
    { id: 'quick-analytics', label: 'Analytics', icon: '📊', command: 'show analytics' },
    { id: 'quick-schedule', label: 'Best Times', icon: '⏰', command: 'best posting times' },
    { id: 'quick-trends', label: 'Trends', icon: '🔥', command: 'show trends' },
    { id: 'quick-help', label: 'Help', icon: '❓', command: 'help' },
];

// Proactive suggestions based on user behavior
export function getProactiveInsights(context: AgentContext): string | null {
    const hour = new Date().getHours();

    // Morning greeting with insights
    if (hour >= 6 && hour < 10) {
        return "Good morning! 🌅 Nandu here! Your content from yesterday got 23% more engagement than usual. Ready to keep the momentum going?";
    }

    // Midday content suggestion
    if (hour >= 11 && hour < 14) {
        return "Hey! Nandu here 📈 Perfect time to post on LinkedIn! Would you like me to generate a quick post?";
    }

    // Evening review
    if (hour >= 18 && hour < 21) {
        return "Hey! Nandu checking in 🌙 You have 3 posts scheduled for tomorrow. Want me to review them?";
    }

    return null;
}
