import { ClientError, InternalError } from './types';

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