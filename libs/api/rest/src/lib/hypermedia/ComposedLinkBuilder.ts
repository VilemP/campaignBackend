import { LinkBuilder, ResourceLink } from './Types';

export class ComposedLinkBuilder implements LinkBuilder {
    private readonly resourceBuilders = new Map<string, ResourceTypeProvider>();

    registerResourceProvider(domain: string, provider: ResourceTypeProvider): void {
        for (const type of provider.getSupportedResourceTypes()) {
            this.resourceBuilders.set(`${domain}.${type}`, provider);
        }
    }

    buildResourceLink(resource: string, params: Record<string, string>): string {
        const [domain, type] = resource.split('.');
        const provider = this.resourceBuilders.get(`${domain}.${type}`);
        
        if (!provider) {
            throw new Error(`No provider registered for resource type: ${resource}`);
        }

        return provider.buildLink(type, params).href;
    }
}