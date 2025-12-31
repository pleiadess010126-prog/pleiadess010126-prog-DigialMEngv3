// Multi-Language Translation Service - Phase 5E

export type SupportedLanguage =
    | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'nl' | 'ru' | 'zh' | 'ja'
    | 'ko' | 'ar' | 'hi' | 'tr' | 'vi' | 'th' | 'id' | 'pl' | 'sv' | 'he';

export interface LanguageInfo {
    code: SupportedLanguage;
    name: string;
    nativeName: string;
    rtl: boolean;
}

export interface TranslationConfig {
    provider: 'openai' | 'deepl' | 'google';
    apiKey: string;
    preserveSEO?: boolean;
}

export interface TranslatedContent {
    language: SupportedLanguage;
    title: string;
    content: string;
    keywords?: string[];
    metadata: {
        originalLanguage: SupportedLanguage;
        translatedAt: Date;
        provider: string;
    };
}

export const LANGUAGES: Record<SupportedLanguage, LanguageInfo> = {
    en: { code: 'en', name: 'English', nativeName: 'English', rtl: false },
    es: { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false },
    fr: { code: 'fr', name: 'French', nativeName: 'Français', rtl: false },
    de: { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false },
    it: { code: 'it', name: 'Italian', nativeName: 'Italiano', rtl: false },
    pt: { code: 'pt', name: 'Portuguese', nativeName: 'Português', rtl: false },
    nl: { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', rtl: false },
    ru: { code: 'ru', name: 'Russian', nativeName: 'Русский', rtl: false },
    zh: { code: 'zh', name: 'Chinese', nativeName: '中文', rtl: false },
    ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false },
    ko: { code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false },
    ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
    hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', rtl: false },
    tr: { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', rtl: false },
    vi: { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', rtl: false },
    th: { code: 'th', name: 'Thai', nativeName: 'ไทย', rtl: false },
    id: { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', rtl: false },
    pl: { code: 'pl', name: 'Polish', nativeName: 'Polski', rtl: false },
    sv: { code: 'sv', name: 'Swedish', nativeName: 'Svenska', rtl: false },
    he: { code: 'he', name: 'Hebrew', nativeName: 'עברית', rtl: true },
};

export class TranslationService {
    private config: TranslationConfig;

    constructor(config: TranslationConfig) {
        this.config = config;
    }

    async translate(content: string, targetLang: SupportedLanguage, sourceLang: SupportedLanguage = 'en'): Promise<string> {
        if (this.config.provider === 'openai') {
            return this.translateWithOpenAI(content, targetLang, sourceLang);
        }
        if (this.config.provider === 'deepl') {
            return this.translateWithDeepL(content, targetLang);
        }
        return this.translateWithGoogle(content, targetLang);
    }

    private async translateWithOpenAI(content: string, targetLang: SupportedLanguage, sourceLang: SupportedLanguage): Promise<string> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.config.apiKey}` },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: `Translate from ${LANGUAGES[sourceLang].name} to ${LANGUAGES[targetLang].name}. Maintain tone and formatting.` },
                    { role: 'user', content }
                ],
                temperature: 0.3,
            }),
        });
        const data = await response.json();
        return data.choices[0].message.content;
    }

    private async translateWithDeepL(content: string, targetLang: SupportedLanguage): Promise<string> {
        const response = await fetch('https://api-free.deepl.com/v2/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `DeepL-Auth-Key ${this.config.apiKey}` },
            body: new URLSearchParams({ text: content, target_lang: targetLang.toUpperCase() }),
        });
        const data = await response.json();
        return data.translations[0].text;
    }

    private async translateWithGoogle(content: string, targetLang: SupportedLanguage): Promise<string> {
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${this.config.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: content, target: targetLang, format: 'html' }),
        });
        const data = await response.json();
        return data.data.translations[0].translatedText;
    }

    async translateContent(content: { title: string; content: string; keywords?: string[] }, targetLang: SupportedLanguage): Promise<TranslatedContent> {
        const [title, body] = await Promise.all([
            this.translate(content.title, targetLang),
            this.translate(content.content, targetLang),
        ]);
        const keywords = content.keywords ? await Promise.all(content.keywords.map(k => this.translate(k, targetLang))) : undefined;

        return { language: targetLang, title, content: body, keywords, metadata: { originalLanguage: 'en', translatedAt: new Date(), provider: this.config.provider } };
    }

    async translateToMultiple(content: { title: string; content: string }, targetLangs: SupportedLanguage[]): Promise<TranslatedContent[]> {
        return Promise.all(targetLangs.map(lang => this.translateContent(content, lang)));
    }
}

export function createTranslationService(config: TranslationConfig): TranslationService {
    return new TranslationService(config);
}

export function getSupportedLanguages(): LanguageInfo[] {
    return Object.values(LANGUAGES);
}
