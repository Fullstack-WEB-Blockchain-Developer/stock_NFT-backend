import { ApiProperty } from '@nestjs/swagger';

export class HttpExceptionDto {
  @ApiProperty({ description: 'Status code' })
  readonly statusCode: number;

  @ApiProperty({ description: 'Error description' })
  readonly message: string;
}
