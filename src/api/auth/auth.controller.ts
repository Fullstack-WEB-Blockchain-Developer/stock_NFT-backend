import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwtAuth.guard';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'User authentication',
    description:
      'User authentication, checks public address of a wallet by sent signature.  Returns a JWT token, which contains user info',
  })
  @ApiResponse({
    status: 200,
    description: 'User is succesfully authenticated',
    schema: {
      example: { token: 'JWT token' },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Provided data is invalid',
    schema: {
      example: {
        statusCode: 400,
        message: 'Signature should be a string',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'User information is missing or invalid',
    schema: {
      example: {
        statusCode: 401,
        message: 'User information is missing or invalid',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error occured',
      },
    },
  })
  @Post()
  auth(@Body() authDto: AuthDto): Promise<{ token: string }> {
    return this.authService.auth(authDto);
  }

  @ApiOperation({
    summary: 'User verification',
    description:
      "Verifies bearer auth token of a user. Returns refreshed JWT token with user's id and public address in body",
  })
  @ApiResponse({
    status: 200,
    description: "User's token is validated",
    schema: {
      example: { token: 'JWT token' },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token is invalid',
    schema: {
      example: {
        statusCode: 401,
        message: 'Access denied',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error occured',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('verifyUser')
  verify(@Req() req) {
    return this.authService.verify(req.user.payload);
  }
}
