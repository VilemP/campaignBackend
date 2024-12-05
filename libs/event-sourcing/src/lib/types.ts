/**
 * A record in the event store, wrapping an event
 * with stream identification, versioning and metadata
 */
export interface EventMetadata {
    version: number;
}

export interface EventRecord<TEvent> {
    readonly streamId: string;
    readonly event: TEvent;
    readonly metadata: EventMetadata;
}

export interface EventEmitter<TEvent> {
    listen(handler: (event: TEvent) => void): void;
}
