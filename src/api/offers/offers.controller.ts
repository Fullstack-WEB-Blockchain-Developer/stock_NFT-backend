import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OfferEntity } from './entities/offer.entity';
import { HttpExceptionDto } from '../../dto/httpException.dto';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { UserEntity } from '../users/entities/user.entity';
import { OfferCurrencyTypeEntity } from './entities/offerCurrencyType.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../utils/multerOptions';
@ApiTags('Offers')
@Controller('api/offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @ApiOperation({
    summary: 'Make a sale offer',
    description:
      'Adds new sale offer for an NFT. Expiration date should be represented as a string in simplified extended ISO format. Auth token is required',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: OfferEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Provided data is invalid',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  createOffer(@Body() createOfferDto: CreateOfferDto, @Request() req) {
    const user: UserEntity = req.user.payload;

    return this.offersService.createOffer(createOfferDto, user);
  }

  @ApiOperation({
    summary: 'Accept a sale offer',
    description:
      'Accept a sale offer. Set status "accepted" to the provided offer. Auth token is required',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: OfferEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'NFT not found',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('accept/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the offer',
    schema: { type: 'integer' },
  })
  acceptOffer(@Request() req, @Param('id') id: string) {
    const user: UserEntity = req.user.payload;

    return this.offersService.acceptOffer(user, +id);
  }

  @ApiOperation({
    summary: 'Decline a sale offer',
    description:
      'Decline a sale offer. Set status "declined" to the provided offer. Auth token is required',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: OfferEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'NFT not found',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('decline/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the offer',
    schema: { type: 'integer' },
  })
  declineOffer(@Request() req, @Param('id') id: string) {
    const user: UserEntity = req.user.payload;

    return this.offersService.declineOffer(user, +id);
  }

  @ApiOperation({
    summary: 'Get all offers',
    description:
      'Returns array with all of the created offers. Admin access required',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: OfferEntity,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Get()
  getAllOffers() {
    return this.offersService.getAllOffers();
  }

  @ApiExcludeEndpoint()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }

  @ApiExcludeEndpoint()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offersService.update(+id, updateOfferDto);
  }
  @ApiExcludeEndpoint()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offersService.remove(+id);
  }

  @ApiOperation({
    summary: 'Add new currency type for offers',
    description: 'Adds new offer currency type. Admin access required',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: OfferCurrencyTypeEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Currency type already exists',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Post('/currencyTypes/:currencyType')
  @ApiParam({
    name: 'currencyType',
    required: true,
    description: 'Name of the currency type',
    schema: { type: 'string' },
  })
  addOfferCurrencyType(@Param('currencyType') currencyType: string) {
    return this.offersService.addOfferCurrencyType(currencyType);
  }

  @ApiOperation({
    summary: 'Add blockchain transaction hash to an offer',
    description: 'Adds blockchain transaction hash to an offer',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: OfferEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Currency type already exists',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Post('/:offerId/:transactionHash')
  @ApiParam({
    name: 'offerId',
    required: true,
    description: 'ID of the offer',
    schema: { type: 'integer' },
  })
  @ApiParam({
    name: 'transactionHash',
    required: true,
    description: 'Hash string of the completed transaction',
    schema: { type: 'string' },
  })
  addOfferHash(
    @Param('offerId') offerId: number,
    @Param('transactionHash') transactionHash: string,
  ) {
    if (!+offerId) {
      throw new HttpException('ID should be a number', HttpStatus.BAD_REQUEST);
    }
    return this.offersService.addOfferHash(offerId, transactionHash);
  }

  @ApiOperation({
    summary: 'Get all offer currency types',
    description: 'Returns all of the offer currency types',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: OfferCurrencyTypeEntity,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Get('/currencyTypes/all')
  getOfferCurrencyTypes() {
    return this.offersService.getOfferCurrencyTypes();
  }

  @ApiOperation({
    summary: 'Delete offer currency type',
    description:
      'Deletes offer currency type with provided id and return id of the deleted item. Admin access required',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: { example: '1' },
  })
  @ApiResponse({
    status: 404,
    description: 'Currency type not found',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Delete('/currencyTypes/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the currency type',
    schema: { type: 'integer' },
  })
  deleteOfferCurrencyTypeById(
    @Param('id')
    id: string,
  ) {
    if (!+id) {
      throw new HttpException('ID should be a number', HttpStatus.BAD_REQUEST);
    }

    return this.offersService.deleteOfferCurrencyTypeById(+id);
  }

  @ApiOperation({
    summary: 'Upload offer currency icon',
    description:
      'Uploads offer currency icon to the server, and updates it in currency "icon" field. File should be sent as FormData, with the "file" key. Files uploads to /assets/icons/ path. Admin access required',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    schema: { example: 'uuidGeneratedName.jpg' },
  })
  @ApiResponse({
    status: 401,
    description: 'Access denied',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 413,
    description: 'File too large. Max size: 10 mb.',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('currencyTypes/uploadIcon/:currencyId')
  @ApiParam({
    name: 'currencyId',
    required: true,
    description: 'ID of the currency type',
    schema: { type: 'integer' },
  })
  @UseInterceptors(
    FileInterceptor(
      'file',
      multerOptions('./uploads/icons', 1024 * 1024 * 10), //10 mb size limit
    ),
  )
  uploadCurrencyIcon(
    @UploadedFile() file: Express.Multer.File,
    @Param('currencyId')
    currencyId: string,
  ) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }
    if (!+currencyId) {
      throw new HttpException('ID should be a number', HttpStatus.BAD_REQUEST);
    }
    return this.offersService.uploadCurrencyIcon(file, +currencyId);
  }
}
