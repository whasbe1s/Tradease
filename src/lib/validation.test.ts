import { describe, it, expect } from 'vitest';
import { TradeSchema } from './validation';

describe('TradeSchema Validation', () => {
    it('should validate a correct long trade', () => {
        const validTrade = {
            pair: 'BTCUSD',
            direction: 'long',
            entry_price: 50000,
            quantity: 1,
            outcome: 'pending',
        };
        const result = TradeSchema.safeParse(validTrade);
        expect(result.success).toBe(true);
    });

    it('should validate a correct short trade', () => {
        const validTrade = {
            pair: 'ETHUSD',
            direction: 'short',
            entry_price: 3000,
            quantity: 10,
            outcome: 'win',
            pnl: 500,
        };
        const result = TradeSchema.safeParse(validTrade);
        expect(result.success).toBe(true);
    });

    it('should fail if pair is lowercase', () => {
        const invalidTrade = {
            pair: 'btcusd', // Should be uppercase
            direction: 'long',
            entry_price: 50000,
            quantity: 1,
            outcome: 'pending',
        };
        // The schema transforms it, so it might pass if we don't check the input strictly before transform.
        // But let's check if the regex matches.
        // Actually the schema has .transform(val => val.toUpperCase()) AFTER the regex?
        // Let's check the schema definition.
        // .regex(/^[A-Z]{6,10}$/, 'Pair must be uppercase letters only')
        // .transform(val => val.toUpperCase())
        // If regex is first, 'btcusd' will fail regex.

        const result = TradeSchema.safeParse(invalidTrade);
        expect(result.success).toBe(false);
    });

    it('should fail if entry price is negative', () => {
        const invalidTrade = {
            pair: 'BTCUSD',
            direction: 'long',
            entry_price: -100,
            quantity: 1,
            outcome: 'pending',
        };
        const result = TradeSchema.safeParse(invalidTrade);
        expect(result.success).toBe(false);
    });

    it('should fail if quantity is zero or negative', () => {
        const invalidTrade = {
            pair: 'BTCUSD',
            direction: 'long',
            entry_price: 50000,
            quantity: 0, // Should be positive
            outcome: 'pending',
        };
        const result = TradeSchema.safeParse(invalidTrade);
        expect(result.success).toBe(false); // Schema says .positive()
    });

    it('should sanitize notes', () => {
        const tradeWithMaliciousNotes = {
            pair: 'BTCUSD',
            direction: 'long',
            entry_price: 50000,
            quantity: 1,
            outcome: 'pending',
            notes: '<script>alert("xss")</script>Good trade',
        };
        const result = TradeSchema.safeParse(tradeWithMaliciousNotes);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.notes).toBe('Good trade');
        }
    });
});
