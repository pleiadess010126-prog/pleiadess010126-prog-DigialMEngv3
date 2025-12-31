// API Route: AI Image Generation
// Endpoint: POST /api/ai/generate-image

import { NextRequest, NextResponse } from 'next/server';

// In production, use environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { prompt, style, size, count = 1 } = body;

        // Validate request
        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // Style enhancers
        const stylePrompts: Record<string, string> = {
            realistic: ', photorealistic, high detail, professional photography, 8k',
            illustration: ', digital illustration, vibrant colors, artistic, vector art style',
            cartoon: ', cartoon style, colorful, fun, animated look, friendly',
            '3d': ', 3D render, octane render, realistic lighting, depth, cinema 4d',
            minimalist: ', minimalist design, clean, simple, modern, white space',
            abstract: ', abstract art, geometric shapes, modern art, creative composition',
        };

        const enhancedPrompt = `${prompt}${stylePrompts[style] || ''}`;

        // Check if API key is configured
        if (!OPENAI_API_KEY) {
            console.warn('OpenAI API key not configured, returning demo images');
            return generateDemoImages(prompt, size, count);
        }

        // Call OpenAI DALL-E API
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: enhancedPrompt,
                n: Math.min(count, 4), // DALL-E 3 supports max 1 per request
                size: size || '1024x1024',
                quality: 'standard',
                response_format: 'url',
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('OpenAI API error:', error);

            // Fallback to demo images
            return generateDemoImages(prompt, size, count);
        }

        const data = await response.json();

        const images = data.data.map((img: any, index: number) => ({
            id: `openai-${Date.now()}-${index}`,
            url: img.url,
            prompt: prompt,
            revisedPrompt: img.revised_prompt,
            size: size || '1024x1024',
            createdAt: new Date().toISOString(),
        }));

        return NextResponse.json({
            success: true,
            images,
            creditsUsed: images.length,
        });
    } catch (error) {
        console.error('Image generation error:', error);

        // Fallback to demo images
        return generateDemoImages('demo', '1024x1024', 4);
    }
}

// Generate demo/placeholder images when API is not available
function generateDemoImages(prompt: string, size: string = '1024x1024', count: number = 4) {
    const [width, height] = size.split('x').map(n => Math.min(parseInt(n), 800));

    const images = Array.from({ length: count }, (_, i) => ({
        id: `demo-${Date.now()}-${i}`,
        url: `https://picsum.photos/seed/${Date.now() + i}/${width}/${height}`,
        prompt: prompt,
        size: size,
        createdAt: new Date().toISOString(),
    }));

    return NextResponse.json({
        success: true,
        images,
        creditsUsed: 0, // Demo doesn't use credits
        demo: true,
    });
}
