import { ClientError, InternalError } from '@libs/errors';

export class CampaignNotFoundError implements ClientError {
    readonly kind = 'client_error';
    readonly message: string;
    readonly suggestedAction: string;
    
    constructor(public readonly campaignId: string) {
        this.message = `Campaign with ID ${campaignId} does not exist`;
        this.suggestedAction = "Verify that you are using the correct campaign ID";
    }
}

export class UntrackedCampaignError implements ClientError {
    readonly kind = 'client_error';
    readonly message: string;
    readonly suggestedAction: string;
    
    constructor(public readonly campaignId: string) {
        this.message = `Cannot save campaign ${campaignId} because it was created or modified outside the repository`;
        this.suggestedAction = "Always load campaigns through the repository before modifying them - this ensures all changes are properly tracked and validated";
    }
}

export class CampaignPersistenceError implements InternalError {
    readonly kind = 'internal_error';
    readonly message: string;
    readonly cause: Error;
    readonly suggestedAction: string;
    
    constructor(campaignId: string, cause: Error) {
        this.message = `Failed to save or load campaign ${campaignId}`;
        this.cause = cause;
        this.suggestedAction = "Check the application logs for details about the underlying storage error";
    }
} 