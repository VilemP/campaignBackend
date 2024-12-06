export interface ErrorBase {
    message: string;
    cause?: Error;
    suggestedAction?: string;
}

export interface ClientError extends ErrorBase {
    readonly kind: 'client_error';
}

export interface InternalError extends ErrorBase {
    readonly kind: 'internal_error';
}

export function isClientError(error: unknown): error is ClientError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'kind' in error &&
        error.kind === 'client_error'
    );
}

export function isInternalError(error: unknown): error is InternalError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'kind' in error &&
        error.kind === 'internal_error'
    );
} 