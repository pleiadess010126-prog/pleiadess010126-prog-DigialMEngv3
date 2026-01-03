/**
 * Advanced GEO (Generative Engine Optimization) Scoring Module
 * 
 * This module provides sophisticated scoring for content optimized for AI search engines
 * like ChatGPT, Perplexity, Google SGE, and other generative AI systems.
 * 
 * GEO differs from traditional SEO by focusing on:
 * - Direct, concise answers that AI can extract
 * - Authoritative citations and data
 * - Structured content for easy parsing
 * - Conversational flow for natural AI responses
 * - Semantic completeness for comprehensive answers
 */

export interface GEOBreakdown {
    directness: number;      // 0-100: How directly the content answers the query
    authority: number;       // 0-100: Citations, data, expert references
    structure: number;       // 0-100: Formatting for AI parsing
    conversational: number;  // 0-100: Natural dialogue flow
    freshness: number;       // 0-100: Timeliness signals
    snippetOptimization: number; // 0-100: Featured snippet readiness
    semanticRichness: number;    // 0-100: Entity and concept density
    readability: number;     // 0-100: Ease of comprehension
}

export interface GEOAnalysis {
    score: number;           // Overall GEO score (0-100)
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
    breakdown: GEOBreakdown;
    recommendations: string[];
    strengths: string[];
    keyInsights: {
        wordCount: number;
        sentenceCount: number;
        avgWordsPerSentence: number;
        questionCount: number;
        citationCount: number;
        listItemCount: number;
        headingCount: number;
    };
}

// Weights for each metric (must sum to 1.0)
const METRIC_WEIGHTS: Record<keyof GEOBreakdown, number> = {
    directness: 0.20,
    authority: 0.15,
    structure: 0.15,
    conversational: 0.10,
    freshness: 0.10,
    snippetOptimization: 0.15,
    semanticRichness: 0.10,
    readability: 0.05,
};

// Fluff words and phrases that reduce directness
const FLUFF_PATTERNS = [
    /\bin order to\b/gi,
    /\bas a matter of fact\b/gi,
    /\bit goes without saying\b/gi,
    /\bneedless to say\b/gi,
    /\bat the end of the day\b/gi,
    /\ball things considered\b/gi,
    /\bfor all intents and purposes\b/gi,
    /\bin this day and age\b/gi,
    /\bbasically\b/gi,
    /\bactually\b/gi,
    /\bliterally\b/gi,
    /\breally\b/gi,
    /\bjust\b/gi,
    /\bvery\b/gi,
    /\bquite\b/gi,
    /\bsimply\b/gi,
];

// Authority signal patterns
const AUTHORITY_PATTERNS = {
    citations: [
        /according to/gi,
        /research (shows|indicates|suggests|demonstrates)/gi,
        /studies (show|indicate|suggest|demonstrate|found)/gi,
        /data (shows|indicates|suggests|reveals)/gi,
        /experts (say|suggest|recommend|believe)/gi,
        /\[\d+\]/g,  // Reference brackets like [1]
        /\(source:?\s*[^)]+\)/gi,
        /\bcited\b/gi,
    ],
    statistics: [
        /\d+(\.\d+)?%/g,  // Percentages
        /\$[\d,]+(\.\d+)?/g,  // Dollar amounts
        /\d+(\.\d+)?\s*(million|billion|trillion)/gi,
        /\d+x\s*(more|less|faster|slower)/gi,
        /\d+\s*out of\s*\d+/gi,
    ],
    expertise: [
        /\bPhD\b/g,
        /\bDr\.\s/g,
        /\bProfessor\b/gi,
        /\bexpert\b/gi,
        /\bspecialist\b/gi,
        /\bindustry leader\b/gi,
        /\bauthority\b/gi,
    ],
};

// Structure patterns
const STRUCTURE_PATTERNS = {
    headings: /^#{1,6}\s+.+$/gm,
    bulletPoints: /^[\s]*[-*•]\s+.+$/gm,
    numberedLists: /^[\s]*\d+[.)]\s+.+$/gm,
    boldText: /\*\*[^*]+\*\*/g,
    italicText: /\*[^*]+\*/g,
    codeBlocks: /```[\s\S]*?```/g,
    tables: /\|[\s\S]*?\|/g,
    blockquotes: /^>\s+.+$/gm,
};

// Conversational patterns
const CONVERSATIONAL_PATTERNS = {
    secondPerson: /\b(you|your|you're|you'll|you've|yourself)\b/gi,
    questions: /[^.!?]*\?/g,
    transitions: [
        /\bhowever\b/gi,
        /\bmoreover\b/gi,
        /\bfurthermore\b/gi,
        /\bin addition\b/gi,
        /\bfor example\b/gi,
        /\bfor instance\b/gi,
        /\bthat said\b/gi,
        /\bon the other hand\b/gi,
        /\bas a result\b/gi,
        /\btherefore\b/gi,
        /\bconsequently\b/gi,
        /\bin conclusion\b/gi,
        /\bto summarize\b/gi,
        /\blet's\b/gi,
        /\bhere's\b/gi,
    ],
    directAddress: [
        /\bimagine\b/gi,
        /\bconsider\b/gi,
        /\bthink about\b/gi,
        /\bnotice\b/gi,
        /\bremember\b/gi,
    ],
};

// Freshness signals
const FRESHNESS_PATTERNS = {
    timeReferences: [
        /\b(2024|2025|2026)\b/g,
        /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}\b/gi,
        /\brecently\b/gi,
        /\blatest\b/gi,
        /\bupdated\b/gi,
        /\bnew\b/gi,
        /\bcurrent\b/gi,
        /\bthis (year|month|week)\b/gi,
        /\bas of\b/gi,
    ],
    versionNumbers: /v?\d+\.\d+(\.\d+)?/g,
};

// Snippet optimization patterns
const SNIPPET_PATTERNS = {
    definitions: /^[A-Z][^.]*\s+(is|are|was|were|refers to|means|describes)\s+[^.]+\./gm,
    howTo: /^(how to|step \d|first,|next,|then,|finally,)/gim,
    lists: /^(\d+\.|[-*•])\s+/gm,
    faqs: /^(what|why|how|when|where|who|which|can|do|does|is|are|should|would|could)\s+[^?]+\?/gim,
};

/**
 * Count pattern matches in text
 */
function countMatches(text: string, pattern: RegExp): number {
    const matches = text.match(pattern);
    return matches ? matches.length : 0;
}

/**
 * Count matches for multiple patterns
 */
function countMultiplePatterns(text: string, patterns: RegExp[]): number {
    return patterns.reduce((total, pattern) => total + countMatches(text, pattern), 0);
}

/**
 * Calculate directness score
 */
function calculateDirectness(text: string): { score: number; insights: string[] } {
    const insights: string[] = [];
    let score = 50; // Base score

    // Check first paragraph/sentence length
    const firstParagraph = text.split('\n\n')[0] || text.split('\n')[0] || '';
    const firstSentence = firstParagraph.split(/[.!?]/)[0] || '';

    // Reward concise opening (under 150 chars is ideal)
    if (firstSentence.length < 100) {
        score += 20;
        insights.push('✓ Concise opening sentence');
    } else if (firstSentence.length < 150) {
        score += 10;
    } else {
        insights.push('→ Consider shortening the opening sentence');
    }

    // Check for direct answer patterns
    const directAnswerPatterns = [
        /^(the answer is|yes,|no,|simply put|in short|to answer|the solution is)/i,
        /^[A-Z][^.]*\s+(is|are|means|refers to|equals)/i,
    ];

    if (directAnswerPatterns.some(p => p.test(firstParagraph))) {
        score += 15;
        insights.push('✓ Direct answer in opening');
    }

    // Penalize fluff words
    const fluffCount = FLUFF_PATTERNS.reduce((count, pattern) =>
        count + countMatches(text, pattern), 0);
    const wordCount = text.split(/\s+/).length;
    const fluffRatio = fluffCount / wordCount;

    if (fluffRatio < 0.02) {
        score += 15;
        insights.push('✓ Low fluff word density');
    } else if (fluffRatio > 0.05) {
        score -= 15;
        insights.push('→ Reduce filler words (found ' + fluffCount + ')');
    }

    return { score: Math.max(0, Math.min(100, score)), insights };
}

/**
 * Calculate authority score
 */
function calculateAuthority(text: string): { score: number; insights: string[]; citationCount: number } {
    const insights: string[] = [];
    let score = 30; // Base score

    // Check for citations
    const citationCount = countMultiplePatterns(text, AUTHORITY_PATTERNS.citations);
    if (citationCount >= 3) {
        score += 25;
        insights.push('✓ Multiple citations (' + citationCount + ')');
    } else if (citationCount >= 1) {
        score += 15;
        insights.push('✓ Includes citations');
    } else {
        insights.push('→ Add authoritative citations');
    }

    // Check for statistics
    const statsCount = countMultiplePatterns(text, AUTHORITY_PATTERNS.statistics);
    if (statsCount >= 2) {
        score += 20;
        insights.push('✓ Data-driven with statistics');
    } else if (statsCount === 1) {
        score += 10;
    } else {
        insights.push('→ Include relevant statistics');
    }

    // Check for expertise signals
    const expertCount = countMultiplePatterns(text, AUTHORITY_PATTERNS.expertise);
    if (expertCount >= 1) {
        score += 15;
        insights.push('✓ Expert references included');
    }

    // Check for AI disclosure (E-E-A-T compliance)
    if (/ai assistance|ai-generated|reviewed by|human editors/i.test(text)) {
        score += 10;
        insights.push('✓ AI disclosure present');
    }

    return { score: Math.max(0, Math.min(100, score)), insights, citationCount };
}

/**
 * Calculate structure score
 */
function calculateStructure(text: string): { score: number; insights: string[]; listItems: number; headings: number } {
    const insights: string[] = [];
    let score = 20; // Base score

    // Check for headings
    const headingCount = countMatches(text, STRUCTURE_PATTERNS.headings);
    if (headingCount >= 3) {
        score += 20;
        insights.push('✓ Well-organized with headings (' + headingCount + ')');
    } else if (headingCount >= 1) {
        score += 10;
    } else {
        insights.push('→ Add section headings');
    }

    // Check for lists
    const bulletCount = countMatches(text, STRUCTURE_PATTERNS.bulletPoints);
    const numberedCount = countMatches(text, STRUCTURE_PATTERNS.numberedLists);
    const totalLists = bulletCount + numberedCount;

    if (totalLists >= 5) {
        score += 25;
        insights.push('✓ Excellent use of lists');
    } else if (totalLists >= 2) {
        score += 15;
        insights.push('✓ Includes structured lists');
    } else {
        insights.push('→ Add bullet points or numbered lists');
    }

    // Check for bold/emphasis
    const boldCount = countMatches(text, STRUCTURE_PATTERNS.boldText);
    if (boldCount >= 3) {
        score += 15;
        insights.push('✓ Key terms emphasized');
    } else if (boldCount >= 1) {
        score += 8;
    }

    // Check for blockquotes or code
    if (STRUCTURE_PATTERNS.blockquotes.test(text) || STRUCTURE_PATTERNS.codeBlocks.test(text)) {
        score += 10;
        insights.push('✓ Rich formatting elements');
    }

    // Bonus for tables
    if (STRUCTURE_PATTERNS.tables.test(text)) {
        score += 10;
        insights.push('✓ Includes structured tables');
    }

    return {
        score: Math.max(0, Math.min(100, score)),
        insights,
        listItems: totalLists,
        headings: headingCount
    };
}

/**
 * Calculate conversational score
 */
function calculateConversational(text: string): { score: number; insights: string[]; questionCount: number } {
    const insights: string[] = [];
    let score = 40; // Base score

    // Check for second person pronouns
    const youCount = countMatches(text, CONVERSATIONAL_PATTERNS.secondPerson);
    const wordCount = text.split(/\s+/).length;
    const youRatio = youCount / wordCount;

    if (youRatio > 0.02) {
        score += 20;
        insights.push('✓ Engaging second-person voice');
    } else if (youRatio > 0.01) {
        score += 10;
    } else {
        insights.push('→ Use more "you" to engage readers');
    }

    // Check for questions
    const questionCount = countMatches(text, CONVERSATIONAL_PATTERNS.questions);
    if (questionCount >= 2) {
        score += 15;
        insights.push('✓ Interactive with questions');
    } else if (questionCount === 1) {
        score += 8;
    }

    // Check for transitions
    const transitionCount = countMultiplePatterns(text, CONVERSATIONAL_PATTERNS.transitions);
    if (transitionCount >= 3) {
        score += 15;
        insights.push('✓ Smooth transitions');
    } else if (transitionCount >= 1) {
        score += 8;
    }

    // Check for direct address
    const directAddressCount = countMultiplePatterns(text, CONVERSATIONAL_PATTERNS.directAddress);
    if (directAddressCount >= 1) {
        score += 10;
        insights.push('✓ Engages reader directly');
    }

    return { score: Math.max(0, Math.min(100, score)), insights, questionCount };
}

/**
 * Calculate freshness score
 */
function calculateFreshness(text: string): { score: number; insights: string[] } {
    const insights: string[] = [];
    let score = 50; // Base score

    // Check for time references
    const timeRefCount = countMultiplePatterns(text, FRESHNESS_PATTERNS.timeReferences);
    if (timeRefCount >= 2) {
        score += 30;
        insights.push('✓ Multiple freshness signals');
    } else if (timeRefCount >= 1) {
        score += 15;
        insights.push('✓ Includes time reference');
    } else {
        insights.push('→ Add timeliness context (dates, "latest", "updated")');
    }

    // Check for version numbers (tech content)
    const versionCount = countMatches(text, FRESHNESS_PATTERNS.versionNumbers);
    if (versionCount >= 1) {
        score += 20;
        insights.push('✓ Includes version references');
    }

    return { score: Math.max(0, Math.min(100, score)), insights };
}

/**
 * Calculate snippet optimization score
 */
function calculateSnippetOptimization(text: string): { score: number; insights: string[] } {
    const insights: string[] = [];
    let score = 30; // Base score

    // Check for definition format
    if (SNIPPET_PATTERNS.definitions.test(text)) {
        score += 25;
        insights.push('✓ Contains clear definitions');
    }

    // Check for how-to format
    const howToCount = countMatches(text, SNIPPET_PATTERNS.howTo);
    if (howToCount >= 3) {
        score += 25;
        insights.push('✓ Step-by-step format');
    } else if (howToCount >= 1) {
        score += 15;
    }

    // Check for FAQ format
    const faqCount = countMatches(text, SNIPPET_PATTERNS.faqs);
    if (faqCount >= 2) {
        score += 20;
        insights.push('✓ FAQ-style content');
    }

    // Check content length for snippet suitability
    const firstParagraph = text.split('\n\n')[0] || '';
    const firstParaWords = firstParagraph.split(/\s+/).length;

    if (firstParaWords >= 40 && firstParaWords <= 60) {
        score += 15;
        insights.push('✓ Optimal snippet length');
    } else if (firstParaWords > 100) {
        insights.push('→ Shorten first paragraph for snippets');
    }

    return { score: Math.max(0, Math.min(100, score)), insights };
}

/**
 * Calculate semantic richness score
 */
function calculateSemanticRichness(text: string): { score: number; insights: string[] } {
    const insights: string[] = [];
    let score = 40; // Base score

    // Check for proper nouns (simplified - checks capitalized words)
    const properNounMatches = text.match(/\b[A-Z][a-z]+\b/g) || [];
    const uniqueProperNouns = new Set(properNounMatches).size;

    if (uniqueProperNouns >= 5) {
        score += 25;
        insights.push('✓ Rich in entities and names');
    } else if (uniqueProperNouns >= 2) {
        score += 15;
    }

    // Check vocabulary diversity (unique words / total words)
    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    const uniqueWords = new Set(words);
    const diversityRatio = words.length > 0 ? uniqueWords.size / words.length : 0;

    if (diversityRatio > 0.5) {
        score += 20;
        insights.push('✓ Diverse vocabulary');
    } else if (diversityRatio > 0.4) {
        score += 10;
    } else {
        insights.push('→ Vary word choices');
    }

    // Check for technical/domain terms (simplified - long words)
    const technicalWords = words.filter(w => w.length > 10);
    if (technicalWords.length >= 5) {
        score += 15;
        insights.push('✓ Domain-specific terminology');
    }

    return { score: Math.max(0, Math.min(100, score)), insights };
}

/**
 * Calculate readability score (simplified Flesch-like)
 */
function calculateReadability(text: string): { score: number; insights: string[]; avgWordsPerSentence: number; sentenceCount: number } {
    const insights: string[] = [];

    // Count sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;

    // Count words
    const words = text.match(/\b\w+\b/g) || [];
    const wordCount = words.length;

    // Average words per sentence
    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;

    // Average syllables per word (simplified estimation)
    const avgSyllables = words.reduce((sum, word) => {
        // Simple syllable count: vowel groups
        const syllables = word.toLowerCase().match(/[aeiouy]+/g)?.length || 1;
        return sum + syllables;
    }, 0) / (wordCount || 1);

    // Simplified Flesch Reading Ease calculation
    // Higher score = easier to read
    const flesch = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllables);

    // Convert to 0-100 scale
    let score = Math.max(0, Math.min(100, flesch));

    if (score >= 60) {
        insights.push('✓ Excellent readability');
    } else if (score >= 40) {
        insights.push('✓ Good readability');
    } else {
        insights.push('→ Simplify sentence structure');
    }

    if (avgWordsPerSentence > 25) {
        insights.push('→ Shorten sentences (avg: ' + avgWordsPerSentence.toFixed(1) + ' words)');
    } else if (avgWordsPerSentence < 10) {
        insights.push('→ Vary sentence length');
    }

    return { score, insights, avgWordsPerSentence, sentenceCount };
}

/**
 * Get grade from score
 */
function getGrade(score: number): GEOAnalysis['grade'] {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
}

/**
 * Main GEO analysis function
 */
export function analyzeGEO(text: string): GEOAnalysis {
    // Calculate all metrics
    const directness = calculateDirectness(text);
    const authority = calculateAuthority(text);
    const structure = calculateStructure(text);
    const conversational = calculateConversational(text);
    const freshness = calculateFreshness(text);
    const snippetOptimization = calculateSnippetOptimization(text);
    const semanticRichness = calculateSemanticRichness(text);
    const readability = calculateReadability(text);

    // Build breakdown
    const breakdown: GEOBreakdown = {
        directness: directness.score,
        authority: authority.score,
        structure: structure.score,
        conversational: conversational.score,
        freshness: freshness.score,
        snippetOptimization: snippetOptimization.score,
        semanticRichness: semanticRichness.score,
        readability: readability.score,
    };

    // Calculate weighted score
    const weightedScore = Object.entries(breakdown).reduce((total, [key, value]) => {
        return total + (value * METRIC_WEIGHTS[key as keyof GEOBreakdown]);
    }, 0);

    const finalScore = Math.round(weightedScore);

    // Collect all insights
    const allInsights = [
        ...directness.insights,
        ...authority.insights,
        ...structure.insights,
        ...conversational.insights,
        ...freshness.insights,
        ...snippetOptimization.insights,
        ...semanticRichness.insights,
        ...readability.insights,
    ];

    // Separate strengths and recommendations
    const strengths = allInsights.filter(i => i.startsWith('✓'));
    const recommendations = allInsights.filter(i => i.startsWith('→'));

    // Calculate key insights
    const words = text.match(/\b\w+\b/g) || [];

    return {
        score: finalScore,
        grade: getGrade(finalScore),
        breakdown,
        recommendations,
        strengths,
        keyInsights: {
            wordCount: words.length,
            sentenceCount: readability.sentenceCount,
            avgWordsPerSentence: Math.round(readability.avgWordsPerSentence * 10) / 10,
            questionCount: conversational.questionCount,
            citationCount: authority.citationCount,
            listItemCount: structure.listItems,
            headingCount: structure.headings,
        },
    };
}

/**
 * Quick GEO score calculation (for performance-critical scenarios)
 */
export function quickGEOScore(text: string): { score: number; breakdown: GEOBreakdown } {
    const analysis = analyzeGEO(text);
    return {
        score: analysis.score,
        breakdown: analysis.breakdown,
    };
}

/**
 * Get GEO optimization suggestions for a specific content type
 */
export function getContentTypeOptimizations(contentType: 'blog' | 'youtube-short' | 'instagram-reel' | 'facebook-story'): string[] {
    const suggestions: Record<typeof contentType, string[]> = {
        'blog': [
            'Start with a direct answer in the first sentence',
            'Include at least 3 authoritative citations',
            'Use H2/H3 headings every 200-300 words',
            'Add a summary/TL;DR section',
            'Include a FAQ section for common questions',
            'End with a clear call-to-action',
        ],
        'youtube-short': [
            'Open with a hook question or statement',
            'State the main point within first 3 seconds',
            'Use numbered steps (1, 2, 3)',
            'Include on-screen text for key points',
            'End with a memorable takeaway',
        ],
        'instagram-reel': [
            'Start with attention-grabbing first line',
            'Use bullet points for key information',
            'Include relevant hashtags (5-10)',
            'Add a clear call-to-action',
            'Keep captions scannable',
        ],
        'facebook-story': [
            'Lead with the most important information',
            'Use simple, conversational language',
            'Include a question to drive engagement',
            'Add link/swipe-up prompt',
            'Keep it under 125 words for optimal engagement',
        ],
    };

    return suggestions[contentType];
}
