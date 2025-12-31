// Twitter/X API Client
// Auto-publishes tweets and threads

export interface TwitterConfig {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessTokenSecret: string;
    bearerToken?: string;
}

export interface Tweet {
    text: string;
    mediaIds?: string[];
    replyTo?: string;
    quoteTweetId?: string;
}

export interface TweetThread {
    tweets: string[];
    mediaIds?: string[][];
}

export interface TwitterResponse {
    success: boolean;
    tweetId?: string;
    tweetUrl?: string;
    error?: string;
}

/**
 * Twitter/X API Client (API v2)
 */
export class TwitterClient {
    private config: TwitterConfig;
    private baseUrl = 'https://api.twitter.com/2';

    constructor(config: TwitterConfig) {
        this.config = config;
    }

    /**
     * Get OAuth 1.0a authorization header
     */
    private async getOAuthHeader(method: string, url: string, params: Record<string, string> = {}): Promise<string> {
        const oauth = {
            oauth_consumer_key: this.config.apiKey,
            oauth_nonce: this.generateNonce(),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
            oauth_token: this.config.accessToken,
            oauth_version: '1.0',
        };

        // Combine with params
        const allParams: Record<string, string> = { ...oauth, ...params };

        // Sort and encode
        const sortedParams = Object.keys(allParams)
            .sort()
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key])}`)
            .join('&');

        // Create signature base string
        const signatureBase = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;

        // Create signing key
        const signingKey = `${encodeURIComponent(this.config.apiSecret)}&${encodeURIComponent(this.config.accessTokenSecret)}`;

        // Generate signature (simplified - in production use crypto)
        const signature = await this.hmacSha1(signingKey, signatureBase);

        // Build OAuth header
        const oauthHeader = Object.entries({ ...oauth, oauth_signature: signature })
            .map(([key, value]) => `${encodeURIComponent(key)}="${encodeURIComponent(value)}"`)
            .join(', ');

        return `OAuth ${oauthHeader}`;
    }

    private generateNonce(): string {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    private async hmacSha1(key: string, data: string): Promise<string> {
        // In browser/Node.js, use Web Crypto API or crypto module
        // This is a placeholder - implement with actual crypto
        const encoder = new TextEncoder();
        const keyData = encoder.encode(key);
        const messageData = encoder.encode(data);

        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-1' },
            false,
            ['sign']
        );

        const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
        return btoa(String.fromCharCode(...new Uint8Array(signature)));
    }

    /**
     * Test connection
     */
    async testConnection(): Promise<{ success: boolean; message: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${this.config.bearerToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    message: `Connected as @${data.data.username}`,
                };
            }

            return {
                success: false,
                message: 'Authentication failed',
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Connection failed',
            };
        }
    }

    /**
     * Post a tweet
     */
    async postTweet(tweet: Tweet): Promise<TwitterResponse> {
        try {
            const url = `${this.baseUrl}/tweets`;
            const body: any = { text: tweet.text };

            if (tweet.mediaIds?.length) {
                body.media = { media_ids: tweet.mediaIds };
            }

            if (tweet.replyTo) {
                body.reply = { in_reply_to_tweet_id: tweet.replyTo };
            }

            if (tweet.quoteTweetId) {
                body.quote_tweet_id = tweet.quoteTweetId;
            }

            const authHeader = await this.getOAuthHeader('POST', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const error = await response.json();
                return {
                    success: false,
                    error: error.detail || 'Failed to post tweet',
                };
            }

            const data = await response.json();

            return {
                success: true,
                tweetId: data.data.id,
                tweetUrl: `https://twitter.com/i/status/${data.data.id}`,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to post tweet',
            };
        }
    }

    /**
     * Post a thread (multiple tweets)
     */
    async postThread(thread: TweetThread): Promise<TwitterResponse[]> {
        const results: TwitterResponse[] = [];
        let previousTweetId: string | undefined;

        for (let i = 0; i < thread.tweets.length; i++) {
            const tweet: Tweet = {
                text: thread.tweets[i],
                mediaIds: thread.mediaIds?.[i],
                replyTo: previousTweetId,
            };

            const result = await this.postTweet(tweet);
            results.push(result);

            if (result.success && result.tweetId) {
                previousTweetId = result.tweetId;
            } else {
                break; // Stop if a tweet fails
            }

            // Rate limiting: wait between tweets
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return results;
    }

    /**
     * Convert long content to thread format
     */
    contentToThread(content: string, maxLength: number = 280): string[] {
        const tweets: string[] = [];
        const words = content.split(' ');
        let currentTweet = '';

        for (const word of words) {
            const testTweet = currentTweet ? `${currentTweet} ${word}` : word;

            if (testTweet.length <= maxLength - 10) { // Leave room for (1/n)
                currentTweet = testTweet;
            } else {
                if (currentTweet) {
                    tweets.push(currentTweet);
                }
                currentTweet = word;
            }
        }

        if (currentTweet) {
            tweets.push(currentTweet);
        }

        // Add thread numbers
        return tweets.map((tweet, i) =>
            tweets.length > 1 ? `${tweet} (${i + 1}/${tweets.length})` : tweet
        );
    }

    /**
     * Delete a tweet
     */
    async deleteTweet(tweetId: string): Promise<TwitterResponse> {
        try {
            const url = `${this.baseUrl}/tweets/${tweetId}`;
            const authHeader = await this.getOAuthHeader('DELETE', url);

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': authHeader,
                },
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: 'Failed to delete tweet',
                };
            }

            return {
                success: true,
                tweetId,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to delete tweet',
            };
        }
    }

    /**
     * Get user analytics
     */
    async getAnalytics(userId: string): Promise<any> {
        try {
            const response = await fetch(
                `${this.baseUrl}/users/${userId}?user.fields=public_metrics`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.bearerToken}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                return data.data.public_metrics;
            }

            return null;
        } catch (error) {
            console.error('Failed to get analytics:', error);
            return null;
        }
    }
}

/**
 * Create Twitter client instance
 */
export function createTwitterClient(config: TwitterConfig): TwitterClient {
    return new TwitterClient(config);
}
