import { describe, it, expect } from 'vitest';
import { ClientError } from './types';

describe('ClientError', () => {
    it('should have correct error properties', () => {
        const error: ClientError = {
            kind: 'client_error',
            message: 'Test error'
        };
        
        expect(error.kind).toBe('client_error');
        expect(error.message).toBe('Test error');
    });
}); 