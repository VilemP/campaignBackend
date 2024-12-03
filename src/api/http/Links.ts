export interface LinkBuilder {
    buildResourceLink(resource: string, params: Record<string, string>): string;
}

// We only know this interface from reporting domain
interface ReportingLinksBuilder {
    getCampaignMetricsLink(campaignId: string): string;
}

class CampaignLinkBuilder {
    constructor(private readonly baseUrl: string) {}

    buildCampaignLink(id: string): string {
        return `${this.baseUrl}/campaigns/${id}`;
    }
}

class ComposedLinkBuilder implements LinkBuilder {
    constructor(
        private readonly campaignLinks: CampaignLinkBuilder,
        private readonly reportingLinks: ReportingLinksBuilder,
    ) {}

    buildResourceLink(resource: string, params: Record<string, string>): string {
        switch (resource) {
            case 'campaign':
                return this.campaignLinks.buildCampaignLink(params.id);
            case 'campaign.metrics':
                return this.reportingLinks.getCampaignMetricsLink(params.id);
            default:
                throw new Error(`Unknown resource type: ${resource}`);
        }
    }
}

export function getLinkBuilder(): LinkBuilder {
    return new ComposedLinkBuilder(
        new CampaignLinkBuilder(process.env.BASE_URL!),
        require('@reporting/client').getReportingLinks()
    );
}