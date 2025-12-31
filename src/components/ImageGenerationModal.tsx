'use client';

import React, { useState } from 'react';
import {
    Image as ImageIcon,
    Sparkles,
    Download,
    RefreshCw,
    X,
    Loader2,
    Wand2,
    Copy,
    Check,
    Layers,
    Palette,
    Layout,
} from 'lucide-react';

interface ImageGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectImage?: (imageUrl: string) => void;
    initialPrompt?: string;
}

const STYLES = [
    { id: 'realistic', name: 'Realistic', icon: '📷', desc: 'Photorealistic' },
    { id: 'illustration', name: 'Illustration', icon: '🎨', desc: 'Digital art' },
    { id: 'cartoon', name: 'Cartoon', icon: '🎬', desc: 'Fun & colorful' },
    { id: '3d', name: '3D Render', icon: '🧊', desc: 'Cinema 4D style' },
    { id: 'minimalist', name: 'Minimalist', icon: '⬜', desc: 'Clean & simple' },
    { id: 'abstract', name: 'Abstract', icon: '🌀', desc: 'Creative art' },
];

const SIZES = [
    { id: '1024x1024', name: 'Square', icon: '⬜', ratio: '1:1', desc: 'Instagram, Profile' },
    { id: '1792x1024', name: 'Landscape', icon: '🖼️', ratio: '16:9', desc: 'YouTube, Blog' },
    { id: '1024x1792', name: 'Portrait', icon: '📱', ratio: '9:16', desc: 'Stories, Reels' },
];

const TEMPLATES = [
    { id: 'social', name: 'Social Post', prompt: 'Eye-catching social media graphic about' },
    { id: 'thumbnail', name: 'YouTube Thumbnail', prompt: 'Click-worthy YouTube thumbnail for' },
    { id: 'blog-header', name: 'Blog Header', prompt: 'Professional blog header image about' },
    { id: 'product', name: 'Product Shot', prompt: 'Product photography showcase of' },
    { id: 'quote', name: 'Quote Card', prompt: 'Inspirational quote card design with text' },
    { id: 'infographic', name: 'Infographic', prompt: 'Infographic style illustration about' },
];

interface GeneratedImage {
    id: string;
    url: string;
    prompt: string;
}

export default function ImageGenerationModal({
    isOpen,
    onClose,
    onSelectImage,
    initialPrompt = '',
}: ImageGenerationModalProps) {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [selectedStyle, setSelectedStyle] = useState('illustration');
    const [selectedSize, setSelectedSize] = useState('1024x1024');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setError(null);

        try {
            // In production, this calls the actual API
            // For demo, we'll use placeholder images
            const response = await fetch('/api/ai/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    style: selectedStyle,
                    size: selectedSize,
                    count: 4,
                }),
            });

            if (!response.ok) {
                // Fallback to mock images for demo
                console.warn('API not available, using demo images');
                await simulateGeneration();
                return;
            }

            const data = await response.json();
            setGeneratedImages(data.images);
        } catch (err) {
            // Use mock images for demo
            await simulateGeneration();
        } finally {
            setIsGenerating(false);
        }
    };

    const simulateGeneration = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockImages: GeneratedImage[] = Array.from({ length: 4 }, (_, i) => ({
            id: `mock-${Date.now()}-${i}`,
            url: `https://picsum.photos/seed/${Date.now() + i}/512/512`,
            prompt: prompt,
        }));

        setGeneratedImages(mockImages);
    };

    const handleCopyUrl = async (imageId: string, url: string) => {
        await navigator.clipboard.writeText(url);
        setCopiedId(imageId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    const handleUseImage = (imageUrl: string) => {
        if (onSelectImage) {
            onSelectImage(imageUrl);
            onClose();
        }
    };

    const handleTemplateClick = (template: typeof TEMPLATES[0]) => {
        setPrompt(template.prompt + ' ');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl">
                            <Wand2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">AI Image Generator</h2>
                            <p className="text-white/60 text-sm">Create stunning images with AI</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-white/60" />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row max-h-[calc(90vh-140px)]">
                    {/* Left Panel - Controls */}
                    <div className="lg:w-2/5 p-6 border-r border-white/10 overflow-y-auto">
                        {/* Prompt */}
                        <div className="mb-6">
                            <label className="text-white font-medium mb-2 flex items-center gap-2 text-sm">
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                Describe Your Image
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="A futuristic city at sunset with flying cars..."
                                className="w-full h-28 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 resize-none focus:outline-none focus:border-purple-500/50"
                            />
                        </div>

                        {/* Quick Templates */}
                        <div className="mb-6">
                            <label className="text-white/70 text-xs font-medium mb-2 block">Quick Templates</label>
                            <div className="flex flex-wrap gap-2">
                                {TEMPLATES.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => handleTemplateClick(template)}
                                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 text-xs transition-colors"
                                    >
                                        {template.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Style Selection */}
                        <div className="mb-6">
                            <label className="text-white font-medium mb-3 flex items-center gap-2 text-sm">
                                <Palette className="w-4 h-4 text-cyan-400" />
                                Style
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {STYLES.map((style) => (
                                    <button
                                        key={style.id}
                                        onClick={() => setSelectedStyle(style.id)}
                                        className={`p-3 rounded-xl border transition-all text-center ${selectedStyle === style.id
                                                ? 'bg-purple-500/20 border-purple-500'
                                                : 'bg-white/5 border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <div className="text-xl mb-1">{style.icon}</div>
                                        <p className="text-white text-xs font-medium">{style.name}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="mb-6">
                            <label className="text-white font-medium mb-3 flex items-center gap-2 text-sm">
                                <Layout className="w-4 h-4 text-green-400" />
                                Size
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {SIZES.map((size) => (
                                    <button
                                        key={size.id}
                                        onClick={() => setSelectedSize(size.id)}
                                        className={`p-3 rounded-xl border transition-all text-center ${selectedSize === size.id
                                                ? 'bg-purple-500/20 border-purple-500'
                                                : 'bg-white/5 border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <div className="text-lg mb-1">{size.icon}</div>
                                        <p className="text-white text-xs font-medium">{size.name}</p>
                                        <p className="text-white/50 text-[10px]">{size.ratio}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={!prompt.trim() || isGenerating}
                            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Generate Images
                                </>
                            )}
                        </button>

                        <p className="text-white/40 text-xs text-center mt-3">
                            ~$0.04 per image • Uses DALL-E / Stable Diffusion
                        </p>
                    </div>

                    {/* Right Panel - Results */}
                    <div className="lg:w-3/5 p-6 overflow-y-auto bg-black/20">
                        {isGenerating ? (
                            <div className="flex flex-col items-center justify-center h-full py-16">
                                <div className="w-24 h-24 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-6" />
                                <h3 className="text-white font-semibold mb-2">Creating Your Images...</h3>
                                <p className="text-white/60 text-sm text-center">
                                    Our AI is generating unique images based on your prompt
                                </p>
                            </div>
                        ) : generatedImages.length > 0 ? (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white font-semibold flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-purple-400" />
                                        Generated Images
                                    </h3>
                                    <button
                                        onClick={handleGenerate}
                                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Regenerate
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {generatedImages.map((image) => (
                                        <div
                                            key={image.id}
                                            className={`relative group rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${selectedImage === image.id
                                                    ? 'border-purple-500 ring-2 ring-purple-500/30'
                                                    : 'border-transparent hover:border-white/30'
                                                }`}
                                            onClick={() => setSelectedImage(image.id)}
                                        >
                                            <img
                                                src={image.url}
                                                alt={image.prompt}
                                                className="w-full aspect-square object-cover"
                                            />

                                            {/* Overlay Actions */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDownload(image.url, `image-${image.id}.png`);
                                                            }}
                                                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                                            title="Download"
                                                        >
                                                            <Download className="w-4 h-4 text-white" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCopyUrl(image.id, image.url);
                                                            }}
                                                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                                            title="Copy URL"
                                                        >
                                                            {copiedId === image.id ? (
                                                                <Check className="w-4 h-4 text-green-400" />
                                                            ) : (
                                                                <Copy className="w-4 h-4 text-white" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    {onSelectImage && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleUseImage(image.url);
                                                            }}
                                                            className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium rounded-lg transition-colors"
                                                        >
                                                            Use Image
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Selected Checkmark */}
                                            {selectedImage === image.id && (
                                                <div className="absolute top-3 right-3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                                    <Check className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-6">
                                    <ImageIcon className="w-10 h-10 text-purple-400" />
                                </div>
                                <h3 className="text-white font-semibold mb-2">No Images Yet</h3>
                                <p className="text-white/60 text-sm max-w-xs">
                                    Describe what you want to create and click Generate to see AI-generated images
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
