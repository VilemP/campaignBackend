import { describe, it, expect, vi } from 'vitest';
import { EventStore } from './EventStore';
import { DomainEvent } from '@domain/events/DomainEvent';

class TestEvent extends DomainEvent {}

describe('EventStore interface', () => {
    it('should define required methods', () => {
        // This is a type test - it will fail at compile time if interface changes
        const store: EventStore = {
            saveEvents: vi.fn(),
            getEvents: vi.fn(),
            getLastVersion: vi.fn()
        };
        expect(store).toBeDefined();
    });
});