
import { CommandHttpEndpoint } from '@libs/rest-api';
import { endpoint as createCampaign } from '../commands/CreateCampaignCommand';

export const endpoints: CommandHttpEndpoint[] = [
    createCampaign
];