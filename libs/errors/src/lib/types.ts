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