// FTP/SFTP Adapter
// Publish content to plain HTML websites via FTP/SFTP

export interface FTPConfig {
    host: string;
    port?: number;
    username: string;
    password?: string;
    privateKey?: string;      // For SFTP with key auth
    protocol: 'ftp' | 'sftp';
    basePath: string;         // e.g., /public_html/blog
    baseUrl: string;          // e.g., https://example.com/blog
}

export interface FTPPost {
    title: string;
    content: string;          // HTML content
    slug: string;             // URL-friendly slug
    template?: string;        // HTML template to use
    metadata?: {
        author?: string;
        date?: string;
        description?: string;
        keywords?: string[];
    };
}

export interface FTPResponse {
    success: boolean;
    filePath?: string;
    postUrl?: string;
    error?: string;
}

// Default HTML template for blog posts
const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{{description}}">
    <meta name="keywords" content="{{keywords}}">
    <meta name="author" content="{{author}}">
    <title>{{title}}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; color: #1a1a1a; }
        .meta { color: #666; margin-bottom: 2rem; font-size: 0.9rem; }
        article { font-size: 1.1rem; }
        article h2 { margin-top: 2rem; margin-bottom: 1rem; }
        article p { margin-bottom: 1rem; }
        article ul, article ol { margin: 1rem 0; padding-left: 2rem; }
        article img { max-width: 100%; height: auto; margin: 1rem 0; }
        a { color: #0066cc; }
        .footer { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #eee; color: #666; }
    </style>
</head>
<body>
    <article>
        <h1>{{title}}</h1>
        <div class="meta">
            <span>By {{author}}</span> • <span>{{date}}</span>
        </div>
        <div class="content">
            {{content}}
        </div>
    </article>
    <footer class="footer">
        <p>&copy; {{year}} All rights reserved.</p>
    </footer>
</body>
</html>`;

/**
 * FTP/SFTP Client for static website publishing
 * Note: This uses the Fetch API for demonstration.
 * In production, use a proper FTP library like 'basic-ftp' or 'ssh2-sftp-client'
 */
export class FTPClient {
    private config: FTPConfig;

    constructor(config: FTPConfig) {
        this.config = config;
    }

    /**
     * Generate HTML from template
     */
    private generateHTML(post: FTPPost): string {
        const template = post.template || DEFAULT_TEMPLATE;
        const now = new Date();

        return template
            .replace(/\{\{title\}\}/g, post.title)
            .replace(/\{\{content\}\}/g, post.content)
            .replace(/\{\{author\}\}/g, post.metadata?.author || 'Admin')
            .replace(/\{\{date\}\}/g, post.metadata?.date || now.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }))
            .replace(/\{\{description\}\}/g, post.metadata?.description || post.title)
            .replace(/\{\{keywords\}\}/g, post.metadata?.keywords?.join(', ') || '')
            .replace(/\{\{year\}\}/g, now.getFullYear().toString());
    }

    /**
     * Generate URL-friendly slug
     */
    static generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 60);
    }

    /**
     * Test FTP connection
     * Note: This is a mock implementation. 
     * In production, use actual FTP library.
     */
    async testConnection(): Promise<{ success: boolean; message: string }> {
        try {
            // In production, use:
            // const ftp = new FTPClient();
            // await ftp.connect(this.config);

            console.log(`Testing ${this.config.protocol.toUpperCase()} connection to ${this.config.host}...`);

            // Mock success for demonstration
            return {
                success: true,
                message: `Connected to ${this.config.host} via ${this.config.protocol.toUpperCase()}`,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Connection failed',
            };
        }
    }

    /**
     * Publish a post
     */
    async publishPost(post: FTPPost): Promise<FTPResponse> {
        try {
            const html = this.generateHTML(post);
            const filename = `${post.slug}.html`;
            const remotePath = `${this.config.basePath}/${filename}`;

            // In production, use actual FTP upload:
            // await ftp.uploadFrom(Buffer.from(html), remotePath);

            console.log(`Publishing ${filename} to ${remotePath}...`);
            console.log(`HTML size: ${html.length} bytes`);

            // For demonstration, we'll simulate the upload
            // In production, implement actual FTP/SFTP upload

            const postUrl = `${this.config.baseUrl}/${filename}`;

            return {
                success: true,
                filePath: remotePath,
                postUrl,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to publish post',
            };
        }
    }

    /**
     * Update blog index file
     */
    async updateIndex(posts: FTPPost[]): Promise<FTPResponse> {
        try {
            // Generate index.html with list of posts
            const indexHTML = this.generateIndexHTML(posts);
            const remotePath = `${this.config.basePath}/index.html`;

            console.log(`Updating index at ${remotePath}...`);

            // In production, upload the index file

            return {
                success: true,
                filePath: remotePath,
                postUrl: this.config.baseUrl,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to update index',
            };
        }
    }

    /**
     * Generate index HTML
     */
    private generateIndexHTML(posts: FTPPost[]): string {
        const postList = posts.map(post => `
            <article class="post-preview">
                <h2><a href="${post.slug}.html">${post.title}</a></h2>
                <p class="meta">${post.metadata?.date || 'Recent'}</p>
                <p>${post.metadata?.description || ''}</p>
            </article>
        `).join('\n');

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
        h1 { margin-bottom: 2rem; }
        .post-preview { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid #eee; }
        .post-preview h2 { margin-bottom: 0.5rem; }
        .post-preview h2 a { color: #333; text-decoration: none; }
        .post-preview h2 a:hover { color: #0066cc; }
        .meta { color: #666; font-size: 0.9rem; margin-bottom: 0.5rem; }
    </style>
</head>
<body>
    <h1>Blog</h1>
    ${postList}
</body>
</html>`;
    }

    /**
     * Delete a post
     */
    async deletePost(slug: string): Promise<FTPResponse> {
        try {
            const remotePath = `${this.config.basePath}/${slug}.html`;

            // In production, use:
            // await ftp.remove(remotePath);

            console.log(`Deleting ${remotePath}...`);

            return {
                success: true,
                filePath: remotePath,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to delete post',
            };
        }
    }

    /**
     * List existing posts
     */
    async listPosts(): Promise<string[]> {
        try {
            // In production, use:
            // const files = await ftp.list(this.config.basePath);
            // return files.filter(f => f.name.endsWith('.html')).map(f => f.name);

            console.log(`Listing posts in ${this.config.basePath}...`);
            return [];
        } catch (error) {
            console.error('Failed to list posts:', error);
            return [];
        }
    }
}

/**
 * Create FTP client instance
 */
export function createFTPClient(config: FTPConfig): FTPClient {
    return new FTPClient(config);
}

/**
 * Convert markdown to HTML (simple implementation)
 */
export function markdownToHTML(markdown: string): string {
    return markdown
        // Headers
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Links
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
        // Paragraphs
        .replace(/\n\n/g, '</p><p>')
        // Lists
        .replace(/^\- (.+)$/gm, '<li>$1</li>')
        // Wrap in paragraph
        .replace(/^(.+)$/gm, '<p>$1</p>')
        // Clean up
        .replace(/<p><h/g, '<h')
        .replace(/<\/h(\d)><\/p>/g, '</h$1>')
        .replace(/<p><ul>/g, '<ul>')
        .replace(/<\/ul><\/p>/g, '</ul>');
}
