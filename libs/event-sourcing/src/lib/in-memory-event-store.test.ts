import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryEventStore } from './in-memory-event-store';
import { EventRecord } from './types';
import { ConcurrencyError } from './event-store';

interface TestEvent {
    data: string;
}

interface TestState {
    items: string[];
}

function createEventRecord(streamId: string, version: number, data: string): EventRecord<TestEvent> {
    return {
        streamId,
        event: { data },
        metadata: { version }
    };
}

describe('InMemoryEventStore', () => {
    let store: InMemoryEventStore;
    const initialState: TestState = { items: [] };

    beforeEach(() => {
        store = new InMemoryEventStore();
    });

    describe('append', () => {
        it('should append events to an empty stream', async () => {
            const event = createEventRecord('stream-1', 0, 'test');
            await store.append('stream-1', [event]);

            const { events } = await store.readStream<TestEvent, TestState>('stream-1', initialState);
            expect(events).toHaveLength(1);
            expect(events[0]).toEqual(event);
        });

        it('should append multiple events in sequence', async () => {
            const event1 = createEventRecord('stream-1', 0, 'test1');
            const event2 = createEventRecord('stream-1', 1, 'test2');

            await store.append('stream-1', [event1]);
            await store.append('stream-1', [event2]);

            const { events } = await store.readStream<TestEvent, TestState>('stream-1', initialState);
            expect(events).toHaveLength(2);
            expect(events[0]).toEqual(event1);
            expect(events[1]).toEqual(event2);
        });

        it('should enforce optimistic concurrency', async () => {
            const event1 = createEventRecord('stream-1', 0, 'test1');
            await store.append('stream-1', [event1]);

            const event2 = createEventRecord('stream-1', 1, 'test2');
            await expect(
                store.append('stream-1', [event2], 0)
            ).rejects.toThrow(ConcurrencyError);
        });
    });

    describe('readStream', () => {
        beforeEach(async () => {
            await store.append('stream-1', [
                createEventRecord('stream-1', 0, 'test1'),
                createEventRecord('stream-1', 1, 'test2'),
                createEventRecord('stream-1', 2, 'test3')
            ]);
        });

        it('should read all events and return initial state when no snapshot exists', async () => {
            const { events, state } = await store.readStream<TestEvent, TestState>('stream-1', initialState);
            expect(events).toHaveLength(3);
            expect(events.map(e => e.event.data)).toEqual(['test1', 'test2', 'test3']);
            expect(state).toEqual(initialState);
        });

        it('should return initial state and empty events for non-existent stream', async () => {
            const { events, state } = await store.readStream<TestEvent, TestState>('non-existent', initialState);
            expect(events).toEqual([]);
            expect(state).toEqual(initialState);
        });
    });

    describe('storeStateAsSnapshot', () => {
        it('should store state and return it on next read', async () => {
            await store.append('stream-1', [
                createEventRecord('stream-1', 0, 'test1'),
                createEventRecord('stream-1', 1, 'test2')
            ]);

            const stateToStore: TestState = { items: ['test1', 'test2'] };
            await store.storeStateAsSnapshot('stream-1', stateToStore, 1);

            const { state, events } = await store.readStream<TestEvent, TestState>('stream-1', initialState);
            expect(state).toEqual(stateToStore);
            expect(events).toHaveLength(1);
            expect(events[0].event.data).toBe('test3');
        });

        it('should only return events after snapshot version', async () => {
            await store.append('stream-1', [
                createEventRecord('stream-1', 0, 'test1'),
                createEventRecord('stream-1', 1, 'test2'),
                createEventRecord('stream-1', 2, 'test3')
            ]);

            const stateAfterTwoEvents: TestState = { items: ['test1', 'test2'] };
            await store.storeStateAsSnapshot('stream-1', stateAfterTwoEvents, 1);

            const { state, events } = await store.readStream<TestEvent, TestState>('stream-1', initialState);
            expect(state).toEqual(stateAfterTwoEvents);
            expect(events).toHaveLength(1);
            expect(events[0].event.data).toBe('test3');
        });
    });
});
