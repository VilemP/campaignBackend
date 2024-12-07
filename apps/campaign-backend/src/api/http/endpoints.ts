import { endpoint as createCampaignEndpoint } from '../commands/CreateCampaignCommand.js';


// Allow different payloads and deps while maintaining type safety
export const endpoints = [
    createCampaignEndpoint
];