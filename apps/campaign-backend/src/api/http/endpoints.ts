
import { endpoint as createCampaignEndpoint } from '../commands/CreateCampaignCommand';


// Allow different payloads and deps while maintaining type safety
export const endpoints = [
    createCampaignEndpoint
];