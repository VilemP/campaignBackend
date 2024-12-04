import { HttpEndpoint } from './types';
import { endpoint as createCampaign } from '../commands/CreateCampaignCommand';

export const endpoints: HttpEndpoint[] = [
    createCampaign
];