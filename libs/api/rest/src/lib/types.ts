export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface CommandConstructor<TPayload> {
    new (payload: TPayload, ...deps: any[]): {
        execute(): Promise<void>;
    };
}

export interface HttpResponse {
    description: string;
    content?: {
        'application/json': {
            schema: unknown;
        };
    };
}

export interface HttpEndpoint<TPayload> {
    method: HttpMethod;
    path: string;
    command: CommandConstructor<TPayload>;
    schema: { validate(value: unknown): TPayload };
    responses: Record<number, HttpResponse>;
    createPayload(req: any): TPayload;
    summary?: string;
    tags?: string[];
} 