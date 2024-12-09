import { SchemaType } from '@libs/validation';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Link {
    href: string;
    rel: string;
    method: HttpMethod;
}

export interface ResourceLink {
    href: string;
}

export interface LinkBuilder {
    buildResourceLink(resource: string, params: Record<string, string>): string;
}

export interface ResourceTypeProvider {
    getResourceType(): string;
    buildLink(id: string): ResourceLink;
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

export interface HttpRequest {
    body: unknown;
}

export interface ResponseCategory {
    code: number;
    response: HttpResponse;
}

export interface ResponseDefinition {
    success: ResponseCategory;
    clientErrors: ResponseCategory[];
    serverErrors: ResponseCategory[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Command<TPayload> {
    execute(): Promise<void>;
}

export interface CommandConstructor<T extends Command<TPayload>, TPayload, TDeps = unknown> {
    new(payload: TPayload, deps: TDeps): T;
}

export interface CommandHttpEndpoint<TPayload, TDeps = unknown> {
    method: HttpMethod;
    path: string;
    command: CommandConstructor<Command<TPayload>, TPayload, TDeps>;
    schema: SchemaType<TPayload>;
    responses: ResponseDefinition;
    createPayload(req: HttpRequest): TPayload;
    summary?: string;
    tags?: string[];
}

export function toOpenApiResponses(responses: ResponseDefinition): Record<number, HttpResponse> {
    return {
        [responses.success.code]: responses.success.response,
        ...Object.fromEntries(responses.clientErrors.map(e => [e.code, e.response])),
        ...Object.fromEntries(responses.serverErrors.map(e => [e.code, e.response]))
    };
}