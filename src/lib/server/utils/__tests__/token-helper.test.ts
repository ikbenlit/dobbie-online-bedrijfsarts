import { describe, it, expect } from 'vitest';
import { estimateTokens, trimMessagesToTokenLimit } from '../token-helper';

describe('token-helper', () => {
    describe('estimateTokens', () => {
        it('should estimate tokens correctly for empty string', () => {
            expect(estimateTokens('')).toBe(0);
        });

        it('should estimate tokens correctly for short text', () => {
            expect(estimateTokens('test')).toBe(1); // 4 characters = 1 token
        });

        it('should estimate tokens correctly for longer text', () => {
            expect(estimateTokens('This is a longer text message')).toBeGreaterThan(7); // Should account for punctuation
        });

        it('should allow configurable characters per token', () => {
            const text = 'test';
            expect(estimateTokens(text, 2)).toBe(2); // 4 characters / 2 = 2 tokens
            expect(estimateTokens(text, 4)).toBe(1); // 4 characters / 4 = 1 token
        });

        it('should handle Dutch text with punctuation correctly', () => {
            const dutchText = 'Hallo, dit is een Nederlandse tekst!';
            const basicEstimate = Math.ceil(dutchText.length / 4);
            const actualEstimate = estimateTokens(dutchText);
            expect(actualEstimate).toBeGreaterThan(basicEstimate - 1); // Should account for punctuation
        });

        it('should handle Dutch compound words correctly', () => {
            const textWithLongWords = 'Dit is een werkverzekeringsprocedure voor ziekteverzuimbegeleiding';
            const basicEstimate = Math.ceil(textWithLongWords.length / 4);
            const actualEstimate = estimateTokens(textWithLongWords);
            expect(actualEstimate).toBeGreaterThan(basicEstimate); // Should boost for long words
        });

        it('should return at least 1 token for any non-empty text', () => {
            expect(estimateTokens('a')).toBe(1);
            expect(estimateTokens('.')).toBe(1);
        });
    });

    describe('trimMessagesToTokenLimit', () => {
        it('should return empty array for empty input', () => {
            const result = trimMessagesToTokenLimit([], 100);
            expect(result).toEqual([]);
        });

        it('should return all messages when under limit', () => {
            const messages = [
                { role: 'user', content: 'Hi' },
                { role: 'assistant', content: 'Hello' }
            ];
            const result = trimMessagesToTokenLimit(messages, 100);
            expect(result).toEqual(messages);
        });

        it('should preserve system messages', () => {
            const messages = [
                { role: 'system', content: 'You are a helpful assistant' },
                { role: 'user', content: 'Hi' },
                { role: 'assistant', content: 'Hello' }
            ];
            const result = trimMessagesToTokenLimit(messages, 100);
            expect(result[0].role).toBe('system');
            expect(result[0].content).toBe('You are a helpful assistant');
        });

        it('should trim messages from the beginning when over limit', () => {
            const messages = [
                { role: 'user', content: 'First message that should be removed' },
                { role: 'assistant', content: 'Response to first' },
                { role: 'user', content: 'Second message' },
                { role: 'assistant', content: 'Response to second' },
                { role: 'user', content: 'Latest message' }
            ];
            
            // Set a very low limit to force trimming
            const result = trimMessagesToTokenLimit(messages, 20);
            
            // Should keep the most recent messages
            expect(result.length).toBeLessThan(messages.length);
            expect(result[result.length - 1].content).toBe('Latest message');
        });

        it('should handle system messages taking up most of the limit', () => {
            const messages = [
                { role: 'system', content: 'This is a very long system message that takes up most of the token limit and should still be preserved' },
                { role: 'user', content: 'Hi' },
                { role: 'assistant', content: 'Hello' }
            ];
            
            const result = trimMessagesToTokenLimit(messages, 30);
            expect(result[0].role).toBe('system');
            expect(result.length).toBeGreaterThan(0);
        });

        it('should return only system messages if they exceed the limit', () => {
            const messages = [
                { role: 'system', content: 'This is a very long system message that exceeds the token limit completely' },
                { role: 'user', content: 'Hi' },
                { role: 'assistant', content: 'Hello' }
            ];
            
            const result = trimMessagesToTokenLimit(messages, 10);
            expect(result.length).toBe(1);
            expect(result[0].role).toBe('system');
        });
    });
});