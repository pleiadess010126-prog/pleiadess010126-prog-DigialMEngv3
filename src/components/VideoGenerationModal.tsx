'use client';

import React, { useState, useEffect } from 'react';
import {
    Video, Sparkles, Mic, Image, Play, Loader2,
    Download, Share2, X, Settings, Volume2, Film,
    Music, PlayCircle, StopCircle, Check, AlertCircle
} from 'lucide-react';
import { ROYALTY_FREE_LIBRARY, type MusicTrack } from '@/lib/audio/musicService';
import { ELEVENLABS_VOICES, type Voice } from '@/lib/audio/voiceOverService';

interface VideoGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    content?: {
        title: string;
        content: string;
    };
}

const PRESENTERS = [
    { id: 'amy', name: 'Amy', style: 'Professional', image: '👩‍💼' },
    { id: 'mike', name: 'Mike', style: 'Casual', image: '👨' },
    { id: 'sarah', name: 'Sarah', style: 'Energetic', image: '👩' },
    { id: 'alex', name: 'Alex', style: 'Expert', image: '🧑‍🏫' },
];

const VIDEO_FORMATS = [
    { id: 'vertical', name: 'Vertical (9:16)', desc: 'TikTok, Reels, Shorts', icon: '📱' },
    { id: 'horizontal', name: 'Horizontal (16:9)', desc: 'YouTube, Website', icon: '🖥️' },
    { id: 'square', name: 'Square (1:1)', desc: 'Instagram Feed', icon: '⬜' },
];

export default function VideoGenerationModal({ isOpen, onClose, content }: VideoGenerationModalProps) {
    const [step, setStep] = useState<'config' | 'generating' | 'preview'>('config');
    const [selectedPresenter, setSelectedPresenter] = useState(PRESENTERS[0].id);
    const [selectedVoice, setSelectedVoice] = useState<string>(ELEVENLABS_VOICES[0].id);
    const [selectedFormat, setSelectedFormat] = useState(VIDEO_FORMATS[0].id);
    const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
    const [script, setScript] = useState(content?.content?.substring(0, 500) || '');
    const [progress, setProgress] = useState(0);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [playingPreview, setPlayingPreview] = useState<string | null>(null);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
    const [addCaptions, setAddCaptions] = useState(true);
    const [musicVolume, setMusicVolume] = useState(30);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioElement) {
                audioElement.pause();
                audioElement.src = '';
            }
        };
    }, [audioElement]);

    const handlePlayPreview = (trackId: string, url: string) => {
        if (playingPreview === trackId) {
            // Stop playing
            if (audioElement) {
                audioElement.pause();
            }
            setPlayingPreview(null);
        } else {
            // Start playing
            if (audioElement) {
                audioElement.pause();
            }
            const audio = new Audio(url);
            audio.volume = 0.5;
            audio.play().catch(console.error);
            audio.onended = () => setPlayingPreview(null);
            setAudioElement(audio);
            setPlayingPreview(trackId);
        }
    };

    const handleGenerate = async () => {
        setStep('generating');
        setProgress(0);

        // Simulate video generation with voice over and music
        const stages = [
            { progress: 15, message: 'Analyzing script...' },
            { progress: 35, message: 'Generating AI voiceover...' },
            { progress: 55, message: 'Creating avatar animation...' },
            { progress: 70, message: 'Adding background music...' },
            { progress: 85, message: 'Rendering video...' },
            { progress: 100, message: 'Finalizing...' },
        ];

        for (const stage of stages) {
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
            setProgress(stage.progress);
        }

        setStep('preview');
        setGeneratedVideoUrl('https://example.com/generated-video.mp4');
    };

    const getProgressMessage = () => {
        if (progress < 20) return 'Analyzing script...';
        if (progress < 40) return 'Generating AI voiceover with ElevenLabs...';
        if (progress < 60) return 'Creating avatar animation with D-ID...';
        if (progress < 75) return 'Mixing background music...';
        if (progress < 90) return 'Rendering video...';
        return 'Finalizing...';
    };

    const estimatedDuration = Math.ceil(script.split(' ').length / 2.5);
    const selectedMusicTrack = ROYALTY_FREE_LIBRARY.find(t => t.id === selectedMusic);
    const selectedVoiceData = ELEVENLABS_VOICES.find(v => v.id === selectedVoice);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card w-full max-w-5xl max-h-[90vh] overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                            <Video className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">AI Video Generator</h2>
                            <p className="text-white/60 text-sm">Create professional videos with AI voiceover & music</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-white/60" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] custom-scrollbar">
                    {step === 'config' && (
                        <div className="space-y-6">
                            {/* Script */}
                            <div>
                                <label className="text-white font-medium mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                    Video Script
                                </label>
                                <textarea
                                    value={script}
                                    onChange={(e) => setScript(e.target.value)}
                                    className="textarea w-full h-32"
                                    placeholder="Enter your video script or paste content to convert..."
                                />
                                <p className="text-white/40 text-xs mt-1">
                                    {script.split(' ').filter(w => w).length} words • ~{estimatedDuration} seconds
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Format Selection */}
                                    <div>
                                        <label className="text-white font-medium mb-3 flex items-center gap-2">
                                            <Film className="w-4 h-4 text-blue-400" />
                                            Video Format
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {VIDEO_FORMATS.map(format => (
                                                <button
                                                    key={format.id}
                                                    onClick={() => setSelectedFormat(format.id)}
                                                    className={`p-4 rounded-lg border transition-all ${selectedFormat === format.id
                                                        ? 'bg-purple-500/20 border-purple-500'
                                                        : 'bg-white/5 border-white/10 hover:border-white/30'
                                                        }`}
                                                >
                                                    <div className="text-2xl mb-2">{format.icon}</div>
                                                    <p className="text-white text-sm font-medium">{format.name}</p>
                                                    <p className="text-white/50 text-xs">{format.desc}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Presenter Selection */}
                                    <div>
                                        <label className="text-white font-medium mb-3 flex items-center gap-2">
                                            <Image className="w-4 h-4 text-green-400" />
                                            AI Presenter
                                        </label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {PRESENTERS.map(presenter => (
                                                <button
                                                    key={presenter.id}
                                                    onClick={() => setSelectedPresenter(presenter.id)}
                                                    className={`p-4 rounded-lg border transition-all ${selectedPresenter === presenter.id
                                                        ? 'bg-purple-500/20 border-purple-500'
                                                        : 'bg-white/5 border-white/10 hover:border-white/30'
                                                        }`}
                                                >
                                                    <div className="text-3xl mb-2">{presenter.image}</div>
                                                    <p className="text-white text-sm font-medium">{presenter.name}</p>
                                                    <p className="text-white/50 text-xs">{presenter.style}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Voice Selection - Now using real ElevenLabs voices */}
                                    <div>
                                        <label className="text-white font-medium mb-3 flex items-center gap-2">
                                            <Mic className="w-4 h-4 text-pink-400" />
                                            AI Voice (ElevenLabs)
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                                            {ELEVENLABS_VOICES.map(voice => (
                                                <button
                                                    key={voice.id}
                                                    onClick={() => setSelectedVoice(voice.id)}
                                                    className={`p-3 rounded-lg border transition-all flex items-center gap-3 ${selectedVoice === voice.id
                                                        ? 'bg-purple-500/20 border-purple-500'
                                                        : 'bg-white/5 border-white/10 hover:border-white/30'
                                                        }`}
                                                >
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${voice.gender === 'female' ? 'bg-pink-500/20' : 'bg-blue-500/20'
                                                        }`}>
                                                        <Volume2 className={`w-4 h-4 ${voice.gender === 'female' ? 'text-pink-400' : 'text-blue-400'
                                                            }`} />
                                                    </div>
                                                    <div className="text-left flex-1">
                                                        <p className="text-white text-sm font-medium">{voice.name}</p>
                                                        <p className="text-white/50 text-xs">{voice.accent} • {voice.gender}</p>
                                                    </div>
                                                    {selectedVoice === voice.id && (
                                                        <Check className="w-4 h-4 text-purple-400" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Background Music - Now using real royalty-free library */}
                                    <div>
                                        <label className="text-white font-medium mb-3 flex items-center gap-2">
                                            <Music className="w-4 h-4 text-cyan-400" />
                                            Background Music
                                        </label>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                            <button
                                                onClick={() => setSelectedMusic(null)}
                                                className={`w-full p-3 rounded-lg border transition-all flex items-center gap-3 ${selectedMusic === null
                                                        ? 'bg-purple-500/20 border-purple-500'
                                                        : 'bg-white/5 border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-slate-600/50 flex items-center justify-center">
                                                    <X className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <span className="text-white text-sm">No Music</span>
                                            </button>
                                            {ROYALTY_FREE_LIBRARY.map(track => (
                                                <div
                                                    key={track.id}
                                                    className={`p-3 rounded-lg border transition-all flex items-center gap-3 ${selectedMusic === track.id
                                                            ? 'bg-purple-500/20 border-purple-500'
                                                            : 'bg-white/5 border-white/10 hover:border-white/30'
                                                        }`}
                                                >
                                                    <button
                                                        onClick={() => handlePlayPreview(track.id, track.url)}
                                                        className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center hover:bg-cyan-500/30 transition-colors"
                                                    >
                                                        {playingPreview === track.id ? (
                                                            <StopCircle className="w-4 h-4 text-cyan-400" />
                                                        ) : (
                                                            <PlayCircle className="w-4 h-4 text-cyan-400" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedMusic(track.id)}
                                                        className="flex-1 text-left"
                                                    >
                                                        <p className="text-white text-sm font-medium">{track.name}</p>
                                                        <p className="text-white/50 text-xs">{track.mood} • {track.duration}s</p>
                                                    </button>
                                                    {selectedMusic === track.id && (
                                                        <Check className="w-4 h-4 text-purple-400" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        {selectedMusic && (
                                            <div className="mt-3 p-3 bg-white/5 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-white/60 text-xs">Music Volume</span>
                                                    <span className="text-white text-xs font-medium">{musicVolume}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={musicVolume}
                                                    onChange={(e) => setMusicVolume(Number(e.target.value))}
                                                    className="w-full accent-purple-500"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Settings */}
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={addCaptions}
                                            onChange={(e) => setAddCaptions(e.target.checked)}
                                            className="w-4 h-4 accent-purple-500"
                                        />
                                        <span className="text-white/80 text-sm">Add Captions</span>
                                    </label>
                                    <div className="h-4 w-px bg-white/20" />
                                    <div className="flex items-center gap-2 text-white/60 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>Uses: ElevenLabs TTS + D-ID Avatar + Royalty-Free Music</span>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                                <h4 className="text-white font-medium mb-2">Generation Summary</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p className="text-white/50">Format</p>
                                        <p className="text-white">{VIDEO_FORMATS.find(f => f.id === selectedFormat)?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/50">Voice</p>
                                        <p className="text-white">{selectedVoiceData?.name} ({selectedVoiceData?.accent})</p>
                                    </div>
                                    <div>
                                        <p className="text-white/50">Music</p>
                                        <p className="text-white">{selectedMusicTrack?.name || 'None'}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/50">Duration</p>
                                        <p className="text-white">~{estimatedDuration} seconds</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'generating' && (
                        <div className="py-12 text-center">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Loader2 className="w-10 h-10 text-white animate-spin" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Generating Your Video</h3>
                            <p className="text-white/60 mb-6">{getProgressMessage()}</p>
                            <div className="max-w-md mx-auto">
                                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                                <p className="text-white/40 text-sm mt-2">{Math.round(progress)}% complete</p>
                            </div>
                            <div className="mt-8 p-4 bg-white/5 rounded-xl max-w-md mx-auto">
                                <p className="text-white/50 text-xs">
                                    🎤 Voice: {selectedVoiceData?.name} •
                                    🎵 Music: {selectedMusicTrack?.name || 'None'} •
                                    📹 Format: {VIDEO_FORMATS.find(f => f.id === selectedFormat)?.name}
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 'preview' && (
                        <div className="space-y-6">
                            <div className="aspect-video bg-black rounded-lg overflow-hidden relative group">
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-pink-900/50">
                                    <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors">
                                        <Play className="w-8 h-8 text-white ml-1" />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex-1 h-1 bg-white/20 rounded-full">
                                        <div className="w-1/3 h-full bg-white rounded-full" />
                                    </div>
                                    <span className="text-white/80 text-xs">0:00 / 0:{estimatedDuration.toString().padStart(2, '0')}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div>
                                    <h4 className="text-white font-medium">Video Ready!</h4>
                                    <p className="text-white/60 text-sm">
                                        {VIDEO_FORMATS.find(f => f.id === selectedFormat)?.name} • {estimatedDuration} seconds • 1080p
                                    </p>
                                    <p className="text-white/40 text-xs mt-1">
                                        Voice: {selectedVoiceData?.name} | Music: {selectedMusicTrack?.name || 'None'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                    <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                                        <Share2 className="w-4 h-4" />
                                        Publish
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step === 'config' && (
                    <div className="p-6 border-t border-white/10 flex items-center justify-between">
                        <div className="text-white/60 text-sm">
                            Estimated cost: <span className="text-white font-medium">$0.{Math.max(10, estimatedDuration * 2)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={onClose} className="px-4 py-2 border border-white/20 text-white/80 rounded-lg hover:bg-white/5 transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={!script.trim()}
                                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                Generate Video
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

