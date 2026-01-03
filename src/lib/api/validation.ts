// =================================================================
// API VALIDATION UTILITIES
// Input validation and sanitization for API routes
// =================================================================

/**
 * Validation error class
 */
export class ValidationError extends Error {
    public field: string;
    public code: string;

    constructor(field: string, message: string, code: string = 'VALIDATION_ERROR') {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
        this.code = code;
    }
}

/**
 * Validation result
 */
export interface ValidationResult<T> {
    success: boolean;
    data?: T;
    errors?: Array<{ field: string; message: string; code: string }>;
}

/**
 * Common validation patterns
 */
export const PATTERNS = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
    slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    phone: /^\+?[1-9]\d{1,14}$/,
};

/**
 * String validators
 */
export const string = {
    required(value: unknown, fieldName: string): string {
        if (value === undefined || value === null || value === '') {
            throw new ValidationError(fieldName, `${fieldName} is required`, 'REQUIRED');
        }
        if (typeof value !== 'string') {
            throw new ValidationError(fieldName, `${fieldName} must be a string`, 'TYPE_ERROR');
        }
        return value;
    },

    optional(value: unknown, fieldName: string): string | undefined {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }
        if (typeof value !== 'string') {
            throw new ValidationError(fieldName, `${fieldName} must be a string`, 'TYPE_ERROR');
        }
        return value;
    },

    email(value: unknown, fieldName: string = 'email'): string {
        const str = string.required(value, fieldName);
        if (!PATTERNS.email.test(str)) {
            throw new ValidationError(fieldName, 'Invalid email format', 'INVALID_EMAIL');
        }
        return str.toLowerCase().trim();
    },

    password(value: unknown, fieldName: string = 'password'): string {
        const str = string.required(value, fieldName);
        if (str.length < 8) {
            throw new ValidationError(fieldName, 'Password must be at least 8 characters', 'PASSWORD_TOO_SHORT');
        }
        return str;
    },

    strongPassword(value: unknown, fieldName: string = 'password'): string {
        const str = string.required(value, fieldName);
        if (!PATTERNS.password.test(str)) {
            throw new ValidationError(
                fieldName,
                'Password must be at least 8 characters with uppercase, lowercase, and number',
                'WEAK_PASSWORD'
            );
        }
        return str;
    },

    url(value: unknown, fieldName: string): string {
        const str = string.required(value, fieldName);
        if (!PATTERNS.url.test(str)) {
            throw new ValidationError(fieldName, 'Invalid URL format', 'INVALID_URL');
        }
        return str;
    },

    minLength(value: unknown, min: number, fieldName: string): string {
        const str = string.required(value, fieldName);
        if (str.length < min) {
            throw new ValidationError(fieldName, `${fieldName} must be at least ${min} characters`, 'TOO_SHORT');
        }
        return str;
    },

    maxLength(value: unknown, max: number, fieldName: string): string {
        const str = string.required(value, fieldName);
        if (str.length > max) {
            throw new ValidationError(fieldName, `${fieldName} must be at most ${max} characters`, 'TOO_LONG');
        }
        return str;
    },

    enum<T extends string>(value: unknown, allowed: T[], fieldName: string): T {
        const str = string.required(value, fieldName);
        if (!allowed.includes(str as T)) {
            throw new ValidationError(
                fieldName,
                `${fieldName} must be one of: ${allowed.join(', ')}`,
                'INVALID_ENUM'
            );
        }
        return str as T;
    },
};

/**
 * Number validators
 */
export const number = {
    required(value: unknown, fieldName: string): number {
        if (value === undefined || value === null) {
            throw new ValidationError(fieldName, `${fieldName} is required`, 'REQUIRED');
        }
        const num = Number(value);
        if (isNaN(num)) {
            throw new ValidationError(fieldName, `${fieldName} must be a number`, 'TYPE_ERROR');
        }
        return num;
    },

    optional(value: unknown, fieldName: string): number | undefined {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }
        const num = Number(value);
        if (isNaN(num)) {
            throw new ValidationError(fieldName, `${fieldName} must be a number`, 'TYPE_ERROR');
        }
        return num;
    },

    min(value: unknown, min: number, fieldName: string): number {
        const num = number.required(value, fieldName);
        if (num < min) {
            throw new ValidationError(fieldName, `${fieldName} must be at least ${min}`, 'TOO_SMALL');
        }
        return num;
    },

    max(value: unknown, max: number, fieldName: string): number {
        const num = number.required(value, fieldName);
        if (num > max) {
            throw new ValidationError(fieldName, `${fieldName} must be at most ${max}`, 'TOO_LARGE');
        }
        return num;
    },

    range(value: unknown, min: number, max: number, fieldName: string): number {
        const num = number.required(value, fieldName);
        if (num < min || num > max) {
            throw new ValidationError(fieldName, `${fieldName} must be between ${min} and ${max}`, 'OUT_OF_RANGE');
        }
        return num;
    },

    integer(value: unknown, fieldName: string): number {
        const num = number.required(value, fieldName);
        if (!Number.isInteger(num)) {
            throw new ValidationError(fieldName, `${fieldName} must be an integer`, 'NOT_INTEGER');
        }
        return num;
    },

    positive(value: unknown, fieldName: string): number {
        const num = number.required(value, fieldName);
        if (num <= 0) {
            throw new ValidationError(fieldName, `${fieldName} must be positive`, 'NOT_POSITIVE');
        }
        return num;
    },
};

/**
 * Boolean validators
 */
export const boolean = {
    required(value: unknown, fieldName: string): boolean {
        if (value === undefined || value === null) {
            throw new ValidationError(fieldName, `${fieldName} is required`, 'REQUIRED');
        }
        if (typeof value === 'boolean') {
            return value;
        }
        if (value === 'true' || value === '1') {
            return true;
        }
        if (value === 'false' || value === '0') {
            return false;
        }
        throw new ValidationError(fieldName, `${fieldName} must be a boolean`, 'TYPE_ERROR');
    },

    optional(value: unknown, fieldName: string, defaultValue: boolean = false): boolean {
        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }
        return boolean.required(value, fieldName);
    },
};

/**
 * Array validators
 */
export const array = {
    required<T>(value: unknown, fieldName: string): T[] {
        if (value === undefined || value === null) {
            throw new ValidationError(fieldName, `${fieldName} is required`, 'REQUIRED');
        }
        if (!Array.isArray(value)) {
            throw new ValidationError(fieldName, `${fieldName} must be an array`, 'TYPE_ERROR');
        }
        return value;
    },

    optional<T>(value: unknown, fieldName: string): T[] | undefined {
        if (value === undefined || value === null) {
            return undefined;
        }
        if (!Array.isArray(value)) {
            throw new ValidationError(fieldName, `${fieldName} must be an array`, 'TYPE_ERROR');
        }
        return value;
    },

    minLength<T>(value: unknown, min: number, fieldName: string): T[] {
        const arr = array.required<T>(value, fieldName);
        if (arr.length < min) {
            throw new ValidationError(fieldName, `${fieldName} must have at least ${min} items`, 'TOO_FEW');
        }
        return arr;
    },

    maxLength<T>(value: unknown, max: number, fieldName: string): T[] {
        const arr = array.required<T>(value, fieldName);
        if (arr.length > max) {
            throw new ValidationError(fieldName, `${fieldName} must have at most ${max} items`, 'TOO_MANY');
        }
        return arr;
    },

    ofStrings(value: unknown, fieldName: string): string[] {
        const arr = array.required<string>(value, fieldName);
        for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i] !== 'string') {
                throw new ValidationError(fieldName, `${fieldName}[${i}] must be a string`, 'TYPE_ERROR');
            }
        }
        return arr;
    },
};

/**
 * Object validators
 */
export const object = {
    required<T extends object>(value: unknown, fieldName: string): T {
        if (value === undefined || value === null) {
            throw new ValidationError(fieldName, `${fieldName} is required`, 'REQUIRED');
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            throw new ValidationError(fieldName, `${fieldName} must be an object`, 'TYPE_ERROR');
        }
        return value as T;
    },

    optional<T extends object>(value: unknown, fieldName: string): T | undefined {
        if (value === undefined || value === null) {
            return undefined;
        }
        return object.required<T>(value, fieldName);
    },
};

/**
 * Sanitization utilities
 */
export const sanitize = {
    /**
     * Remove HTML tags from string
     */
    stripHtml(value: string): string {
        return value.replace(/<[^>]*>/g, '');
    },

    /**
     * Escape HTML entities
     */
    escapeHtml(value: string): string {
        const htmlEntities: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        };
        return value.replace(/[&<>"']/g, char => htmlEntities[char]);
    },

    /**
     * Trim and normalize whitespace
     */
    normalizeWhitespace(value: string): string {
        return value.trim().replace(/\s+/g, ' ');
    },

    /**
     * Remove control characters
     */
    removeControlChars(value: string): string {
        return value.replace(/[\x00-\x1f\x7f-\x9f]/g, '');
    },

    /**
     * Full sanitization for user input
     */
    userInput(value: string): string {
        return sanitize.removeControlChars(sanitize.normalizeWhitespace(value.trim()));
    },
};

/**
 * Create a validator function that collects all errors
 */
export function createValidator<T>(
    validationFn: (data: unknown) => T
): (data: unknown) => ValidationResult<T> {
    return (data: unknown): ValidationResult<T> => {
        try {
            const result = validationFn(data);
            return { success: true, data: result };
        } catch (error) {
            if (error instanceof ValidationError) {
                return {
                    success: false,
                    errors: [{ field: error.field, message: error.message, code: error.code }],
                };
            }
            throw error;
        }
    };
}

/**
 * Parse and validate request body
 */
export async function parseBody<T>(
    request: Request,
    validator: (data: unknown) => T
): Promise<ValidationResult<T>> {
    try {
        const body = await request.json();
        const result = validator(body);
        return { success: true, data: result };
    } catch (error) {
        if (error instanceof ValidationError) {
            return {
                success: false,
                errors: [{ field: error.field, message: error.message, code: error.code }],
            };
        }
        if (error instanceof SyntaxError) {
            return {
                success: false,
                errors: [{ field: 'body', message: 'Invalid JSON', code: 'INVALID_JSON' }],
            };
        }
        throw error;
    }
}

/**
 * Standard API response helpers
 */
export const apiResponse = {
    success<T>(data: T, status: number = 200) {
        return Response.json({ success: true, data }, { status });
    },

    error(message: string, status: number = 400, code: string = 'ERROR', details?: unknown) {
        return Response.json(
            { success: false, error: { message, code, details } },
            { status }
        );
    },

    validationError(errors: Array<{ field: string; message: string; code: string }>) {
        return Response.json(
            { success: false, error: { message: 'Validation failed', code: 'VALIDATION_ERROR', errors } },
            { status: 400 }
        );
    },

    unauthorized(message: string = 'Authentication required') {
        return Response.json(
            { success: false, error: { message, code: 'UNAUTHORIZED' } },
            { status: 401 }
        );
    },

    forbidden(message: string = 'Access denied') {
        return Response.json(
            { success: false, error: { message, code: 'FORBIDDEN' } },
            { status: 403 }
        );
    },

    notFound(message: string = 'Resource not found') {
        return Response.json(
            { success: false, error: { message, code: 'NOT_FOUND' } },
            { status: 404 }
        );
    },

    serverError(message: string = 'Internal server error') {
        return Response.json(
            { success: false, error: { message, code: 'SERVER_ERROR' } },
            { status: 500 }
        );
    },
};
