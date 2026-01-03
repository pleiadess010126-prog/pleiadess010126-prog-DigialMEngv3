'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

// =================================================================
// GLOBAL ERROR BOUNDARY
// Catches React errors and provides user-friendly error handling
// =================================================================

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        this.setState({ errorInfo });

        // Log error
        console.error('[ErrorBoundary] Uncaught error:', error);
        console.error('[ErrorBoundary] Error info:', errorInfo);

        // Call custom error handler
        this.props.onError?.(error, errorInfo);

        // In production, send to error tracking service
        if (process.env.NODE_ENV === 'production') {
            this.reportError(error, errorInfo);
        }
    }

    private reportError(error: Error, errorInfo: React.ErrorInfo): void {
        // Send to error tracking service (Sentry, etc.)
        try {
            const errorReport = {
                message: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                timestamp: new Date().toISOString(),
                url: typeof window !== 'undefined' ? window.location.href : 'unknown',
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
            };

            // Example: Send to your error tracking endpoint
            // fetch('/api/errors', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(errorReport),
            // });

            console.log('[ErrorBoundary] Error reported:', errorReport);
        } catch (reportError) {
            console.error('[ErrorBoundary] Failed to report error:', reportError);
        }
    }

    private handleRetry = (): void => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    private handleGoHome = (): void => {
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    };

    private handleReportBug = (): void => {
        const { error, errorInfo } = this.state;
        const subject = encodeURIComponent(`Bug Report: ${error?.message || 'Unknown Error'}`);
        const body = encodeURIComponent(`
Error: ${error?.message}

Stack: ${error?.stack}

Component Stack: ${errorInfo?.componentStack}

URL: ${typeof window !== 'undefined' ? window.location.href : 'unknown'}

Browser: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'}

Please describe what you were doing when this error occurred:

        `);
        window.open(`mailto:support@digitalme.ng?subject=${subject}&body=${body}`);
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
                    <div className="max-w-lg w-full">
                        <div className="bg-slate-800/50 rounded-2xl border border-red-500/30 overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-6 border-b border-red-500/20">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center">
                                        <AlertTriangle className="w-7 h-7 text-red-400" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-white">Something went wrong</h1>
                                        <p className="text-red-300/80 text-sm">
                                            An unexpected error occurred
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <p className="text-slate-400">
                                    We apologize for the inconvenience. Our team has been notified and is working to fix this issue.
                                </p>

                                {/* Error details (development only) */}
                                {process.env.NODE_ENV === 'development' && this.state.error && (
                                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                                        <p className="text-red-400 font-mono text-sm mb-2">
                                            {this.state.error.message}
                                        </p>
                                        <details className="text-xs text-slate-500">
                                            <summary className="cursor-pointer hover:text-slate-400">
                                                Stack trace
                                            </summary>
                                            <pre className="mt-2 overflow-auto max-h-48 text-slate-600">
                                                {this.state.error.stack}
                                            </pre>
                                        </details>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <button
                                        onClick={this.handleRetry}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl transition-all"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Try Again
                                    </button>
                                    <button
                                        onClick={this.handleGoHome}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
                                    >
                                        <Home className="w-4 h-4" />
                                        Go Home
                                    </button>
                                </div>

                                <button
                                    onClick={this.handleReportBug}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors text-sm"
                                >
                                    <Bug className="w-4 h-4" />
                                    Report this issue
                                </button>
                            </div>
                        </div>

                        {/* Error ID for support */}
                        <p className="text-center text-slate-600 text-xs mt-4">
                            Error ID: {Date.now().toString(36).toUpperCase()}
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// =================================================================
// SIMPLE ERROR FALLBACK COMPONENTS
// =================================================================

interface ErrorFallbackProps {
    error?: Error;
    resetError?: () => void;
}

/**
 * Inline error fallback for smaller components
 */
export function InlineErrorFallback({ error, resetError }: ErrorFallbackProps) {
    return (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-300 text-sm mb-2">
                {error?.message || 'Something went wrong'}
            </p>
            {resetError && (
                <button
                    onClick={resetError}
                    className="text-xs text-red-400 hover:text-red-300 underline"
                >
                    Try again
                </button>
            )}
        </div>
    );
}

/**
 * Card error fallback
 */
export function CardErrorFallback({ error, resetError }: ErrorFallbackProps) {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Failed to load</h3>
            <p className="text-slate-400 text-sm mb-4">
                {error?.message || 'An error occurred while loading this content'}
            </p>
            {resetError && (
                <button
                    onClick={resetError}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                </button>
            )}
        </div>
    );
}

// =================================================================
// ERROR HANDLING HOOKS
// =================================================================

/**
 * Hook for handling async errors
 */
export function useErrorHandler() {
    const [error, setError] = React.useState<Error | null>(null);

    const handleError = React.useCallback((err: unknown) => {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error('[useErrorHandler]', error);
    }, []);

    const clearError = React.useCallback(() => {
        setError(null);
    }, []);

    const wrapAsync = React.useCallback(
        <T,>(fn: () => Promise<T>) => {
            return async () => {
                try {
                    clearError();
                    return await fn();
                } catch (err) {
                    handleError(err);
                    throw err;
                }
            };
        },
        [handleError, clearError]
    );

    return { error, handleError, clearError, wrapAsync };
}

// =================================================================
// GLOBAL ERROR HANDLERS
// =================================================================

/**
 * Setup global error handlers
 * Call this once in your app initialization
 */
export function setupGlobalErrorHandlers(): void {
    if (typeof window === 'undefined') return;

    // Handle uncaught errors
    window.onerror = (message, source, lineno, colno, error) => {
        console.error('[Global] Uncaught error:', { message, source, lineno, colno, error });

        // Report to error tracking in production
        if (process.env.NODE_ENV === 'production') {
            // Send to error tracking service
        }

        // Return false to allow default handling
        return false;
    };

    // Handle unhandled promise rejections
    window.onunhandledrejection = (event) => {
        console.error('[Global] Unhandled promise rejection:', event.reason);

        // Report to error tracking in production
        if (process.env.NODE_ENV === 'production') {
            // Send to error tracking service
        }
    };

    console.log('[Global] Error handlers initialized');
}

export default ErrorBoundary;
