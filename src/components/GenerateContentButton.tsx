'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface GenerateContentButtonProps {
    topic: string;
    keywords: string[];
    contentType: 'blog' | 'youtube-short' | 'instagram-reel' | 'facebook-story';
    onContentGenerated?: (content: any) => void;
}

export default function GenerateContentButton({
    topic,
    keywords,
    contentType,
    onContentGenerated,
}: GenerateContentButtonProps) {
    const [loading, setLoading] = useState(false);
    const [enableGEO, setEnableGEO] = useState(true);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    keywords,
                    contentType,
                    targetAudience: 'digital marketers and content creators',
                    useSupervisor: true,
                    enableGEO,
                }),
            });

            const data = await response.json();

            if (data.success) {
                console.log('Content generated:', data.content);
                onContentGenerated?.(data.content);
            } else {
                setError(data.error || 'Generation failed');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to generate content');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
                <input
                    type="checkbox"
                    id="enable-geo"
                    checked={enableGEO}
                    onChange={(e) => setEnableGEO(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="enable-geo" className="text-xs font-semibold text-slate-600 flex items-center gap-1 cursor-pointer">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Enable GEO Optimization
                </label>
            </div>

            <button
                onClick={handleGenerate}
                disabled={loading}
                className={`btn-sm flex items-center gap-2 shadow-sm ${enableGEO
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4" />
                        Generate with AI
                    </>
                )}
            </button>

            {error && (
                <p className="text-xs text-destructive mt-1">{error}</p>
            )}
        </div>
    );
}
