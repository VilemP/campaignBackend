import { LinkBuilder, ResourceTypeProvider } from '../types.js';

export class ComposedLinkBuilder implements LinkBuilder {
    private readonly resourceBuilders = new Map<string, ResourceTypeProvider>();

    registerResourceBuilder(provider: ResourceTypeProvider): void {
        this.resourceBuilders.set(provider.getResourceType(), provider);
    }

    buildResourceLink(resource: string, params: Record<string, string>): string {
        const builder = this.resourceBuilders.get(resource);
        if (!builder) {
            throw new Error(`No resource builder registered for ${resource}`);
        }
        return builder.buildLink(params['id']).href;
    }
} 