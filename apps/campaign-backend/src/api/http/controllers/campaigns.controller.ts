import { Controller, Post, Body } from '@nestjs/common';
import { IsString, IsEnum } from 'class-validator';
import { BusinessType } from '../../../domain/model/types.js';
import { CreateCampaignCommand } from '../../commands/CreateCampaign/Command.js';
import { CampaignRepository } from '../../../persistence/repositories/CampaignRepository.js';


export class CreateCampaignCommandPayload {
    @IsString()
    readonly id!: string;

    @IsString()
    readonly name!: string;

    @IsEnum(BusinessType)
    readonly businessType: BusinessType = BusinessType.STANDARD;
}

@Controller('campaigns')
export class CampaignsController {
    constructor(private readonly campaignRepository: CampaignRepository) {}

    @Post()
    async create(@Body() payload: CreateCampaignCommandPayload) {
        const command = new CreateCampaignCommand(this.campaignRepository);
        await command.execute(payload);
        return { success: true };
    }
}