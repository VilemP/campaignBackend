import { Schema } from '../validation/Schema';
import { Command } from '../types';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpResponse {
    description: string;
    content?: {
        'application/json': {
            schema: Schema<any>;
        };
    };
}

export interface HttpEndpoint<TCommand extends Command = Command, TPayload = unknown> {
    method: HttpMethod;
    path: string;
    command: new (payload: TPayload, ...deps: any[]) => TCommand;
    schema: Schema<TPayload>;
    responses: Record<number, HttpResponse>;
    createPayload(req: any): TPayload;
    summary?: string;
    tags?: string[];
}