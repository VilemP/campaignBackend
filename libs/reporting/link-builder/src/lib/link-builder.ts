export interface LinkBuilderOptions {
  baseUrl: string;
  campaignId: string;
}

export class LinkBuilder {
  constructor(private readonly options: LinkBuilderOptions) {}

  buildTrackingLink(params: Record<string, string>): string {
    const url = new URL(this.options.baseUrl);
    url.searchParams.append('cid', this.options.campaignId);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    return url.toString();
  }
}