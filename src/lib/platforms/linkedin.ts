// LinkedIn API Client
// Auto-publishes posts and articles to LinkedIn

export interface LinkedInConfig {
    accessToken: string;
    personUrn?: string;        // urn:li:person:xxxxx
    organizationUrn?: string;  // urn:li:organization:xxxxx
}

export interface LinkedInPost {
    text: string;
    mediaUrls?: string[];
    visibility?: 'PUBLIC' | 'CONNECTIONS';
    shareAsOrganization?: boolean;
}

export interface LinkedInArticle {
    title: string;
    content: string;
    thumbnailUrl?: string;
    originalUrl?: string;
}

export interface LinkedInResponse {
    success: boolean;
    postId?: string;
    postUrl?: string;
    error?: string;
}

/**
 * LinkedIn API Client (API v2)
 */
export class LinkedInClient {
    private config: LinkedInConfig;
    private baseUrl = 'https://api.linkedin.com/v2';

    constructor(config: LinkedInConfig) {
        this.config = config;
    }

    /**
     * Get authorization header
     */
    private getAuthHeader(): string {
        return `Bearer ${this.config.accessToken}`;
    }

    /**
     * Test connection and get profile
     */
    async testConnection(): Promise<{ success: boolean; message: string; personUrn?: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/me`, {
                headers: {
                    'Authorization': this.getAuthHeader(),
                },
            });

            if (response.ok) {
                const data = await response.json();
                const personUrn = `urn:li:person:${data.id}`;
                return {
                    success: true,
                    message: `Connected as ${data.localizedFirstName} ${data.localizedLastName}`,
                    personUrn,
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
     * Create a text post
     */
    async createPost(post: LinkedInPost): Promise<LinkedInResponse> {
        try {
            const authorUrn = post.shareAsOrganization
                ? this.config.organizationUrn
                : this.config.personUrn;

            if (!authorUrn) {
                return {
                    success: false,
                    error: 'No author URN configured',
                };
            }

            const body: any = {
                author: authorUrn,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: post.text,
                        },
                        shareMediaCategory: 'NONE',
                    },
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': post.visibility || 'PUBLIC',
                },
            };

            // Add media if provided
            if (post.mediaUrls?.length) {
                body.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'IMAGE';
                body.specificContent['com.linkedin.ugc.ShareContent'].media = post.mediaUrls.map(url => ({
                    status: 'READY',
                    originalUrl: url,
                }));
            }

            const response = await fetch(`${this.baseUrl}/ugcPosts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthHeader(),
                    'X-Restli-Protocol-Version': '2.0.0',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const error = await response.json();
                return {
                    success: false,
                    error: error.message || 'Failed to create post',
                };
            }

            const postId = response.headers.get('x-restli-id');

            return {
                success: true,
                postId: postId || undefined,
                postUrl: postId ? `https://www.linkedin.com/feed/update/${postId}` : undefined,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to create post',
            };
        }
    }

    /**
     * Share an article/link
     */
    async shareArticle(article: LinkedInArticle): Promise<LinkedInResponse> {
        try {
            const authorUrn = this.config.personUrn;

            if (!authorUrn) {
                return {
                    success: false,
                    error: 'No person URN configured',
                };
            }

            const body = {
                author: authorUrn,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: article.content.substring(0, 700), // LinkedIn limit
                        },
                        shareMediaCategory: 'ARTICLE',
                        media: [
                            {
                                status: 'READY',
                                originalUrl: article.originalUrl,
                                title: {
                                    text: article.title,
                                },
                                thumbnails: article.thumbnailUrl ? [{
                                    url: article.thumbnailUrl,
                                }] : undefined,
                            },
                        ],
                    },
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
                },
            };

            const response = await fetch(`${this.baseUrl}/ugcPosts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthHeader(),
                    'X-Restli-Protocol-Version': '2.0.0',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const error = await response.json();
                return {
                    success: false,
                    error: error.message || 'Failed to share article',
                };
            }

            const postId = response.headers.get('x-restli-id');

            return {
                success: true,
                postId: postId || undefined,
                postUrl: postId ? `https://www.linkedin.com/feed/update/${postId}` : undefined,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to share article',
            };
        }
    }

    /**
     * Delete a post
     */
    async deletePost(postId: string): Promise<LinkedInResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/ugcPosts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': this.getAuthHeader(),
                },
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: 'Failed to delete post',
                };
            }

            return {
                success: true,
                postId,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to delete post',
            };
        }
    }

    /**
     * Get organization pages (for company posting)
     */
    async getOrganizations(): Promise<any[]> {
        try {
            const response = await fetch(
                `${this.baseUrl}/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(organizationalTarget~(localizedName)))`,
                {
                    headers: {
                        'Authorization': this.getAuthHeader(),
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                return data.elements || [];
            }

            return [];
        } catch (error) {
            console.error('Failed to get organizations:', error);
            return [];
        }
    }

    /**
     * Get post analytics
     */
    async getPostAnalytics(postUrn: string): Promise<any> {
        try {
            const response = await fetch(
                `${this.baseUrl}/socialActions/${encodeURIComponent(postUrn)}`,
                {
                    headers: {
                        'Authorization': this.getAuthHeader(),
                    },
                }
            );

            if (response.ok) {
                return await response.json();
            }

            return null;
        } catch (error) {
            console.error('Failed to get post analytics:', error);
            return null;
        }
    }

    /**
     * Convert blog content to LinkedIn-friendly format
     */
    formatForLinkedIn(content: string, maxLength: number = 3000): string {
        // Strip HTML
        let text = content.replace(/<[^>]*>/g, '');

        // Convert headers to bold text
        text = text.replace(/#+\s+(.+)/g, '**$1**');

        // Truncate if needed
        if (text.length > maxLength) {
            text = text.substring(0, maxLength - 20) + '\n\n[Read more...]';
        }

        return text;
    }
}

/**
 * Create LinkedIn client instance
 */
export function createLinkedInClient(config: LinkedInConfig): LinkedInClient {
    return new LinkedInClient(config);
}
