import { endpoint as createCampaignEndpoint } from '../commands/CreateCampaign/endpoint.js';


// Allow different payloads and deps while maintaining type safety
export const endpoints = [
    createCampaignEndpoint
];