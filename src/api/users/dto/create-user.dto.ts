import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Public address' })
  @IsNotEmpty()
  @IsString({ message: 'Should be a string' })
  @MaxLength(132)
  publicAddress: string;
  @ApiProperty({
    description: 'Username. Optional parameter.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Should be a string' })
  @MaxLength(45)
  username?: string;
}
