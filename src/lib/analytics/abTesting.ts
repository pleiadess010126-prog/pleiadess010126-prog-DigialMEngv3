// A/B Testing Framework - Phase 5D
// Content optimization through split testing

export interface ABTest {
    id: string;
    name: string;
    status: 'draft' | 'running' | 'completed' | 'paused';
    contentId: string;
    variants: TestVariant[];
    trafficSplit: number[];  // e.g., [50, 50] for 50/50 split
    metrics: TestMetrics;
    startDate: Date;
    endDate?: Date;
    winner?: string;
    confidence?: number;
}

export interface TestVariant {
    id: string;
    name: string;  // e.g., 'Control', 'Variant A'
    changes: {
        title?: string;
        thumbnail?: string;
        headline?: string;
        cta?: string;
        postingTime?: string;
    };
    metrics: VariantMetrics;
}

export interface TestMetrics {
    primaryMetric: 'clicks' | 'engagement' | 'conversions' | 'watchTime';
    minimumSampleSize: number;
    currentSampleSize: number;
    significanceLevel: number;  // e.g., 0.95 for 95% confidence
}

export interface VariantMetrics {
    impressions: number;
    clicks: number;
    engagement: number;
    conversions: number;
    ctr: number;
    engagementRate: number;
    conversionRate: number;
}

export interface ABTestResult {
    testId: string;
    winner: string;
    improvement: number;  // Percentage improvement
    confidence: number;
    recommendation: string;
}

export class ABTestingService {
    private tests: Map<string, ABTest> = new Map();

    createTest(config: {
        name: string;
        contentId: string;
        variants: Omit<TestVariant, 'metrics'>[];
        primaryMetric: TestMetrics['primaryMetric'];
        trafficSplit?: number[];
    }): ABTest {
        const id = `test-${Date.now()}`;
        const variantCount = config.variants.length;

        const test: ABTest = {
            id,
            name: config.name,
            status: 'draft',
            contentId: config.contentId,
            variants: config.variants.map(v => ({
                ...v,
                metrics: { impressions: 0, clicks: 0, engagement: 0, conversions: 0, ctr: 0, engagementRate: 0, conversionRate: 0 },
            })),
            trafficSplit: config.trafficSplit || Array(variantCount).fill(100 / variantCount),
            metrics: {
                primaryMetric: config.primaryMetric,
                minimumSampleSize: 1000,
                currentSampleSize: 0,
                significanceLevel: 0.95,
            },
            startDate: new Date(),
        };

        this.tests.set(id, test);
        return test;
    }

    startTest(testId: string): ABTest {
        const test = this.tests.get(testId);
        if (!test) throw new Error('Test not found');

        test.status = 'running';
        test.startDate = new Date();
        return test;
    }

    recordEvent(testId: string, variantId: string, event: 'impression' | 'click' | 'engagement' | 'conversion'): void {
        const test = this.tests.get(testId);
        if (!test || test.status !== 'running') return;

        const variant = test.variants.find(v => v.id === variantId);
        if (!variant) return;

        switch (event) {
            case 'impression':
                variant.metrics.impressions++;
                break;
            case 'click':
                variant.metrics.clicks++;
                break;
            case 'engagement':
                variant.metrics.engagement++;
                break;
            case 'conversion':
                variant.metrics.conversions++;
                break;
        }

        // Update rates
        variant.metrics.ctr = variant.metrics.impressions > 0 ? (variant.metrics.clicks / variant.metrics.impressions) * 100 : 0;
        variant.metrics.engagementRate = variant.metrics.impressions > 0 ? (variant.metrics.engagement / variant.metrics.impressions) * 100 : 0;
        variant.metrics.conversionRate = variant.metrics.clicks > 0 ? (variant.metrics.conversions / variant.metrics.clicks) * 100 : 0;

        test.metrics.currentSampleSize = test.variants.reduce((sum, v) => sum + v.metrics.impressions, 0);

        // Auto-complete if sufficient data
        if (test.metrics.currentSampleSize >= test.metrics.minimumSampleSize) {
            this.checkForWinner(testId);
        }
    }

    selectVariant(testId: string): string | null {
        const test = this.tests.get(testId);
        if (!test || test.status !== 'running') return null;

        // Weighted random selection based on traffic split
        const random = Math.random() * 100;
        let cumulative = 0;

        for (let i = 0; i < test.variants.length; i++) {
            cumulative += test.trafficSplit[i];
            if (random < cumulative) {
                return test.variants[i].id;
            }
        }

        return test.variants[0].id;
    }

    checkForWinner(testId: string): ABTestResult | null {
        const test = this.tests.get(testId);
        if (!test) return null;

        if (test.variants.length < 2) return null;

        // Get the metric to compare
        const getMetricValue = (v: TestVariant): number => {
            switch (test.metrics.primaryMetric) {
                case 'clicks': return v.metrics.ctr;
                case 'engagement': return v.metrics.engagementRate;
                case 'conversions': return v.metrics.conversionRate;
                case 'watchTime': return v.metrics.engagement;
                default: return v.metrics.ctr;
            }
        };

        // Sort by primary metric
        const sorted = [...test.variants].sort((a, b) => getMetricValue(b) - getMetricValue(a));
        const leader = sorted[0];
        const runnerUp = sorted[1];

        const leaderValue = getMetricValue(leader);
        const runnerUpValue = getMetricValue(runnerUp);

        if (runnerUpValue === 0) return null;

        const improvement = ((leaderValue - runnerUpValue) / runnerUpValue) * 100;

        // Calculate statistical significance (simplified z-test)
        const p1 = leaderValue / 100;
        const p2 = runnerUpValue / 100;
        const n1 = leader.metrics.impressions;
        const n2 = runnerUp.metrics.impressions;

        if (n1 < 100 || n2 < 100) return null;

        const pooledP = (p1 * n1 + p2 * n2) / (n1 + n2);
        const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / n1 + 1 / n2));
        const z = Math.abs(p1 - p2) / se;

        // Z-score to confidence level (approximate)
        const confidence = z > 2.576 ? 0.99 : z > 1.96 ? 0.95 : z > 1.645 ? 0.90 : z > 1.28 ? 0.80 : 0;

        if (confidence >= test.metrics.significanceLevel) {
            test.status = 'completed';
            test.winner = leader.id;
            test.confidence = confidence;
            test.endDate = new Date();

            return {
                testId,
                winner: leader.name,
                improvement,
                confidence,
                recommendation: `${leader.name} outperformed by ${improvement.toFixed(1)}% with ${(confidence * 100).toFixed(0)}% confidence. Recommend applying this variant.`,
            };
        }

        return null;
    }

    getTest(testId: string): ABTest | undefined {
        return this.tests.get(testId);
    }

    listTests(): ABTest[] {
        return Array.from(this.tests.values());
    }

    stopTest(testId: string): ABTest {
        const test = this.tests.get(testId);
        if (!test) throw new Error('Test not found');

        test.status = 'paused';
        return test;
    }
}

export const abTestingService = new ABTestingService();
