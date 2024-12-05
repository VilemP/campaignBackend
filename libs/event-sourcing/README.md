# Event Sourcing Library

A minimal, type-safe event sourcing implementation with zero external dependencies. This library provides the core building blocks for implementing event sourced systems.

## Core Concepts

### Event Records

An event record wraps a domain event with necessary technical metadata:

```typescript
interface EventRecord<TEvent, TMeta> {
    readonly streamId: string;     // Aggregate/Entity ID
    readonly version: number;      // Position in the stream
    readonly event: TEvent;        // The actual event
    readonly metadata: TMeta;      // Event metadata
}
```

The library is agnostic about the actual shape of events and metadata - these are defined by your application.

### Event Streams

Event records are organized into streams, typically one stream per aggregate instance. Each event record in a stream has a sequential version number starting from 0.

### Event Store

The EventStore interface defines how to append and read event records:

```typescript
interface EventStore {
    append<TEvent, TMeta>(
        streamId: string,
        records: EventRecord<TEvent, TMeta>[],
        expectedVersion?: number
    ): Promise<void>;

    readStream<TEvent, TMeta>(
        streamId: string,
        fromVersion?: number,
        toVersion?: number
    ): Promise<EventRecord<TEvent, TMeta>[]>;
}
```

### Optimistic Concurrency

The event store implements optimistic concurrency control using event record versions:
- Each event record in a stream must have a sequential version number
- When appending, you can specify an expected version
- If the current version doesn't match, a ConcurrencyError is thrown

## Usage

### Define Your Types

```typescript
// Your domain event
interface UserCreated {
    userId: string;
    email: string;
}

// Your event metadata
interface EventMetadata {
    timestamp: Date;
    userId: string;
}
```

### Store Event Records

```typescript
const store: EventStore = new InMemoryEventStore();

// Create event record
const record: EventRecord<UserCreated, EventMetadata> = {
    streamId: 'user-123',
    version: 0,
    event: { userId: 'user-123', email: 'test@example.com' },
    metadata: { timestamp: new Date(), userId: 'admin' }
};

// Append to store
await store.append('user-123', [record]);

// Read from store
const records = await store.readStream<UserCreated, EventMetadata>('user-123');
```

### Handle Concurrency

```typescript
// Append with optimistic concurrency
try {
    await store.append('user-123', [record], expectedVersion);
} catch (error) {
    if (error instanceof ConcurrencyError) {
        // Handle concurrency conflict
    }
    throw error;
}
```

## Implementations

### InMemoryEventStore

A simple in-memory implementation suitable for testing. Not suitable for production use.

## Production Use

For production use, you'll need to implement the EventStore interface with a proper database backend. Some considerations:

1. Event records are immutable - they cannot be modified or deleted once stored
2. Sequential versioning is crucial for consistency
3. Consider implementing snapshotting for performance (snapshots are stored as special event records)
4. Consider implementing projections for read models

## Design Principles

1. **Zero Dependencies**: The library has no external dependencies
2. **Type Safety**: Full TypeScript support with generic types
3. **Minimal Interface**: Only the essential operations are included
4. **Storage Agnostic**: Can be implemented with any storage backend
5. **Domain Agnostic**: No assumptions about event or metadata shape