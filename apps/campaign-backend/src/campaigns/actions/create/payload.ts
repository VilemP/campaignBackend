import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsUUID, Length, IsNotEmpty } from 'class-validator';
import { BusinessProductType } from '../../../business-products/productTypes.js';


export class CreateCampaignPayload {
    private static readonly nameMinLength: number = 3;
    private static readonly nameMaxLength = 100;
    private static readonly productTypeList = Object.values(BusinessProductType).join(', ');

    @ApiProperty({ 
        description: 'Campaign UUID', 
        example: '304cedac-5af2-45a2-b8b7-0043abeee4e3'
    })
    @IsUUID(7, { message: 'Campaign ID must be a valid UUIDv4' })
    @IsNotEmpty()
    id!: string;
     
    @ApiProperty({
        description: 'Campaign name',
        example: 'Name of the campaign',
        minLength: CreateCampaignPayload.nameMinLength,
        maxLength: CreateCampaignPayload.nameMaxLength
    })
    @IsString()
    @IsNotEmpty()
    @Length(
        CreateCampaignPayload.nameMinLength,
        CreateCampaignPayload.nameMaxLength,
        { message: `Campaign name must be between ${CreateCampaignPayload.nameMinLength} and ${CreateCampaignPayload.nameMaxLength} characters` }
    )
    name!: string;
    
    @ApiProperty({
        isArray: true,
        enum: BusinessProductType,
        example: CreateCampaignPayload.productTypeList,
        default: BusinessProductType.STANDARD
    })
    @IsEnum(BusinessProductType, { 
        message: `Business type must be one of: ${CreateCampaignPayload.productTypeList}`
    })
    @IsNotEmpty()
    businessType: BusinessProductType = BusinessProductType.STANDARD;
}
