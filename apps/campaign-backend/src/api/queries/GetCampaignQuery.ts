import { Query, Schema, InputSchema, OutputSchema } from '@campaign-backend/api/core';
import { HypermediaResponse, ResourceLink } from '@campaign-backend/api/rest';
import { z } from 'zod';
import { Campaign } from '../../domain/model/Campaign';
import { CampaignRepository } from '../../domain/repositories/CampaignRepository';
import { EntityNotFoundError } from '../../domain/errors/DomainErrors';
import { LinkBuilder } from '@campaign-backend/api/rest';

// Input/Output types
export interface GetCampaignInput {
    id: string;
}

export interface GetCampaignResponse extends HypermediaResponse {
    id: string;
    name: string;
    status: string;
    _links: {
        self: ResourceLink;
        metrics?: ResourceLink;
    };
}

// Schemas
const inputSchema = new InputSchema(
    z.object({
        id: z.string().uuid()
    })
);

const outputSchema = new OutputSchema(
    z.object({
        id: z.string().uuid(),
        name: z.string(),
        status: z.enum(['ACTIVE', 'PAUSED', 'ENDED']),
        _links: z.object({
            self: z.object({
                href: z.string().url()
            }),
            metrics: z.object({
                href: z.string().url()
            }).optional()
        })
    })
);

// Query implementation
export class GetCampaignQuery implements Query<GetCampaignResponse> {
    private readonly validatedPayload: GetCampaignInput;

    constructor(
        payload: unknown,
        private readonly campaignRepository: CampaignRepository,
        private readonly linkBuilder: LinkBuilder
    ) {
        this.validatedPayload = inputSchema.validate(payload);
    }

    async execute(): Promise<GetCampaignResponse> {
        const campaign = await this.campaignRepository.findById(this.validatedPayload.id);
        if (!campaign) {
            throw new EntityNotFoundError('Campaign', this.validatedPayload.id);
        }

        const response = this.buildResponse(campaign);
        return outputSchema.validate(response);
    }

    private buildResponse(campaign: Campaign): GetCampaignResponse {
        const response: GetCampaignResponse = {
            id: campaign.getId(),
            name: campaign.getName(),
            status: campaign.getStatus(),
            _links: {
                self: { 
                    href: this.linkBuilder.buildResourceLink('campaign', { id: campaign.getId() })
                }
            }
        };

        // Only include metrics link for active campaigns
        if (campaign.getStatus() === 'ACTIVE') {
            response._links.metrics = { 
                href: this.linkBuilder.buildResourceLink('campaign.metrics', { id: campaign.getId() })
            };
        }

        return response;
    }
}