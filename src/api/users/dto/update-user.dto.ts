import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'Username', required: false })
  @IsOptional()
  @IsString({ message: 'Should be a string' })
  @MaxLength(140)
  username?: string;

  @ApiProperty({ description: "User's bio", required: false })
  @IsOptional()
  @IsString({ message: 'Should be a string' })
  @MaxLength(140)
  bio: string;

  @ApiProperty({ description: "User's email", required: false })
  @IsOptional()
  @IsEmail()
  @MaxLength(140)
  email: string;

  @ApiProperty({
    description: "Link to the user's Twitter account",
    required: false,
  })
  @IsOptional()
  @MaxLength(140)
  twitterLink: string;

  @ApiProperty({
    description: "Link to the user's Instagram account",
    required: false,
  })
  @IsOptional()
  @MaxLength(140)
  instagramLink: string;

  @ApiProperty({
    description: "Link to the user's website",
    required: false,
  })
  @IsOptional()
  @MaxLength(140)
  websiteLink: string;
}
