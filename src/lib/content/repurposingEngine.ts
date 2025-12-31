// Content Repurposing Engine
// Transforms one piece of content into multiple formats for different platforms

export interface SourceContent {
    title: string;
    content: string;
    type: 'blog' | 'video-script' | 'podcast' | 'article' | 'tweet' | 'linkedin';
    keywords?: string[];
    tone?: 'professional' | 'casual' | 'humorous' | 'educational';
}

export interface RepurposedContent {
    id: string;
    platform: string;
    format: string;
    title: string;
    content: string;
    characterCount: number;
    estimatedEngagement: 'high' | 'medium' | 'low';
    hashtags?: string[];
    callToAction?: string;
    mediaHints?: string[]; // Suggestions for images/videos
}

export interface RepurposingResult {
    success: boolean;
    sourceId: string;
    repurposedContent: RepurposedContent[];
    processingTime: number;
    creditsUsed: number;
}

// Platform-specific limits and best practices
const PLATFORM_SPECS = {
    'twitter': {
        maxLength: 280,
        hashtagLimit: 3,
        format: 'Thread / Single Post',
        bestPractices: ['Keep it punchy', 'Use emojis sparingly', 'Strong hook in first line'],
    },
    'linkedin': {
        maxLength: 3000,
        hashtagLimit: 5,
        format: 'Article / Post',
        bestPractices: ['Professional tone', 'Add value', 'End with question or CTA'],
    },
    'instagram': {
        maxLength: 2200,
        hashtagLimit: 30,
        format: 'Caption / Carousel Script',
        bestPractices: ['Visual-first', 'Engaging first line', 'Clear CTA'],
    },
    'tiktok': {
        maxLength: 150,
        hashtagLimit: 5,
        format: 'Video Script / Caption',
        bestPractices: ['Hook in 3 seconds', 'Trend-aware', 'Conversational'],
    },
    'youtube': {
        maxLength: 5000,
        hashtagLimit: 15,
        format: 'Video Script / Description',
        bestPractices: ['SEO-optimized title', 'Timestamps', 'Strong intro'],
    },
    'threads': {
        maxLength: 500,
        hashtagLimit: 0,
        format: 'Conversational Post',
        bestPractices: ['Authentic voice', 'Encourage discussion', 'No hashtags needed'],
    },
    'facebook': {
        maxLength: 63206,
        hashtagLimit: 3,
        format: 'Post / Story',
        bestPractices: ['Engaging visuals', 'Community focus', 'Share-worthy content'],
    },
    'newsletter': {
        maxLength: 10000,
        hashtagLimit: 0,
        format: 'Email Newsletter',
        bestPractices: ['Compelling subject line', 'Personal tone', 'Clear sections'],
    },
    'blog-summary': {
        maxLength: 500,
        hashtagLimit: 0,
        format: 'Summary / Snippet',
        bestPractices: ['Key takeaways', 'Scannable', 'SEO keywords'],
    },
    'podcast-notes': {
        maxLength: 2000,
        hashtagLimit: 0,
        format: 'Show Notes',
        bestPractices: ['Timestamps', 'Key points', 'Guest info'],
    },
};

// Content transformation templates
const TRANSFORMATION_PROMPTS = {
    'blog-to-twitter': (content: string, title: string) => `
Transform this blog post into a compelling Twitter thread (5-8 tweets):

Title: ${title}
Content: ${content}

Rules:
- First tweet should be a hook that makes people want to read more (no "Thread" label)
- Each tweet max 280 characters
- Use line breaks for readability
- End with a CTA to engage
- Add 2-3 relevant hashtags at the end only
    `,

    'blog-to-linkedin': (content: string, title: string) => `
Transform this blog post into a LinkedIn post:

Title: ${title}
Content: ${content}

Rules:
- Professional but personable tone
- Start with a hook or bold statement
- Use short paragraphs
- Include bullet points or numbered lists
- End with a question or call to action
- Add 3-5 relevant hashtags
- Max 1500 characters
    `,

    'blog-to-instagram': (content: string, title: string) => `
Transform this blog post into an Instagram carousel script:

Title: ${title}
Content: ${content}

Create:
1. Hook slide (attention-grabbing first slide)
2. 5-7 content slides (one key point each)
3. CTA slide
4. Caption with emojis and 15-20 relevant hashtags
    `,

    'blog-to-tiktok': (content: string, title: string) => `
Transform this blog post into a TikTok video script:

Title: ${title}
Content: ${content}

Rules:
- Hook in first 3 seconds
- 30-60 second script
- Conversational, energetic tone
- Clear visual/action cues in [brackets]
- Trending audio suggestion
- Caption with 4-5 hashtags
    `,

    'blog-to-youtube': (content: string, title: string) => `
Transform this blog post into a YouTube video script:

Title: ${title}
Content: ${content}

Include:
1. SEO-optimized title (60 chars max)
2. Hook intro (15 seconds)
3. Main content with timestamps
4. Outro with CTA
5. Video description with keywords
6. 10 relevant tags
    `,

    'blog-to-threads': (content: string, title: string) => `
Transform this blog post into a Threads post:

Title: ${title}
Content: ${content}

Rules:
- Authentic, conversational tone
- Max 500 characters
- No hashtags (Threads doesn't use them heavily)
- Encourage discussion/replies
- Personal perspective
    `,

    'blog-to-newsletter': (content: string, title: string) => `
Transform this blog post into an email newsletter:

Title: ${title}
Content: ${content}

Include:
1. Compelling subject line (50 chars max)
2. Preview text
3. Personal greeting
4. Main content with headers
5. Key takeaways section
6. CTA button text
7. P.S. line (optional tip or teaser)
    `,
};

/**
 * Content Repurposing Service
 */
export class ContentRepurposingService {
    private apiKey?: string;

    constructor(apiKey?: string) {
        this.apiKey = apiKey;
    }

    /**
     * Repurpose content to multiple platforms
     */
    async repurposeContent(
        source: SourceContent,
        targetPlatforms: string[]
    ): Promise<RepurposingResult> {
        const startTime = Date.now();
        const repurposedContent: RepurposedContent[] = [];

        for (const platform of targetPlatforms) {
            try {
                const transformed = await this.transformForPlatform(source, platform);
                repurposedContent.push(transformed);
            } catch (error) {
                console.error(`Failed to repurpose for ${platform}:`, error);
            }
        }

        return {
            success: repurposedContent.length > 0,
            sourceId: `src_${Date.now()}`,
            repurposedContent,
            processingTime: Date.now() - startTime,
            creditsUsed: repurposedContent.length,
        };
    }

    /**
     * Transform content for a specific platform
     */
    private async transformForPlatform(
        source: SourceContent,
        platform: string
    ): Promise<RepurposedContent> {
        const specs = PLATFORM_SPECS[platform as keyof typeof PLATFORM_SPECS];

        // In production, this would call OpenAI or similar
        // For demo, we use intelligent transformation
        const transformed = this.intelligentTransform(source, platform, specs);

        return {
            id: `rep_${platform}_${Date.now()}`,
            platform,
            format: specs?.format || 'Post',
            title: this.generatePlatformTitle(source.title, platform),
            content: transformed.content,
            characterCount: transformed.content.length,
            estimatedEngagement: this.estimateEngagement(transformed.content, platform),
            hashtags: transformed.hashtags,
            callToAction: transformed.cta,
            mediaHints: this.generateMediaHints(source, platform),
        };
    }

    /**
     * Intelligent transformation without API (demo mode)
     */
    private intelligentTransform(
        source: SourceContent,
        platform: string,
        specs: typeof PLATFORM_SPECS[keyof typeof PLATFORM_SPECS] | undefined
    ): { content: string; hashtags: string[]; cta: string } {
        const sentences = source.content.split(/[.!?]+/).filter(s => s.trim());
        const keyPoints = sentences.slice(0, 5);

        let content = '';
        let hashtags: string[] = [];
        let cta = '';

        switch (platform) {
            case 'twitter':
                content = this.createTwitterThread(source.title, keyPoints);
                hashtags = this.extractHashtags(source, 3);
                cta = '💬 What do you think? Reply below!';
                break;

            case 'linkedin':
                content = this.createLinkedInPost(source.title, keyPoints, source.content);
                hashtags = this.extractHashtags(source, 5);
                cta = 'What are your thoughts on this? Share in the comments 👇';
                break;

            case 'instagram':
                content = this.createInstagramCaption(source.title, keyPoints);
                hashtags = this.extractHashtags(source, 20);
                cta = 'Double tap if you agree! 💜 Save for later 📌';
                break;

            case 'tiktok':
                content = this.createTikTokScript(source.title, keyPoints);
                hashtags = this.extractHashtags(source, 5);
                cta = 'Follow for more tips!';
                break;

            case 'youtube':
                content = this.createYouTubeScript(source.title, source.content);
                hashtags = this.extractHashtags(source, 10);
                cta = 'Like, subscribe, and hit the bell! 🔔';
                break;

            case 'threads':
                content = this.createThreadsPost(source.title, keyPoints);
                hashtags = [];
                cta = 'What would you add to this?';
                break;

            case 'newsletter':
                content = this.createNewsletter(source.title, source.content);
                hashtags = [];
                cta = 'Reply to this email - I read every response!';
                break;

            default:
                content = source.content.substring(0, specs?.maxLength || 500);
                hashtags = this.extractHashtags(source, 3);
                cta = 'Learn more at the link in bio!';
        }

        return { content, hashtags, cta };
    }

    /**
     * Create Twitter thread
     */
    private createTwitterThread(title: string, points: string[]): string {
        const tweets: string[] = [];

        // Hook tweet
        tweets.push(`🧵 ${title}\n\nHere's what you need to know:`);

        // Content tweets
        points.forEach((point, i) => {
            const cleaned = point.trim();
            if (cleaned.length > 250) {
                tweets.push(`${i + 1}. ${cleaned.substring(0, 247)}...`);
            } else {
                tweets.push(`${i + 1}. ${cleaned}`);
            }
        });

        // Closing tweet
        tweets.push(`That's a wrap! 🎬\n\nIf this was helpful:\n• Retweet the first tweet\n• Follow for more insights\n• Drop your thoughts below 👇`);

        return tweets.join('\n\n---\n\n');
    }

    /**
     * Create LinkedIn post
     */
    private createLinkedInPost(title: string, points: string[], fullContent: string): string {
        const hook = points[0]?.trim() || title;
        const keyPoints = points.slice(1, 4);

        let post = `${hook}\n\n`;
        post += `Here's the breakdown:\n\n`;

        keyPoints.forEach((point, i) => {
            post += `✅ ${point.trim()}\n\n`;
        });

        post += `---\n\n`;
        post += `💡 Key takeaway: ${title}\n\n`;
        post += `Agree or disagree? I'd love to hear your perspective.`;

        return post;
    }

    /**
     * Create Instagram caption
     */
    private createInstagramCaption(title: string, points: string[]): string {
        let caption = `✨ ${title} ✨\n\n`;
        caption += `Here's what you need to know 👇\n\n`;

        points.slice(0, 3).forEach((point, i) => {
            const emojis = ['💫', '🌟', '⭐', '✨', '💡'];
            caption += `${emojis[i]} ${point.trim()}\n\n`;
        });

        caption += `Save this post for later! 📌\n\n`;
        caption += `---\n\n`;
        caption += `🔗 Link in bio for more\n`;
        caption += `📱 Share with someone who needs this`;

        return caption;
    }

    /**
     * Create TikTok script
     */
    private createTikTokScript(title: string, points: string[]): string {
        let script = `🎬 TIKTOK SCRIPT\n\n`;
        script += `[HOOK - 0-3 sec]\n`;
        script += `"Did you know MOST people get this wrong?"\n\n`;

        script += `[MAIN CONTENT - 3-45 sec]\n`;
        script += `"${title}\n\n`;

        points.slice(0, 2).forEach((point, i) => {
            script += `Point ${i + 1}: ${point.trim().substring(0, 100)}\n\n`;
        });

        script += `[CTA - 45-60 sec]\n`;
        script += `"Follow for more tips like this!"\n`;
        script += `[Point to follow button]\n\n`;

        script += `📱 Caption: Quick tip that changed everything for me`;

        return script;
    }

    /**
     * Create YouTube script
     */
    private createYouTubeScript(title: string, content: string): string {
        const sentences = content.split(/[.!?]+/).filter(s => s.trim());

        let script = `📹 YOUTUBE VIDEO SCRIPT\n\n`;
        script += `TITLE: ${title}\n\n`;

        script += `[INTRO - 0:00-0:30]\n`;
        script += `"Hey everyone! Today we're diving into ${title}. `;
        script += `If you find this valuable, hit that subscribe button!"\n\n`;

        script += `[MAIN CONTENT]\n`;
        script += `\n0:30 - Introduction\n`;
        script += `${sentences[0] || ''}\n\n`;

        script += `2:00 - Key Concept #1\n`;
        script += `${sentences[1] || ''}\n\n`;

        script += `4:00 - Key Concept #2\n`;
        script += `${sentences[2] || ''}\n\n`;

        script += `6:00 - Practical Tips\n`;
        script += `${sentences[3] || ''}\n\n`;

        script += `[OUTRO - Last 30 sec]\n`;
        script += `"Thanks for watching! Drop a comment with your thoughts, `;
        script += `and I'll see you in the next one!"\n\n`;

        script += `---\nDESCRIPTION:\n`;
        script += `${title}\n\n`;
        script += `In this video, we cover:\n`;
        script += `• Introduction to the topic\n`;
        script += `• Key concepts you need to know\n`;
        script += `• Practical tips for implementation\n\n`;
        script += `🔔 Subscribe for more content!`;

        return script;
    }

    /**
     * Create Threads post
     */
    private createThreadsPost(title: string, points: string[]): string {
        let post = `Real talk about ${title.toLowerCase()}...\n\n`;
        post += `${points[0]?.trim() || ''}\n\n`;
        post += `The thing nobody tells you? ${points[1]?.trim().substring(0, 100) || 'It takes time.'}\n\n`;
        post += `What's your experience with this?`;

        return post;
    }

    /**
     * Create newsletter
     */
    private createNewsletter(title: string, content: string): string {
        const sentences = content.split(/[.!?]+/).filter(s => s.trim());

        let newsletter = `📧 NEWSLETTER\n\n`;
        newsletter += `Subject: ${title} (Don't miss this)\n`;
        newsletter += `Preview: Here's what I learned this week...\n\n`;
        newsletter += `---\n\n`;
        newsletter += `Hey there! 👋\n\n`;
        newsletter += `Hope your week is going great. Today I want to share something important:\n\n`;
        newsletter += `**${title}**\n\n`;

        sentences.slice(0, 3).forEach(sentence => {
            newsletter += `${sentence.trim()}.\n\n`;
        });

        newsletter += `**Key Takeaways:**\n`;
        newsletter += `• ${sentences[0]?.trim().substring(0, 80) || 'Main point one'}\n`;
        newsletter += `• ${sentences[1]?.trim().substring(0, 80) || 'Main point two'}\n`;
        newsletter += `• ${sentences[2]?.trim().substring(0, 80) || 'Main point three'}\n\n`;

        newsletter += `[Read More on Our Blog →]\n\n`;
        newsletter += `Until next time,\n`;
        newsletter += `Your Name\n\n`;
        newsletter += `P.S. Reply to this email with your questions - I read every one!`;

        return newsletter;
    }

    /**
     * Extract relevant hashtags
     */
    private extractHashtags(source: SourceContent, limit: number): string[] {
        const keywords = source.keywords || [];
        const titleWords = source.title.toLowerCase().split(' ').filter(w => w.length > 3);

        const allTags = [...keywords, ...titleWords]
            .map(w => w.replace(/[^a-zA-Z0-9]/g, ''))
            .filter(w => w.length > 2)
            .map(w => `#${w}`);

        // Add common engagement hashtags
        const commonTags = ['#tips', '#growth', '#success', '#motivation', '#business'];
        const combined = [...new Set([...allTags, ...commonTags])];

        return combined.slice(0, limit);
    }

    /**
     * Generate platform-specific title
     */
    private generatePlatformTitle(title: string, platform: string): string {
        switch (platform) {
            case 'youtube':
                return `${title} | Complete Guide`;
            case 'tiktok':
                return `${title} #viral`;
            case 'newsletter':
                return `${title} (Don't miss this)`;
            default:
                return title;
        }
    }

    /**
     * Estimate engagement potential
     */
    private estimateEngagement(content: string, platform: string): 'high' | 'medium' | 'low' {
        const specs = PLATFORM_SPECS[platform as keyof typeof PLATFORM_SPECS];
        if (!specs) return 'medium';

        const lengthScore = content.length < specs.maxLength * 0.7 ? 1 : 0;
        const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(content) ? 1 : 0;
        const hasCTA = /\?|comment|share|follow|like/i.test(content) ? 1 : 0;

        const score = lengthScore + hasEmoji + hasCTA;
        return score >= 2 ? 'high' : score === 1 ? 'medium' : 'low';
    }

    /**
     * Generate media hints for the platform
     */
    private generateMediaHints(source: SourceContent, platform: string): string[] {
        const hints: string[] = [];

        switch (platform) {
            case 'instagram':
                hints.push('Create branded carousel slides');
                hints.push('Use brand colors and fonts');
                hints.push('Add visual hierarchy');
                break;
            case 'tiktok':
                hints.push('Record in vertical format (9:16)');
                hints.push('Add trending audio');
                hints.push('Use text overlays');
                break;
            case 'youtube':
                hints.push('Create custom thumbnail');
                hints.push('Add chapter markers');
                hints.push('Include B-roll footage');
                break;
            case 'linkedin':
                hints.push('Add professional image or infographic');
                hints.push('Consider document/carousel post');
                break;
            case 'twitter':
                hints.push('Add relevant image or GIF');
                hints.push('Consider thread format with visuals');
                break;
        }

        return hints;
    }
}

/**
 * Create content repurposing service
 */
export function createRepurposingService(apiKey?: string): ContentRepurposingService {
    return new ContentRepurposingService(apiKey);
}

/**
 * Quick repurpose function
 */
export async function quickRepurpose(
    content: string,
    title: string,
    platforms: string[]
): Promise<RepurposingResult> {
    const service = new ContentRepurposingService();
    return service.repurposeContent(
        { title, content, type: 'blog' },
        platforms
    );
}
