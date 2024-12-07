import { ResourceLink, ResourceType, ResourceTypeProvider } from './Types.js';

export abstract class BaseResourceBuilder implements ResourceTypeProvider {
    constructor(protected readonly baseUrl: string) {}

    abstract getSupportedResourceTypes(): ResourceType[];
    abstract buildLink(type: ResourceType, params: Record<string, string>): ResourceLink;

    protected buildUrl(template: string, params: Record<string, string>): string {
        let url = this.baseUrl + template;
        for (const [key, value] of Object.entries(params)) {
            url = url.replace(`{${key}}`, encodeURIComponent(value));
        }
        return url;
    }
} 