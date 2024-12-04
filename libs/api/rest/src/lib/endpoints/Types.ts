import type { Schema } from '@stroeer-core-configuration/api-core';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpResponse {
    description: string;
    content?: {
        'application/json': {
            schema: Schema<any>;
        };
    };
}

export interface HttpEndpoint<TPayload = unknown, TResponse = unknown> {
    method: HttpMethod;
    path: string;
    inputSchema: Schema<TPayload>;
    outputSchema?: Schema<TResponse>;
    responses: Record<number, HttpResponse>;
    createPayload(req: any): unknown;
}