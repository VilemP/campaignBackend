import { describe, it, expect } from 'vitest';
import { HttpMethod } from './types.js';

describe('HttpMethod', () => {
    it('should accept valid HTTP methods', () => {
        const method: HttpMethod = 'GET';
        expect(method).toBe('GET');
    });
}); 