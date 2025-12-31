// TikTok API Client
// Auto-publishes videos to TikTok

export interface TikTokConfig {
    clientKey: string;
    clientSecret: string;
    accessToken: string;
    openId?: string;
}

export interface TikTokVideo {
    videoUrl: string;           // Publicly accessible video URL
    title: string;
    description?: string;
    privacyLevel?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'FOLLOWER_OF_CREATOR' | 'SELF_ONLY';
    duetDisabled?: boolean;
    stitchDisabled?: boolean;
    commentDisabled?: boolean;
    maxVideoPostDuration?: number;
    coverTimestamp?: number;
}

export interface TikTokResponse {
    success: boolean;
    publishId?: string;
    videoUrl?: string;
    error?: string;
    errorCode?: string;
}

/**
 * TikTok Content Posting API Client
 */
export class TikTokClient {
    private config: TikTokConfig;
    private baseUrl = 'https://open.tiktokapis.com/v2';

    constructor(config: TikTokConfig) {
        this.config = config;
    }

    /**
     * Get authorization header
     */
    private getAuthHeader(): string {
        return `Bearer ${this.config.accessToken}`;
    }

    /**
     * Test connection and get user info
     */
    async testConnection(): Promise<{ success: boolean; message: string; openId?: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/user/info/`, {
                method: 'GET',
                headers: {
                    'Authorization': this.getAuthHeader(),
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.data?.user) {
                    return {
                        success: true,
                        message: `Connected as @${data.data.user.display_name}`,
                        openId: data.data.user.open_id,
                    };
                }
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
     * Initialize video upload (Direct Post API)
     * TikTok requires a 2-step process: init -> upload
     */
    async initVideoPost(video: TikTokVideo): Promise<TikTokResponse> {
        try {
            const body = {
                post_info: {
                    title: video.title,
                    privacy_level: video.privacyLevel || 'PUBLIC_TO_EVERYONE',
                    disable_duet: video.duetDisabled || false,
                    disable_stitch: video.stitchDisabled || false,
                    disable_comment: video.commentDisabled || false,
                },
                source_info: {
                    source: 'PULL_FROM_URL',
                    video_url: video.videoUrl,
                },
            };

            const response = await fetch(`${this.baseUrl}/post/publish/video/init/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthHeader(),
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data.error?.code !== 'ok') {
                return {
                    success: false,
                    error: data.error?.message || 'Failed to initialize video post',
                    errorCode: data.error?.code,
                };
            }

            return {
                success: true,
                publishId: data.data?.publish_id,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to initialize video post',
            };
        }
    }

    /**
     * Check publish status
     */
    async checkPublishStatus(publishId: string): Promise<TikTokResponse> {
        try {
            const response = await fetch(
                `${this.baseUrl}/post/publish/status/fetch/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.getAuthHeader(),
                    },
                    body: JSON.stringify({ publish_id: publishId }),
                }
            );

            const data = await response.json();

            if (data.data?.status === 'PUBLISH_COMPLETE') {
                return {
                    success: true,
                    publishId,
                    videoUrl: `https://www.tiktok.com/@${this.config.openId}/video/${data.data.public_video_id}`,
                };
            }

            if (data.data?.status === 'FAILED') {
                return {
                    success: false,
                    error: data.data?.fail_reason || 'Video publish failed',
                    publishId,
                };
            }

            // Still processing
            return {
                success: false,
                error: `Status: ${data.data?.status || 'PROCESSING'}`,
                publishId,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to check status',
            };
        }
    }

    /**
     * Post video and wait for completion
     */
    async postVideo(video: TikTokVideo, maxWaitMs: number = 30000): Promise<TikTokResponse> {
        // Initialize the post
        const initResult = await this.initVideoPost(video);

        if (!initResult.success || !initResult.publishId) {
            return initResult;
        }

        // Poll for completion
        const startTime = Date.now();
        while (Date.now() - startTime < maxWaitMs) {
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds

            const status = await this.checkPublishStatus(initResult.publishId);

            if (status.success) {
                return status;
            }

            if (status.error && !status.error.includes('PROCESSING')) {
                return status;
            }
        }

        return {
            success: false,
            error: 'Timeout waiting for video to publish',
            publishId: initResult.publishId,
        };
    }

    /**
     * Query creator info (for analytics)
     */
    async getCreatorInfo(): Promise<any> {
        try {
            const fields = 'display_name,follower_count,following_count,likes_count,video_count';

            const response = await fetch(
                `${this.baseUrl}/user/info/?fields=${fields}`,
                {
                    headers: {
                        'Authorization': this.getAuthHeader(),
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                return data.data?.user || null;
            }

            return null;
        } catch (error) {
            console.error('Failed to get creator info:', error);
            return null;
        }
    }

    /**
     * Get video insights (requires additional permissions)
     */
    async getVideoList(): Promise<any[]> {
        try {
            const response = await fetch(
                `${this.baseUrl}/video/list/?fields=id,title,create_time,cover_image_url,share_url,view_count,like_count,comment_count,share_count`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.getAuthHeader(),
                    },
                    body: JSON.stringify({ max_count: 20 }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                return data.data?.videos || [];
            }

            return [];
        } catch (error) {
            console.error('Failed to get video list:', error);
            return [];
        }
    }

    /**
     * Format content for TikTok
     * TikTok videos should be:
     * - < 60 seconds for Shorts-like content
     * - Vertical (9:16 aspect ratio)
     * - High quality (1080x1920 recommended)
     */
    formatDescription(content: string, hashtags: string[] = []): string {
        // TikTok description limit is 2200 characters
        const maxLength = 2200 - (hashtags.length * 20);

        let description = content.substring(0, maxLength);

        // Add hashtags
        if (hashtags.length > 0) {
            const hashtagString = hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ');
            description = `${description}\n\n${hashtagString}`;
        }

        return description;
    }
}

/**
 * Create TikTok client instance
 */
export function createTikTokClient(config: TikTokConfig): TikTokClient {
    return new TikTokClient(config);
}
