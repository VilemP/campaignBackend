import { describe, it, expect } from 'vitest';
import { DomainEvent } from './DomainEvent.js';

class TestEvent extends DomainEvent {
    constructor() {
        super();
    }
}

describe('DomainEvent', () => {
    it('should set occurredAt on creation', () => {
        const event = new TestEvent();
        expect(event.occurredAt).toBeInstanceOf(Date);
    });
});