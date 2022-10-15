import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { BaseEntity } from '../../../entities/base.entity';

export class CreateCollectionDto extends BaseEntity {
  @ApiProperty({ description: 'Public address' })
  @IsNotEmpty()
  @IsString({ message: 'Should be a string' })
  @MaxLength(45)
  name: string;
}
