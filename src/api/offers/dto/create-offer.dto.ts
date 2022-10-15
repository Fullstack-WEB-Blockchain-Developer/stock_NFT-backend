import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateOfferDto {
  @ApiProperty({ description: 'NFT price', required: true })
  @IsNumber({}, { message: 'Price name should be a number' })
  price: number;

  @ApiProperty({
    description: 'Current property value of the NFT',
    required: true,
  })
  @IsString({ message: 'Expiration date should be a string' })
  expirationDate: string;

  @ApiProperty({
    description: 'ID of a NFT',
    required: true,
  })
  @IsNumber({}, { message: 'Id of a NFT should be a number' })
  nftId: number;

  @ApiProperty({
    description: 'ID of the currency of the offer',
    required: true,
  })
  @IsNumber({}, { message: 'Currency id should be a number' })
  currencyId: number;
}
