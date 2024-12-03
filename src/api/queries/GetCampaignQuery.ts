import { Query } from '../Types';
import { Schema } from '../validation/Schemas';
import { z } from 'zod';
import { CampaignRepository } from '../../domain/repositories/CampaignRepository';
import { LinkBuilder } from '../http/Links';
import { EntityNotFoundError } from '../../domain/Errors';
import { Campaign } from '../../domain/model/Campaign';

export interface CampaignResponse {
    id: string;
    name: string;
    status: string;
    _links: {
        self: { href: string };
        metrics?: { href: string };
    };
}

const inputSchema = Schema.input(
    z.object({
        id: z.string().uuid(),
    })
);

const outputSchema = Schema.output(
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

export class GetCampaignQuery implements Query<CampaignResponse> {
    constructor(
        private readonly payload: unknown,
        private readonly campaignRepository: CampaignRepository,
        private readonly linkBuilder: LinkBuilder
    ) {
        this.payload = inputSchema.validate(payload);
    }

    async execute(): Promise<CampaignResponse> {
        const campaign = await this.campaignRepository.findById(this.payload.id);
        if (!campaign) {
            throw new EntityNotFoundError('Campaign', this.payload.id);
        }

        const response: CampaignResponse = {
            id: campaign.getId(),
            name: campaign.getName(),
            status: campaign.getStatus(),
            _links: {
                self: { 
                    href: this.linkBuilder.buildResourceLink('campaign', { id: campaign.getId() })
                }
            }
        };

        if (campaign.getStatus() === 'ACTIVE') {
            response._links.metrics = { 
                href: this.linkBuilder.buildResourceLink('campaign.metrics', { id: campaign.getId() })
            };
        }

        return outputSchema.validate(response);
    }
}