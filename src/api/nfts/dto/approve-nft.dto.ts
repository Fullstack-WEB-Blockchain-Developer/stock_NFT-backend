import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateNftDto {
  @ApiProperty({ description: 'Name of the NFT', required: true })
  @IsNotEmpty()
  @IsNumber({}, { message: 'NFT ID should be an integer' })
  nftId: number;
}
