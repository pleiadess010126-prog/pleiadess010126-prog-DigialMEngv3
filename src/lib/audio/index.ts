// Audio Services Index
// Exports all audio-related services for voice over and music generation

export {
    MusicService,
    createMusicService,
    ROYALTY_FREE_LIBRARY,
    MUSIC_PRESETS,
    type MusicConfig,
    type MusicTrack,
    type MusicGenerationParams,
} from './musicService';

export {
    VoiceOverService,
    createVoiceOverService,
    ELEVENLABS_VOICES,
    GOOGLE_VOICES,
    POLLY_VOICES,
    ALL_VOICES,
    type VoiceConfig,
    type Voice,
    type VoiceOverParams,
    type VoiceOverResult,
} from './voiceOverService';
