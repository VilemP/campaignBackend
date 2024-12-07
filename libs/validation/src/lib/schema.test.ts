import { describe, it, expect } from 'vitest';
import { ValidationError } from './schema.js';
import { z } from 'zod';

describe('ValidationError', () => {
    it('should create error with correct properties', () => {
        const zodError = new z.ZodError([]);
        const error = new ValidationError('test error', zodError);
        expect(error.message).toBe('test error');
    });
}); 