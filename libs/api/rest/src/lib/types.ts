export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Link {
    href: string;
    rel: string;
    method: HttpMethod;
}

export interface ResourceResponse<T = unknown> {
    data: T;
    links: Link[];
}

export interface HttpResponse {
    description: string;
    content?: {
        'application/json': {
            schema: unknown;
        };
    };
    links?: Link[];
}

export interface CommandConstructor<TPayload> {
    new (payload: TPayload, ...deps: any[]): {
        execute(): Promise<void>;
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