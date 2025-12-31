// AI Content Generator - Supports Multiple AI Providers
// Priority: AWS Bedrock → OpenAI → Anthropic → Mock
// Multi-Language Support: 20+ languages for global content creation

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export type AIProvider = 'bedrock' | 'openai' | 'anthropic' | 'mock';

// Supported languages for content generation
export type ContentLanguage =
    | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'nl' | 'ru' | 'zh' | 'ja'
    | 'ko' | 'ar' | 'hi' | 'tr' | 'vi' | 'th' | 'id' | 'pl' | 'sv' | 'he'
    | 'bn' | 'ta' | 'te' | 'mr' | 'gu' | 'ms' | 'fil' | 'uk' | 'cs' | 'ro';

export const CONTENT_LANGUAGES: Record<ContentLanguage, { name: string; nativeName: string; rtl: boolean }> = {
    en: { name: 'English', nativeName: 'English', rtl: false },
    es: { name: 'Spanish', nativeName: 'Español', rtl: false },
    fr: { name: 'French', nativeName: 'Français', rtl: false },
    de: { name: 'German', nativeName: 'Deutsch', rtl: false },
    it: { name: 'Italian', nativeName: 'Italiano', rtl: false },
    pt: { name: 'Portuguese', nativeName: 'Português', rtl: false },
    nl: { name: 'Dutch', nativeName: 'Nederlands', rtl: false },
    ru: { name: 'Russian', nativeName: 'Русский', rtl: false },
    zh: { name: 'Chinese', nativeName: '中文', rtl: false },
    ja: { name: 'Japanese', nativeName: '日本語', rtl: false },
    ko: { name: 'Korean', nativeName: '한국어', rtl: false },
    ar: { name: 'Arabic', nativeName: 'العربية', rtl: true },
    hi: { name: 'Hindi', nativeName: 'हिन्दी', rtl: false },
    tr: { name: 'Turkish', nativeName: 'Türkçe', rtl: false },
    vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', rtl: false },
    th: { name: 'Thai', nativeName: 'ไทย', rtl: false },
    id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia', rtl: false },
    pl: { name: 'Polish', nativeName: 'Polski', rtl: false },
    sv: { name: 'Swedish', nativeName: 'Svenska', rtl: false },
    he: { name: 'Hebrew', nativeName: 'עברית', rtl: true },
    bn: { name: 'Bengali', nativeName: 'বাংলা', rtl: false },
    ta: { name: 'Tamil', nativeName: 'தமிழ்', rtl: false },
    te: { name: 'Telugu', nativeName: 'తెలుగు', rtl: false },
    mr: { name: 'Marathi', nativeName: 'मराठी', rtl: false },
    gu: { name: 'Gujarati', nativeName: 'ગુજરાતી', rtl: false },
    ms: { name: 'Malay', nativeName: 'Bahasa Melayu', rtl: false },
    fil: { name: 'Filipino', nativeName: 'Filipino', rtl: false },
    uk: { name: 'Ukrainian', nativeName: 'Українська', rtl: false },
    cs: { name: 'Czech', nativeName: 'Čeština', rtl: false },
    ro: { name: 'Romanian', nativeName: 'Română', rtl: false },
};

export interface GenerateContentParams {
    topic: string;
    keywords: string[];
    contentType: 'blog' | 'youtube-short' | 'instagram-reel' | 'facebook-story';
    targetAudience: string;
    tone?: 'professional' | 'casual' | 'educational' | 'entertaining';
    length?: 'short' | 'medium' | 'long';
    language?: ContentLanguage;  // Primary language for content generation
    additionalLanguages?: ContentLanguage[];  // Auto-translate to these languages
}

export interface GeneratedContent {
    title: string;
    content: string;
    excerpt: string;
    seoScore: number;
    language: ContentLanguage;  // Language of this content
    metadata: {
        topicPillar: string;
        keywords: string[];
        hashtags?: string[];
        estimatedReadTime?: number;
        wordCount: number;
        isTranslation?: boolean;  // True if this is a translated version
        originalLanguage?: ContentLanguage;
    };
}

// Initialize AI clients
let bedrockClient: BedrockRuntimeClient | null = null;
let openaiClient: OpenAI | null = null;
let anthropicClient: Anthropic | null = null;

// Initialize based on available credentials
function initializeClients() {
    // AWS Bedrock
    if (process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID) {
        bedrockClient = new BedrockRuntimeClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        });
    }

    // OpenAI
    if (process.env.OPENAI_API_KEY) {
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    // Anthropic Claude
    if (process.env.ANTHROPIC_API_KEY) {
        anthropicClient = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
    }
}

initializeClients();

/**
 * Detect which AI provider is available
 */
export function getAvailableProvider(): AIProvider {
    if (bedrockClient) return 'bedrock';
    if (openaiClient) return 'openai';
    if (anthropicClient) return 'anthropic';
    return 'mock';
}

/**
 * Generate content using AWS Bedrock (Claude 3)
 */
async function generateWithBedrock(params: GenerateContentParams): Promise<GeneratedContent> {
    if (!bedrockClient) throw new Error('Bedrock client not initialized');

    const prompt = buildPrompt(params);

    const command = new InvokeModelCommand({
        modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
        body: JSON.stringify({
            anthropic_version: 'bedrock-2023-05-31',
            max_tokens: params.length === 'short' ? 500 : params.length === 'long' ? 2000 : 1000,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        }),
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const generatedText = responseBody.content[0].text;

    return parseGeneratedContent(generatedText, params);
}

/**
 * Generate content using OpenAI
 */
async function generateWithOpenAI(params: GenerateContentParams): Promise<GeneratedContent> {
    if (!openaiClient) throw new Error('OpenAI client not initialized');

    const prompt = buildPrompt(params);

    const response = await openaiClient.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
            {
                role: 'system',
                content: 'You are an expert content writer specializing in SEO-optimized, engaging content for digital marketing.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        max_tokens: params.length === 'short' ? 500 : params.length === 'long' ? 2000 : 1000,
        temperature: 0.7,
    });

    const generatedText = response.choices[0].message.content || '';
    return parseGeneratedContent(generatedText, params);
}

/**
 * Generate content using Anthropic Claude API
 */
async function generateWithAnthropic(params: GenerateContentParams): Promise<GeneratedContent> {
    if (!anthropicClient) throw new Error('Anthropic client not initialized');

    const prompt = buildPrompt(params);

    const response = await anthropicClient.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: params.length === 'short' ? 500 : params.length === 'long' ? 2000 : 1000,
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    const generatedText = response.content[0].type === 'text' ? response.content[0].text : '';
    return parseGeneratedContent(generatedText, params);
}

/**
 * Generate mock content (fallback when no AI provider available)
 */
function generateMockContent(params: GenerateContentParams): GeneratedContent {
    const { topic, keywords, contentType } = params;

    const mockTitles = {
        blog: `The Ultimate Guide to ${topic}: Everything You Need to Know`,
        'youtube-short': `${topic} in 60 Seconds | Quick Tips`,
        'instagram-reel': `${topic} Hacks You Need to Try! 🔥`,
        'facebook-story': `Did You Know This About ${topic}?`,
    };

    const mockContent = {
        blog: `# ${mockTitles.blog}\n\n${topic} is becoming increasingly important in today's digital landscape. Here's what you need to know:\n\n## Key Points\n\n${keywords.map((k, i) => `${i + 1}. **${k}**: Understanding ${k} is crucial for success in ${topic}.`).join('\n')}\n\n## Conclusion\n\nBy mastering these aspects of ${topic}, you'll be well-positioned for success. Remember to focus on ${keywords[0]} and continuously learn about ${keywords[1]}.\n\n*Generated with AI assistance and reviewed by human editors for E-E-A-T compliance.*`,
        'youtube-short': `🎯 ${topic} Quick Guide!\n\n${keywords.slice(0, 3).map((k, i) => `${i + 1}️⃣ ${k}`).join('\n')}\n\n💡 Pro tip: Focus on ${keywords[0]}!\n\n#${topic.replace(/\s+/g, '')} #Shorts #Tutorial`,
        'instagram-reel': `✨ ${mockTitles['instagram-reel']}\n\n${keywords.slice(0, 3).map(k => `• ${k}`).join('\n')}\n\nSave this for later! 📌\n\n${keywords.slice(0, 5).map(k => `#${k.replace(/\s+/g, '')}`).join(' ')}`,
        'facebook-story': `${mockTitles['facebook-story']}\n\nSwipe up to learn about:\n${keywords.slice(0, 2).map(k => `→ ${k}`).join('\n')}\n\n👆 Tap to discover more!`,
    };

    return {
        title: mockTitles[contentType],
        content: mockContent[contentType],
        excerpt: `Learn about ${topic} with focus on ${keywords.slice(0, 2).join(' and ')}.`,
        seoScore: Math.floor(Math.random() * 20) + 75, // 75-95
        language: params.language || 'en',
        metadata: {
            topicPillar: topic,
            keywords,
            hashtags: keywords.map(k => `#${k.replace(/\s+/g, '')}`),
            estimatedReadTime: contentType === 'blog' ? Math.ceil(mockContent[contentType].split(' ').length / 200) : undefined,
            wordCount: mockContent[contentType].split(' ').length,
        },
    };
}

/**
 * Build prompt for AI models
 */
function buildPrompt(params: GenerateContentParams): string {
    const { topic, keywords, contentType, targetAudience, tone = 'professional', length = 'medium', language = 'en' } = params;

    const contentSpecs = {
        blog: 'a well-structured blog post with introduction, main points, and conclusion',
        'youtube-short': 'a YouTube Short script (under 60 seconds, engaging hook, clear value)',
        'instagram-reel': 'an Instagram Reel caption with emojis, hashtags, and call-to-action',
        'facebook-story': 'a Facebook Story text with swipe-up prompt and engaging visuals description',
    };

    // Get language info for the prompt
    const langInfo = CONTENT_LANGUAGES[language];
    const languageInstruction = language !== 'en'
        ? `\n\nIMPORTANT: Write the ENTIRE content in ${langInfo.name} (${langInfo.nativeName}). All text, headings, and hashtags must be in ${langInfo.name}. Do not write in English.`
        : '';

    return `Create ${contentSpecs[contentType]} about "${topic}" for ${targetAudience}.${languageInstruction}

REQUIREMENTS:
- Tone: ${tone}
- Length: ${length}
- Keywords to include naturally: ${keywords.join(', ')}
- SEO-optimized with E-E-A-T principles
- Include AI disclosure in ${langInfo.name}: "Generated with AI assistance and reviewed by human editors for E-E-A-T compliance."

${contentType === 'blog' ? 'Format in Markdown with proper headings.' : ''}
${contentType !== 'blog' ? `Include 5-7 relevant hashtags (from: ${keywords.map(k => '#' + k.replace(/\s+/g, '')).join(', ')})` : ''}

Generate ONLY the content in ${langInfo.name}, no explanations.`;
}

/**
 * Parse AI-generated text into structured format
 */
function parseGeneratedContent(text: string, params: GenerateContentParams): GeneratedContent {
    // Extract title (first heading or first line)
    const titleMatch = text.match(/^#\s+(.+)$/m) || text.match(/^(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : `${params.topic} - ${params.contentType}`;

    // Extract hashtags if present
    const hashtagMatches = text.match(/#[\w]+/g) || [];
    const hashtags = hashtagMatches.slice(0, 10);

    // Calculate word count
    const wordCount = text.split(/\s+/).length;

    // Generate SEO score (simplified - in production, use real SEO analysis)
    const hasKeywords = params.keywords.some(k => text.toLowerCase().includes(k.toLowerCase()));
    const hasGoodLength = wordCount > 100 && wordCount < 3000;
    const hasHashtags = hashtags.length > 0;
    const seoScore = (hasKeywords ? 40 : 0) + (hasGoodLength ? 40 : 0) + (hasHashtags ? 20 : 0);

    return {
        title: title.replace(/^#+\s*/, '').trim(),
        content: text.trim(),
        excerpt: text.split('\n').find(line => line.length > 50)?.substring(0, 150) + '...' || title,
        seoScore: Math.min(95, Math.max(60, seoScore)),
        language: params.language || 'en',
        metadata: {
            topicPillar: params.topic,
            keywords: params.keywords,
            hashtags: hashtags.length > 0 ? hashtags : undefined,
            estimatedReadTime: params.contentType === 'blog' ? Math.ceil(wordCount / 200) : undefined,
            wordCount,
        },
    };
}

/**
 * Main content generation function - auto-selects best available provider
 */
export async function generateContent(params: GenerateContentParams, provider?: AIProvider): Promise<GeneratedContent> {
    const selectedProvider = provider || getAvailableProvider();

    console.log(`Generating content with provider: ${selectedProvider}`);

    try {
        switch (selectedProvider) {
            case 'bedrock':
                return await generateWithBedrock(params);
            case 'openai':
                return await generateWithOpenAI(params);
            case 'anthropic':
                return await generateWithAnthropic(params);
            case 'mock':
            default:
                return generateMockContent(params);
        }
    } catch (error) {
        console.error(`Error with ${selectedProvider}, falling back to mock:`, error);
        return generateMockContent(params);
    }
}

/**
 * Batch generate multiple content pieces
 */
export async function generateBatchContent(
    topics: { topic: string; keywords: string[] }[],
    contentType: GenerateContentParams['contentType'],
    targetAudience: string
): Promise<GeneratedContent[]> {
    const results: GeneratedContent[] = [];

    for (const { topic, keywords } of topics) {
        const content = await generateContent({
            topic,
            keywords,
            contentType,
            targetAudience,
        });
        results.push(content);
    }

    return results;
}
