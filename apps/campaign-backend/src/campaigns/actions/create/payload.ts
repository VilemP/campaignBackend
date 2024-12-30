import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsUUID, Length, IsNotEmpty } from 'class-validator';
import { BusinessProductType } from '../../../business-products/productTypes.js';


export class CreateCampaignPayload {
   
    @ApiProperty({ description: 'Campaign UUID', example: '304cedac-5af2-45a2-b8b7-0043abeee4e3'})
    @IsUUID(7, { message: 'Campaign ID must be a valid UUIDv4' })
    @IsNotEmpty()
    id!: string;
     
    @ApiProperty({ description: 'Campaign name', example: 'Name of the campaign', minLength: 3, maxLength: 100})
    @IsString()
    @IsNotEmpty()
    @Length(3, 100, { message: 'Campaign name must be between 3 and 100 characters' })
    name!: string;
    
    @ApiProperty({
        isArray: true,
        enum: BusinessProductType,
        example: `${Object.values(BusinessProductType).join('|')}`,
        default: BusinessProductType.STANDARD
    })
    @IsEnum(BusinessProductType, { 
        message: `Business type must be one of: ${Object.values(BusinessProductType).join(', ')}`
    })
    @IsNotEmpty()
    businessType: BusinessProductType = BusinessProductType.STANDARD;
}
