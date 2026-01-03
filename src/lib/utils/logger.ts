// =================================================================
// LOGGING UTILITY
// Structured logging for production monitoring
// =================================================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

interface LogContext {
    userId?: string;
    organizationId?: string;
    requestId?: string;
    action?: string;
    [key: string]: unknown;
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: LogContext;
    error?: {
        name: string;
        message: string;
        stack?: string;
    };
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';
    private serviceName = 'digitalmeng';
    private version = process.env.npm_package_version || '1.0.0';

    private formatLog(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
        };

        if (context) {
            entry.context = context;
        }

        if (error) {
            entry.error = {
                name: error.name,
                message: error.message,
                stack: this.isDevelopment ? error.stack : undefined,
            };
        }

        return entry;
    }

    private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
        const entry = this.formatLog(level, message, context, error);

        if (this.isDevelopment) {
            // Pretty print in development
            const color = {
                debug: '\x1b[36m', // Cyan
                info: '\x1b[32m',  // Green
                warn: '\x1b[33m',  // Yellow
                error: '\x1b[31m', // Red
                fatal: '\x1b[35m', // Magenta
            }[level];
            const reset = '\x1b[0m';

            console.log(
                `${color}[${level.toUpperCase()}]${reset} ${entry.timestamp} - ${message}`,
                context ? JSON.stringify(context, null, 2) : '',
                error ? `\n${error.stack}` : ''
            );
        } else {
            // Structured JSON in production (for CloudWatch, etc.)
            console.log(JSON.stringify({
                ...entry,
                service: this.serviceName,
                version: this.version,
                environment: process.env.NODE_ENV,
            }));
        }

        // In production, you might want to send critical errors to external services
        if (level === 'error' || level === 'fatal') {
            this.sendToErrorTracking(entry);
        }
    }

    private sendToErrorTracking(entry: LogEntry): void {
        // In production, integrate with:
        // - AWS CloudWatch Logs
        // - Sentry
        // - Datadog
        // - New Relic

        // Example: Send to CloudWatch (if configured)
        // if (process.env.AWS_CLOUDWATCH_LOG_GROUP) {
        //     // Send to CloudWatch
        // }
    }

    debug(message: string, context?: LogContext): void {
        if (this.isDevelopment) {
            this.log('debug', message, context);
        }
    }

    info(message: string, context?: LogContext): void {
        this.log('info', message, context);
    }

    warn(message: string, context?: LogContext): void {
        this.log('warn', message, context);
    }

    error(message: string, error?: Error | unknown, context?: LogContext): void {
        const err = error instanceof Error ? error : new Error(String(error));
        this.log('error', message, context, err);
    }

    fatal(message: string, error?: Error | unknown, context?: LogContext): void {
        const err = error instanceof Error ? error : new Error(String(error));
        this.log('fatal', message, context, err);
    }

    // Specialized loggers for common actions
    api = {
        request: (method: string, path: string, context?: LogContext) => {
            this.info(`API ${method} ${path}`, { ...context, action: 'api_request' });
        },
        response: (method: string, path: string, status: number, duration: number, context?: LogContext) => {
            this.info(`API ${method} ${path} - ${status} (${duration}ms)`, {
                ...context,
                action: 'api_response',
                status,
                duration,
            });
        },
        error: (method: string, path: string, error: Error, context?: LogContext) => {
            this.error(`API ${method} ${path} failed`, error, { ...context, action: 'api_error' });
        },
    };

    auth = {
        login: (userId: string, email: string, success: boolean) => {
            const level = success ? 'info' : 'warn';
            this.log(level, success ? 'User logged in' : 'Login failed', {
                userId: success ? userId : undefined,
                email,
                action: 'auth_login',
                success,
            });
        },
        logout: (userId: string) => {
            this.info('User logged out', { userId, action: 'auth_logout' });
        },
        signup: (userId: string, email: string) => {
            this.info('New user registered', { userId, email, action: 'auth_signup' });
        },
    };

    content = {
        generated: (contentId: string, type: string, userId: string) => {
            this.info('Content generated', { contentId, type, userId, action: 'content_generated' });
        },
        published: (contentId: string, platform: string, userId: string) => {
            this.info('Content published', { contentId, platform, userId, action: 'content_published' });
        },
        failed: (contentId: string, error: Error, userId: string) => {
            this.error('Content operation failed', error, { contentId, userId, action: 'content_failed' });
        },
    };

    billing = {
        subscriptionCreated: (organizationId: string, plan: string) => {
            this.info('Subscription created', { organizationId, plan, action: 'subscription_created' });
        },
        subscriptionCanceled: (organizationId: string, plan: string) => {
            this.info('Subscription canceled', { organizationId, plan, action: 'subscription_canceled' });
        },
        paymentFailed: (organizationId: string, error: string) => {
            this.warn('Payment failed', { organizationId, error, action: 'payment_failed' });
        },
    };
}

// Export singleton logger instance
export const logger = new Logger();

// Export convenience functions
export const { debug, info, warn, error, fatal } = {
    debug: (msg: string, ctx?: LogContext) => logger.debug(msg, ctx),
    info: (msg: string, ctx?: LogContext) => logger.info(msg, ctx),
    warn: (msg: string, ctx?: LogContext) => logger.warn(msg, ctx),
    error: (msg: string, err?: Error | unknown, ctx?: LogContext) => logger.error(msg, err, ctx),
    fatal: (msg: string, err?: Error | unknown, ctx?: LogContext) => logger.fatal(msg, err, ctx),
};
