import { describe, it, expect, vi } from 'vitest';
import { SnapshotStore } from './SnapshotStore';

describe('SnapshotStore interface', () => {
    it('should define required methods', () => {
        // This is a type test - it will fail at compile time if interface changes
        const store: SnapshotStore = {
            saveSnapshot: vi.fn(),
            getLatestSnapshot: vi.fn()
        };
        expect(store).toBeDefined();
    });
});