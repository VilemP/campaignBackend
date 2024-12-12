import { ClientError, InternalError } from '@libs/errors;

export class EventStoreConnectionError implements InternalError {
    readonly kind = 'internal_error';
    readonly message: string;
    readonly cause: Error;
    readonly suggestedAction: string;
    
    constructor(message: string, cause: Error) {
        this.message = message;
        this.cause = cause;
        this.suggestedAction = "Check if the event store is running and verify connection settings";
    }
}

export class EntityModifiedError implements ClientError {
    readonly kind = 'client_error';
    readonly message: string;
    readonly suggestedAction: string;
    
    constructor(public readonly entityId: string) {
        this.message = `Someone else modified this entity (${entityId}) while you were working with it`;
        this.suggestedAction = "Please reload the latest version and try your changes again";
    }
}

export class EventStoreReadError implements InternalError {
    readonly kind = 'internal_error';
    readonly message: string;
    readonly cause: Error;
    readonly suggestedAction: string;
    
    constructor(entityId: string, cause: Error) {
        this.message = `Failed to load entity history (${entityId})`;
        this.cause = cause;
        this.suggestedAction = "Check event store logs for details about what went wrong during the load operation";
    }
}

export class EventStoreWriteError implements InternalError {
    readonly kind = 'internal_error';
    readonly message: string;
    readonly cause: Error;
    readonly suggestedAction: string;
    
    constructor(entityId: string, cause: Error) {
        this.message = `Failed to save changes for entity (${entityId})`;
        this.cause = cause;
        this.suggestedAction = "Check event store logs for details about what went wrong during the save operation";
    }
} 