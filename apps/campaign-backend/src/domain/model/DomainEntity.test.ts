import { describe, it, expect, vi } from 'vitest';
import { DomainEntity } from './DomainEntity';
import { DomainEvent } from '../events/DomainEvent';

class TestEvent extends DomainEvent {}

class TestEntity extends DomainEntity {
    public triggerEvent() {
        this.emit(new TestEvent());
    }
}

describe('DomainEntity', () => {
    it('should notify listeners when event is emitted', () => {
        const entity = new TestEntity();
        const listener = vi.fn();
        
        entity.listen(listener);
        entity.triggerEvent();
        
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(expect.any(TestEvent));
    });

    it('should notify multiple listeners', () => {
        const entity = new TestEntity();
        const listener1 = vi.fn();
        const listener2 = vi.fn();
        
        entity.listen(listener1);
        entity.listen(listener2);
        entity.triggerEvent();
        
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(1);
    });
});