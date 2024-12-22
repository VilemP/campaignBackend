import { IsString, IsEnum } from 'class-validator';
import { BusinessType } from '../../../../domain/model/types.js';

export class CreateCampaignData {
    @IsString()
    id!: string;

    @IsString()
    name!: string;

    @IsEnum(BusinessType)
    businessType: BusinessType = BusinessType.STANDARD;
}
