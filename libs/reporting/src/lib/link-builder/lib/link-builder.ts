export interface LinkBuilderOptions {
  baseUrl: string;
  campaignId: string;
}

export class InvalidUrlError extends Error {
  constructor(url: string) {
    super(`Invalid URL: ${url}`);
    this.name = 'InvalidUrlError';
  }
}

export class LinkBuilder {
  private readonly baseUrl: URL;

  constructor(private readonly options: LinkBuilderOptions) {
    try {
      this.baseUrl = new URL(options.baseUrl);
    } catch (error) {
      throw new InvalidUrlError(options.baseUrl);
    }

    if (!options.campaignId) {
      throw new Error('Campaign ID is required');
    }
  }

  buildTrackingLink(params: Record<string, string> = {}): string {
    const url = new URL(this.baseUrl);
    url.searchParams.append('cid', this.options.campaignId);
    
    Object.entries(params).forEach(([key, value]) => {
      if (!key || !value) {
        throw new Error('Invalid parameter: both key and value must be non-empty strings');
      }
      url.searchParams.append(key, value);
    });
    
    return url.toString();
  }
}