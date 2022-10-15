import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class currentMaxValueProperty {
  @ApiProperty({ description: 'Name of the property', required: true })
  @IsString({ message: 'Property name should be a string' })
  name: string;

  @ApiProperty({
    description: 'Current property value of the NFT',
    required: true,
  })
  @IsNumber({}, { message: 'Property nft value should be a number' })
  nftValue: number;

  @ApiProperty({
    description: 'Maximum property value of the NFT',
    required: true,
  })
  @IsNumber({}, { message: 'Property max value should be a number' })
  maxValue: number;

  @ApiProperty({
    description:
      'Generated id of the element. Needed to identify property on frontend ',
    required: true,
  })
  @IsString({ message: 'Property id should be a string' })
  id: string;
}

export class property {
  @IsString({ message: 'Property name should be a string' })
  name: string;

  @IsString({ message: 'Property type should be a string' })
  type: string;

  @ApiProperty({
    description:
      'Generated id of the element. Needed to identify property on frontend ',
    required: true,
  })
  @IsString({ message: 'Property id should be a string' })
  id: string;
}
export class CreateNftDto {
  @ApiProperty({ description: 'Name of the NFT', required: true })
  @IsNotEmpty()
  @IsString({ message: 'Should be a string' })
  name: string;

  @ApiProperty({
    description: 'External link that will be displayed to another users',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Should be a string' })
  externalLink: string;

  @ApiProperty({
    description: 'Name of the uploaded file',
    required: true,
  })
  @IsNotEmpty()
  @IsString({ message: 'fileName should be a string ' })
  fileName: string;

  @ApiProperty({ description: 'NFT description', required: true })
  @IsOptional()
  @IsString({ message: 'Should be a string' })
  description: string;

  @ApiProperty({
    description: 'NFT properties',
    example: [{ type: 'Hair color', name: 'Red' }],
    required: false,
    isArray: true,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => property)
  properties: property[];

  @ApiProperty({
    description: 'NFT levels',
    example: [
      {
        name: 'Speed',
        nftValue: 3,
        maxValue: 5,
        id: '7c573160-4dc6-4805-871b-16041ae6fefa',
      },
    ],
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => currentMaxValueProperty)
  levels: currentMaxValueProperty[];

  @ApiProperty({
    description: 'NFT stats',
    example: [{ name: 'Speed', nftValue: 3, maxValue: 5 }],
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => currentMaxValueProperty)
  stats: currentMaxValueProperty[];

  @ApiProperty({
    description: 'NFT unlockable content (access key, link and etc.)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'unlockableContent should be a string' })
  unlockableContent: string;

  @ApiProperty({
    description: 'Explicit and Sensitive Content presence',
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isSensitiveContent should be a boolean' })
  isSensitiveContent: boolean;

  @ApiProperty({
    description: 'NFT asset-backed property',
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isAssetBacked should be a boolean' })
  isAssetBacked?: boolean;

  @ApiProperty({
    description: 'NFT blockchain type id',
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  blockchainTypeId!: string | number;

  @ApiProperty({
    description: 'Collection ID',
    required: false,
    type: Number,
  })
  @IsOptional()
  collectionId?: string;
}
