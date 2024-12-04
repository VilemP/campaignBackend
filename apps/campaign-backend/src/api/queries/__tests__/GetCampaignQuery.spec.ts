import { GetCampaignQuery } from '../GetCampaignQuery';
import { Campaign } from '../../../domain/model/Campaign';
import { EntityNotFoundError } from '../../../domain/errors/DomainErrors';
import { LinkBuilder } from '@campaign-backend/api/rest';
import { ValidationError } from '@campaign-backend/api/core';

describe('GetCampaignQuery', () => {
    const mockCampaign = {
        getId: () => '123e4567-e89b-12d3-a456-426614174000',
        getName: () => 'Test Campaign',
        getStatus: () => 'ACTIVE',
    } as Campaign;

    const mockRepository = {
        findById: jest.fn(),
    };

    const mockLinkBuilder = {
        buildResourceLink: jest.fn(),
    } as jest.Mocked<LinkBuilder>;

    beforeEach(() => {
        jest.resetAllMocks();
        mockLinkBuilder.buildResourceLink
            .mockImplementation((resource, params) => 
                `http://api.example.com/${resource}/${params.id}`);
    });

    describe('input validation', () => {
        it('should accept valid UUID', () => {
            expect(() => new GetCampaignQuery(
                { id: '123e4567-e89b-12d3-a456-426614174000' },
                mockRepository,
                mockLinkBuilder
            )).not.toThrow();
        });

        it('should reject invalid UUID', () => {
            expect(() => new GetCampaignQuery(
                { id: 'not-a-uuid' },
                mockRepository,
                mockLinkBuilder
            )).toThrow(ValidationError);
        });
    });

    describe('execute', () => {
        it('should return campaign with self link', async () => {
            mockRepository.findById.mockResolvedValue(mockCampaign);

            const query = new GetCampaignQuery(
                { id: '123e4567-e89b-12d3-a456-426614174000' },
                mockRepository,
                mockLinkBuilder
            );

            const result = await query.execute();

            expect(result).toEqual({
                id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'Test Campaign',
                status: 'ACTIVE',
                _links: {
                    self: { href: 'http://api.example.com/campaign/123e4567-e89b-12d3-a456-426614174000' },
                    metrics: { href: 'http://api.example.com/campaign.metrics/123e4567-e89b-12d3-a456-426614174000' }
                }
            });
        });

        it('should not include metrics link for non-active campaigns', async () => {
            mockRepository.findById.mockResolvedValue({
                ...mockCampaign,
                getStatus: () => 'PAUSED'
            });

            const query = new GetCampaignQuery(
                { id: '123e4567-e89b-12d3-a456-426614174000' },
                mockRepository,
                mockLinkBuilder
            );

            const result = await query.execute();

            expect(result._links.metrics).toBeUndefined();
        });

        it('should throw EntityNotFoundError when campaign does not exist', async () => {
            mockRepository.findById.mockResolvedValue(null);

            const query = new GetCampaignQuery(
                { id: '123e4567-e89b-12d3-a456-426614174000' },
                mockRepository,
                mockLinkBuilder
            );

            await expect(query.execute()).rejects.toThrow(EntityNotFoundError);
        });
    });

    describe('output validation', () => {
        it('should validate response structure', async () => {
            // Mock repository to return invalid campaign data
            mockRepository.findById.mockResolvedValue({
                ...mockCampaign,
                getStatus: () => 'INVALID_STATUS' // This should fail validation
            });

            const query = new GetCampaignQuery(
                { id: '123e4567-e89b-12d3-a456-426614174000' },
                mockRepository,
                mockLinkBuilder
            );

            await expect(query.execute()).rejects.toThrow();
        });
    });
});