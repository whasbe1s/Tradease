import { z } from 'zod';
import DOMPurify from 'dompurify';
import { VALIDATION_CONFIG } from './constants';

const sanitizeHtml = (dirty: string): string => {
    return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] }); // Strip all HTML
};

export const TradeSchema = z.object({
    pair: z.string()
        .min(VALIDATION_CONFIG.PAIR_MIN_LENGTH, `Pair must be at least ${VALIDATION_CONFIG.PAIR_MIN_LENGTH} characters`)
        .max(VALIDATION_CONFIG.PAIR_MAX_LENGTH, `Pair must be at most ${VALIDATION_CONFIG.PAIR_MAX_LENGTH} characters`)
        .regex(/^[A-Z]{6,10}$/, 'Pair must be uppercase letters only')
        .transform(val => val.toUpperCase()),

    direction: z.enum(['long', 'short']),

    entry_price: z.number()
        .positive('Entry price must be positive')
        .finite('Entry price must be a valid number'),

    exit_price: z.number()
        .positive('Exit price must be positive')
        .finite('Exit price must be a valid number')
        .optional(),

    quantity: z.number()
        .positive('Quantity must be positive')
        .finite('Quantity must be a valid number'),

    fees: z.number()
        .nonnegative('Fees cannot be negative')
        .finite('Fees must be a valid number')
        .optional(),

    stop_loss: z.number()
        .positive('Stop loss must be positive')
        .finite('Stop loss must be a valid number')
        .optional(),

    take_profit: z.number()
        .positive('Take profit must be positive')
        .finite('Take profit must be a valid number')
        .optional(),

    outcome: z.enum(['win', 'loss', 'be', 'pending']),

    pnl: z.number()
        .finite('PnL must be a valid number')
        .optional(),

    notes: z.string()
        .max(VALIDATION_CONFIG.MAX_NOTES_LENGTH, `Notes must be at most ${VALIDATION_CONFIG.MAX_NOTES_LENGTH} characters`)
        .transform(val => sanitizeHtml(val))
        .optional(),

    screenshot_url: z.string()
        .url('Screenshot must be a valid URL')
        .optional()
        .or(z.literal('')),
});
