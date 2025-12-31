// AI Image Generation Service
// Integrates with OpenAI DALL-E, Stability AI, and provides fallback options

export interface ImageGenerationConfig {
    provider: 'openai' | 'stability' | 'replicate' | 'mock';
    apiKey?: string;
}

export interface GenerateImageParams {
    prompt: string;
    style?: 'realistic' | 'illustration' | 'cartoon' | '3d' | 'minimalist' | 'abstract';
    size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
    aspectRatio?: 'square' | 'landscape' | 'portrait';
    quality?: 'standard' | 'hd';
    count?: number; // Number of images to generate (1-4)
}

export interface GeneratedImage {
    id: string;
    url: string;
    prompt: string;
    revisedPrompt?: string;
    size: string;
    createdAt: Date;
}

export interface ImageGenerationResult {
    success: boolean;
    images?: GeneratedImage[];
    error?: string;
    creditsUsed?: number;
}

// Style prompt enhancers
const STYLE_PROMPTS: Record<string, string> = {
    realistic: ', photorealistic, high detail, professional photography, 8k',
    illustration: ', digital illustration, vibrant colors, artistic, vector art style',
    cartoon: ', cartoon style, colorful, fun, animated look, friendly',
    '3d': ', 3D render, octane render, realistic lighting, depth, cinema 4d',
    minimalist: ', minimalist design, clean, simple, modern, white space',
    abstract: ', abstract art, geometric shapes, modern art, creative composition',
};

// Content type presets
export const IMAGE_PRESETS = {
    'social-post': {
        size: '1024x1024' as const,
        style: 'illustration' as const,
        promptEnhancer: 'eye-catching social media graphic, shareable, engaging',
    },
    'youtube-thumbnail': {
        size: '1792x1024' as const,
        style: 'realistic' as const,
        promptEnhancer: 'YouTube thumbnail, bold text space, dramatic, click-worthy',
    },
    'instagram-story': {
        size: '1024x1792' as const,
        style: 'illustration' as const,
        promptEnhancer: 'Instagram story format, vertical, trendy, aesthetic',
    },
    'blog-header': {
        size: '1792x1024' as const,
        style: 'minimalist' as const,
        promptEnhancer: 'blog header image, professional, clean design',
    },
    'product-shot': {
        size: '1024x1024' as const,
        style: '3d' as const,
        promptEnhancer: 'product photography, studio lighting, professional',
    },
    'infographic': {
        size: '1024x1792' as const,
        style: 'minimalist' as const,
        promptEnhancer: 'infographic style, data visualization, clean layout',
    },
};

/**
 * AI Image Generation Service
 */
export class ImageGenerationService {
    private config: ImageGenerationConfig;

    constructor(config: ImageGenerationConfig) {
        this.config = config;
    }

    /**
     * Generate images from a text prompt
     */
    async generateImage(params: GenerateImageParams): Promise<ImageGenerationResult> {
        const enhancedPrompt = this.enhancePrompt(params.prompt, params.style);

        switch (this.config.provider) {
            case 'openai':
                return this.generateWithOpenAI(enhancedPrompt, params);
            case 'stability':
                return this.generateWithStability(enhancedPrompt, params);
            case 'replicate':
                return this.generateWithReplicate(enhancedPrompt, params);
            case 'mock':
            default:
                return this.generateMockImage(enhancedPrompt, params);
        }
    }

    /**
     * Enhance prompt with style modifiers
     */
    private enhancePrompt(prompt: string, style?: string): string {
        const styleEnhancer = style ? STYLE_PROMPTS[style] || '' : '';
        return `${prompt}${styleEnhancer}`;
    }

    /**
     * Generate with OpenAI DALL-E
     */
    private async generateWithOpenAI(prompt: string, params: GenerateImageParams): Promise<ImageGenerationResult> {
        if (!this.config.apiKey) {
            console.warn('OpenAI API key not configured, using mock');
            return this.generateMockImage(prompt, params);
        }

        try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`,
                },
                body: JSON.stringify({
                    model: 'dall-e-3',
                    prompt: prompt,
                    n: params.count || 1,
                    size: params.size || '1024x1024',
                    quality: params.quality || 'standard',
                    response_format: 'url',
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'OpenAI API error');
            }

            const data = await response.json();

            const images: GeneratedImage[] = data.data.map((img: any, index: number) => ({
                id: `openai-${Date.now()}-${index}`,
                url: img.url,
                prompt: prompt,
                revisedPrompt: img.revised_prompt,
                size: params.size || '1024x1024',
                createdAt: new Date(),
            }));

            return {
                success: true,
                images,
                creditsUsed: images.length,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to generate image',
            };
        }
    }

    /**
     * Generate with Stability AI
     */
    private async generateWithStability(prompt: string, params: GenerateImageParams): Promise<ImageGenerationResult> {
        if (!this.config.apiKey) {
            return this.generateMockImage(prompt, params);
        }

        try {
            const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    text_prompts: [{ text: prompt, weight: 1 }],
                    cfg_scale: 7,
                    height: 1024,
                    width: 1024,
                    samples: params.count || 1,
                    steps: 30,
                }),
            });

            if (!response.ok) {
                throw new Error('Stability AI API error');
            }

            const data = await response.json();

            const images: GeneratedImage[] = data.artifacts.map((artifact: any, index: number) => ({
                id: `stability-${Date.now()}-${index}`,
                url: `data:image/png;base64,${artifact.base64}`,
                prompt: prompt,
                size: '1024x1024',
                createdAt: new Date(),
            }));

            return {
                success: true,
                images,
                creditsUsed: images.length,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to generate image',
            };
        }
    }

    /**
     * Generate with Replicate (Flux, SDXL, etc.)
     */
    private async generateWithReplicate(prompt: string, params: GenerateImageParams): Promise<ImageGenerationResult> {
        if (!this.config.apiKey) {
            return this.generateMockImage(prompt, params);
        }

        try {
            // Start prediction
            const response = await fetch('https://api.replicate.com/v1/predictions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${this.config.apiKey}`,
                },
                body: JSON.stringify({
                    version: 'black-forest-labs/flux-schnell', // Fast model
                    input: {
                        prompt: prompt,
                        num_outputs: params.count || 1,
                        aspect_ratio: params.aspectRatio === 'portrait' ? '9:16' :
                            params.aspectRatio === 'landscape' ? '16:9' : '1:1',
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Replicate API error');
            }

            const prediction = await response.json();

            // Poll for completion
            let result = prediction;
            while (result.status !== 'succeeded' && result.status !== 'failed') {
                await new Promise(r => setTimeout(r, 1000));
                const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
                    headers: { 'Authorization': `Token ${this.config.apiKey}` },
                });
                result = await statusResponse.json();
            }

            if (result.status === 'failed') {
                throw new Error(result.error || 'Image generation failed');
            }

            const images: GeneratedImage[] = result.output.map((url: string, index: number) => ({
                id: `replicate-${Date.now()}-${index}`,
                url: url,
                prompt: prompt,
                size: params.size || '1024x1024',
                createdAt: new Date(),
            }));

            return {
                success: true,
                images,
                creditsUsed: images.length,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to generate image',
            };
        }
    }

    /**
     * Generate mock images for testing
     */
    private async generateMockImage(prompt: string, params: GenerateImageParams): Promise<ImageGenerationResult> {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay

        const count = params.count || 1;
        const images: GeneratedImage[] = [];

        for (let i = 0; i < count; i++) {
            const size = params.size || '1024x1024';
            const [width, height] = size.split('x');
            const encodedPrompt = encodeURIComponent(prompt.substring(0, 50));

            images.push({
                id: `mock-${Date.now()}-${i}`,
                url: `https://picsum.photos/${width}/${height}?random=${Date.now() + i}`,
                prompt: prompt,
                size: size,
                createdAt: new Date(),
            });
        }

        return {
            success: true,
            images,
            creditsUsed: count,
        };
    }

    /**
     * Generate image from content context
     */
    async generateFromContent(content: {
        title: string;
        description?: string;
        keywords?: string[];
        platform?: string;
    }): Promise<ImageGenerationResult> {
        // Build a smart prompt from content
        const parts = [content.title];

        if (content.keywords?.length) {
            parts.push(content.keywords.slice(0, 3).join(', '));
        }

        const preset = content.platform ?
            IMAGE_PRESETS[content.platform as keyof typeof IMAGE_PRESETS] :
            IMAGE_PRESETS['social-post'];

        const prompt = `${parts.join('. ')}. ${preset.promptEnhancer}`;

        return this.generateImage({
            prompt,
            style: preset.style,
            size: preset.size,
        });
    }
}

/**
 * Create image generation service instance
 */
export function createImageService(config: ImageGenerationConfig): ImageGenerationService {
    return new ImageGenerationService(config);
}

/**
 * Prompt templates for common use cases
 */
export const PROMPT_TEMPLATES = {
    'social-announcement': (topic: string) =>
        `Exciting social media announcement graphic about ${topic}, modern design, bold colors, attention-grabbing`,

    'quote-card': (quote: string) =>
        `Inspirational quote card design with text space for "${quote}", elegant, shareable, aesthetic background`,

    'how-to-guide': (topic: string) =>
        `Step-by-step guide illustration about ${topic}, educational, clear icons, infographic style`,

    'product-feature': (product: string, feature: string) =>
        `Product showcase highlighting ${feature} of ${product}, professional, modern, clean background`,

    'testimonial': (name: string) =>
        `Customer testimonial design with space for quote from ${name}, trustworthy, professional, warm colors`,

    'blog-hero': (topic: string) =>
        `Blog hero image about ${topic}, professional photography style, modern, editorial`,

    'event-promo': (event: string) =>
        `Event promotion graphic for ${event}, exciting, dynamic, event details layout`,

    'before-after': (topic: string) =>
        `Before and after comparison graphic for ${topic}, split screen, dramatic transformation`,
};
