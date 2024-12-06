export interface ResourceLink {
    href: string;
}

export interface HypermediaResponse {
    _links: Record<string, ResourceLink>;
}

export type ResourceType = string;

export interface ResourceTypeProvider {
    getSupportedResourceTypes(): ResourceType[];
    buildLink(type: ResourceType, params: Record<string, string>): ResourceLink;
} 