import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Check if server is on' })
  @ApiResponse({
    status: 200,
    schema: { example: 'Hello, world!' },
  })
  @Get('/api')
  getHello(): string {
    return this.appService.getHello();
  }
}
