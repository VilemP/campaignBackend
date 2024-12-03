import { Schema } from '../validation/Schemas';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpResponse {
    description: string;
    content?: {
        'application/json': {
            schema: Schema<any>;
        };
    };
}

export interface HttpEndpoint {
    method: HttpMethod;
    path: string;
    schema: Schema<unknown>;
    responses: Record<number, HttpResponse>;
    createPayload(req: any): unknown;
}