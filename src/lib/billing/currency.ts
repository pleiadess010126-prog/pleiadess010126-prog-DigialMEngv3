/**
 * Global Currency & IP Detection System
 * Handles multi-currency pricing based on user location
 */

export interface CurrencyConfig {
    code: string;
    symbol: string;
    rate: number; // Rate relative to USD
    format: string; // e.g., 'symbol' or 'code'
    decimalPlaces: number;
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
    USD: { code: 'USD', symbol: '$', rate: 1, format: 'symbol', decimalPlaces: 0 },
    EUR: { code: 'EUR', symbol: '€', rate: 0.92, format: 'symbol', decimalPlaces: 0 },
    GBP: { code: 'GBP', symbol: '£', rate: 0.79, format: 'symbol', decimalPlaces: 0 },
    INR: { code: 'INR', symbol: '₹', rate: 83.3, format: 'symbol', decimalPlaces: 0 },
    JPY: { code: 'JPY', symbol: '¥', rate: 151.4, format: 'symbol', decimalPlaces: 0 },
    AUD: { code: 'AUD', symbol: 'A$', rate: 1.52, format: 'symbol', decimalPlaces: 0 },
    CAD: { code: 'CAD', symbol: 'C$', rate: 1.36, format: 'symbol', decimalPlaces: 0 },
};

// Map of common countries to their currencies
const COUNTRY_TO_CURRENCY: Record<string, string> = {
    US: 'USD',
    GB: 'GBP',
    DE: 'EUR',
    FR: 'EUR',
    IT: 'EUR',
    ES: 'EUR',
    IN: 'INR',
    JP: 'JPY',
    AU: 'AUD',
    CA: 'CAD',
};

/**
 * Detects user currency based on IP address
 * Uses ipapi.co (Free tier works without key for development)
 */
export async function detectCurrency(): Promise<CurrencyConfig> {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code;
        const currencyCode = COUNTRY_TO_CURRENCY[countryCode] || 'USD';
        return CURRENCIES[currencyCode] || CURRENCIES.USD;
    } catch (error) {
        console.error('Failed to detect currency:', error);
        return CURRENCIES.USD;
    }
}

/**
 * Formats a price in the target currency
 */
export function formatCurrency(amount: number, currency: CurrencyConfig): string {
    const converted = amount * currency.rate;

    // Clean rounding for pretty pricing (e.g., 833.45 -> 835 or 839)
    let finalAmount = Math.ceil(converted);

    // Psychology pricing: round to 9s or 5s for non-zero prices
    if (finalAmount > 10) {
        if (finalAmount % 10 === 0) finalAmount -= 1; // 100 -> 99
        else if (finalAmount % 10 < 5) finalAmount = Math.floor(finalAmount / 10) * 10 + 5; // 82 -> 85
    }

    const formatter = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency.code,
        maximumFractionDigits: currency.decimalPlaces,
    });

    return formatter.format(finalAmount);
}
