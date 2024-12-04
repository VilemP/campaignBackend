import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from './app';

describe('App', () => {
    it('should handle JSON requests', async () => {
        const response = await request(app)
            .get('/health')
            .send();

        expect(response.status).toBe(404); // We haven't implemented any endpoints yet
    });
});