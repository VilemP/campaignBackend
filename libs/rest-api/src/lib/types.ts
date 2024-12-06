import { InputSchema } from '@libs/validation';

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

export interface ResponseCategory {
    code: number;
    response: HttpResponse;
}

export interface ResponseDefinition {
    success: ResponseCategory;
    clientErrors: ResponseCategory[];
    serverErrors: ResponseCategory[];
}

export interface Command {
    execute(): Promise<void>;
}

export interface CommandConstructor<TPayload> {
    new (payload: TPayload, ...deps: any[]): Command;
}

export interface CommandHttpEndpoint<TCommand extends Command = Command, TPayload = unknown> {
    method: HttpMethod;
    path: string;
    command: new (payload: TPayload, ...deps: any[]) => TCommand;
    schema: InputSchema<TPayload>;
    responses: ResponseDefinition;
    createPayload(req: any): TPayload;
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