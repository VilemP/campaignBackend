import { IsString, IsEnum, IsUUID, Length, IsNotEmpty } from 'class-validator';
import { BusinessProductType } from '../../../business-products/productTypes.js';


export class CreateCampaignPayload {
    @IsUUID(7, { message: 'Campaign ID must be a valid UUIDv4' })
    @IsNotEmpty()
    id!: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 100, { message: 'Campaign name must be between 3 and 100 characters' })
    name!: string;

    @IsEnum(BusinessProductType, { 
        message: `Business type must be one of: ${Object.values(BusinessProductType).join(', ')}`
    })
    @IsNotEmpty()
    businessType: BusinessProductType = BusinessProductType.STANDARD;
}
