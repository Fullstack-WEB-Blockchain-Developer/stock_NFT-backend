import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({ description: 'Public address' })
  @IsNotEmpty()
  @IsString({ message: 'Should be a string' })
  readonly publicAddress: string;

  @ApiProperty({ description: 'Signature' })
  @IsNotEmpty()
  @IsString({ message: 'Should be a string' })
  readonly signature: string;
}
