/**
 * A record in the event store, wrapping an event
 * with stream identification, versioning and metadata
 */
export interface EventRecord<TEvent, TMeta> {
    readonly streamId: string;     // Aggregate/Entity ID
    readonly version: number;      // Position in the stream
    readonly event: TEvent;        // The actual event
    readonly metadata: TMeta;      // Event metadata - shape defined by app
}
