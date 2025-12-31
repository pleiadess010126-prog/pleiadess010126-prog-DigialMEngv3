// AI Music Generation & Royalty-Free Music Service
// Integrates with Mubert API for AI-generated music and provides royalty-free options

export interface MusicConfig {
    provider: 'mubert' | 'royalty-free' | 'mock';
    apiKey?: string;
}

export interface MusicTrack {
    id: string;
    name: string;
    url: string;
    duration: number; // seconds
    genre: string;
    mood: string;
    bpm?: number;
    preview?: string;
}

export interface MusicGenerationParams {
    duration: number;      // Target duration in seconds
    mood: 'upbeat' | 'calm' | 'energetic' | 'dramatic' | 'inspirational' | 'corporate';
    genre?: 'electronic' | 'ambient' | 'pop' | 'cinematic' | 'acoustic' | 'lofi';
    intensity?: 'low' | 'medium' | 'high';
}

// Pre-defined royalty-free music library (using public domain / CC0 sources)
const ROYALTY_FREE_LIBRARY: MusicTrack[] = [
    {
        id: 'rf-upbeat-1',
        name: 'Uplifting Corporate',
        url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
        duration: 120,
        genre: 'corporate',
        mood: 'upbeat',
        bpm: 120,
    },
    {
        id: 'rf-calm-1',
        name: 'Peaceful Ambient',
        url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
        duration: 180,
        genre: 'ambient',
        mood: 'calm',
        bpm: 80,
    },
    {
        id: 'rf-energetic-1',
        name: 'Energy Boost',
        url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_946e9a7b57.mp3',
        duration: 90,
        genre: 'electronic',
        mood: 'energetic',
        bpm: 140,
    },
    {
        id: 'rf-inspirational-1',
        name: 'Inspiring Journey',
        url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3',
        duration: 150,
        genre: 'cinematic',
        mood: 'inspirational',
        bpm: 100,
    },
    {
        id: 'rf-dramatic-1',
        name: 'Epic Cinematic',
        url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
        duration: 200,
        genre: 'cinematic',
        mood: 'dramatic',
        bpm: 90,
    },
    {
        id: 'rf-lofi-1',
        name: 'Chill Lo-Fi Beat',
        url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_166b9c7242.mp3',
        duration: 120,
        genre: 'lofi',
        mood: 'calm',
        bpm: 85,
    },
    {
        id: 'rf-corporate-1',
        name: 'Business Presentation',
        url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_8cb749d484.mp3',
        duration: 180,
        genre: 'corporate',
        mood: 'corporate',
        bpm: 110,
    },
    {
        id: 'rf-acoustic-1',
        name: 'Acoustic Sunshine',
        url: 'https://cdn.pixabay.com/download/audio/2022/08/25/audio_4f3b0a8791.mp3',
        duration: 140,
        genre: 'acoustic',
        mood: 'upbeat',
        bpm: 95,
    },
];

/**
 * Music Generation Service
 */
export class MusicService {
    private config: MusicConfig;

    constructor(config: MusicConfig) {
        this.config = config;
    }

    /**
     * Generate or select music based on parameters
     */
    async getMusic(params: MusicGenerationParams): Promise<MusicTrack> {
        switch (this.config.provider) {
            case 'mubert':
                return this.generateWithMubert(params);
            case 'royalty-free':
                return this.selectFromLibrary(params);
            case 'mock':
            default:
                return this.getMockTrack(params);
        }
    }

    /**
     * Generate AI music with Mubert
     */
    private async generateWithMubert(params: MusicGenerationParams): Promise<MusicTrack> {
        if (!this.config.apiKey) {
            console.warn('Mubert API key not configured, falling back to royalty-free');
            return this.selectFromLibrary(params);
        }

        try {
            // Mubert API for AI music generation
            const response = await fetch('https://api-b2b.mubert.com/v2/RecordTrack', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    method: 'RecordTrack',
                    params: {
                        pat: this.config.apiKey,
                        duration: params.duration,
                        tags: [params.mood, params.genre || 'electronic'],
                        intensity: params.intensity || 'medium',
                        format: 'mp3',
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Mubert API request failed');
            }

            const data = await response.json();

            if (data.status === 1 && data.data?.task_id) {
                // Poll for completion
                const track = await this.pollMubertTask(data.data.task_id);
                return track;
            }

            throw new Error('Mubert generation failed');
        } catch (error) {
            console.error('Mubert generation error:', error);
            return this.selectFromLibrary(params);
        }
    }

    /**
     * Poll Mubert task for completion
     */
    private async pollMubertTask(taskId: string, maxAttempts: number = 30): Promise<MusicTrack> {
        for (let i = 0; i < maxAttempts; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await fetch('https://api-b2b.mubert.com/v2/TrackStatus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    method: 'TrackStatus',
                    params: {
                        pat: this.config.apiKey,
                        task_id: taskId,
                    },
                }),
            });

            const data = await response.json();

            if (data.status === 1 && data.data?.download_link) {
                return {
                    id: `mubert-${taskId}`,
                    name: 'AI Generated Track',
                    url: data.data.download_link,
                    duration: data.data.duration || 60,
                    genre: 'ai-generated',
                    mood: 'custom',
                };
            }

            if (data.status === 2) {
                throw new Error('Mubert task failed');
            }
        }

        throw new Error('Mubert task timeout');
    }

    /**
     * Select from royalty-free library
     */
    private selectFromLibrary(params: MusicGenerationParams): MusicTrack {
        // Filter by mood
        let candidates = ROYALTY_FREE_LIBRARY.filter(
            track => track.mood === params.mood || track.mood === 'corporate'
        );

        // Filter by genre if specified
        if (params.genre) {
            const genreMatches = candidates.filter(track => track.genre === params.genre);
            if (genreMatches.length > 0) {
                candidates = genreMatches;
            }
        }

        // Filter by duration (select tracks close to target)
        candidates.sort((a, b) =>
            Math.abs(a.duration - params.duration) - Math.abs(b.duration - params.duration)
        );

        // Return best match or first available
        return candidates[0] || ROYALTY_FREE_LIBRARY[0];
    }

    /**
     * Get mock track for testing
     */
    private getMockTrack(params: MusicGenerationParams): MusicTrack {
        return {
            id: `mock-${Date.now()}`,
            name: `Mock ${params.mood} Track`,
            url: 'https://example.com/mock-audio.mp3',
            duration: params.duration,
            genre: params.genre || 'electronic',
            mood: params.mood,
            bpm: 120,
        };
    }

    /**
     * Get all available tracks from library
     */
    getLibrary(): MusicTrack[] {
        return ROYALTY_FREE_LIBRARY;
    }

    /**
     * Get tracks filtered by mood
     */
    getTracksByMood(mood: string): MusicTrack[] {
        return ROYALTY_FREE_LIBRARY.filter(track => track.mood === mood);
    }

    /**
     * Get track by ID
     */
    getTrackById(id: string): MusicTrack | undefined {
        return ROYALTY_FREE_LIBRARY.find(track => track.id === id);
    }
}

/**
 * Create music service instance
 */
export function createMusicService(config: MusicConfig): MusicService {
    return new MusicService(config);
}

// Export the library for direct access
export { ROYALTY_FREE_LIBRARY };

// Mood presets for different content types
export const MUSIC_PRESETS = {
    'youtube-short': {
        mood: 'energetic' as const,
        genre: 'electronic' as const,
        intensity: 'high' as const,
    },
    'instagram-reel': {
        mood: 'upbeat' as const,
        genre: 'pop' as const,
        intensity: 'medium' as const,
    },
    'tiktok': {
        mood: 'energetic' as const,
        genre: 'electronic' as const,
        intensity: 'high' as const,
    },
    'corporate': {
        mood: 'corporate' as const,
        genre: 'corporate' as const,
        intensity: 'low' as const,
    },
    'tutorial': {
        mood: 'calm' as const,
        genre: 'ambient' as const,
        intensity: 'low' as const,
    },
    'podcast-intro': {
        mood: 'inspirational' as const,
        genre: 'cinematic' as const,
        intensity: 'medium' as const,
    },
};
