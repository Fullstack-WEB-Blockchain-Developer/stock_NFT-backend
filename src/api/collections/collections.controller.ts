import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { multerOptions } from '../../utils/multerOptions';
import { HttpExceptionDto } from '../../dto/httpException.dto';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { UserEntity } from '../users/entities/user.entity';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionEntity } from './entities/collection.entity';
import { CollectionPaymentTokenEntity } from './entities/collectionPaymentToken.entity';
@ApiTags('Collections')
@Controller('api/collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}
  // @ApiExcludeEndpoint()
  // @Post()
  // addCollection(@Body() createCollectionDto: CreateCollectionDto) {
  //   return this.collectionsService.addCollection(createCollectionDto);
  // }

  @ApiOperation({
    summary: 'Get all collections',
    description:
      'Returns array with all created collections. Admin access required.',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CollectionEntity,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Get('/all')
  getAllCollections() {
    return this.collectionsService.getAllCollections();
  }

  @ApiOperation({
    summary: 'Get all collections of the user',
    description:
      'Returns array with all of the user collections. Auth token required',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      example: [
        {
          id: 0,
          created: '2022-04-27T08:43:33.718Z',
          updatedAt: '2022-04-27T08:43:33.718Z',
          deletedAt: '2022-04-27T08:43:33.718Z',
          name: 'string',
          logoImage: 'string',
          featuredImage: 'string',
          bannerImage: 'string',
          url: 'string',
          description: 'string',
          websiteLink: 'string',
          discordLink: 'string',
          instagramLink: 'string',
          mediumLink: 'string',
          telegramLink: 'string',
          creatorEarnings: 0,
          displayTheme: 'string',
          IsSensitiveContent: true,
          collaborators: ['string'],
          listedNfts: 4,
          nfts: 11,
          auctionedNfts: 1,
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  getAllUserCollections(@Request() req) {
    const user: UserEntity = req.user.payload;
    return this.collectionsService.getAllUserCollections(user);
  }

  @ApiOperation({
    summary: 'Get collection by ID',
    description: 'Returns collection with provided ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CollectionEntity,
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
  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the collection',
    schema: { type: 'integer' },
  })
  @Get(':id')
  getCollectionById(@Param('id') id: string) {
    return this.collectionsService.getCollectionById(+id);
  }

  @ApiExcludeEndpoint()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionsService.update(+id, updateCollectionDto);
  }
  @ApiExcludeEndpoint()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collectionsService.remove(+id);
  }

  @ApiOperation({
    summary: 'Add new payment token for collections',
    description:
      'Adds new payment token for collections. Admin access required',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: CollectionPaymentTokenEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Payment token already exists',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Post('/paymentTokens/:paymentToken')
  @ApiParam({
    name: 'paymentToken',
    required: true,
    description: 'Name of the payment token',
    schema: { type: 'string' },
  })
  addCollectionPaymentToken(@Param('paymentToken') paymentToken: string) {
    return this.collectionsService.addCollectionPaymentToken(paymentToken);
  }

  @ApiOperation({
    summary: 'Delete collection payment token',
    description:
      'Deletes collection payment token with provided id and return id of the deleted item. Admin access required',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: { example: '1' },
  })
  @ApiResponse({
    status: 404,
    description: 'Payment token not found',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Delete('/paymentTokens/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the collection payment token',
    schema: { type: 'integer' },
  })
  deleteCollectionPaymentTokenById(
    @Param('id')
    id: string,
  ) {
    if (!+id) {
      throw new HttpException('ID should be a number', HttpStatus.BAD_REQUEST);
    }

    return this.collectionsService.deleteCollectionPaymentTokenById(+id);
  }

  @ApiOperation({
    summary: 'Get all available payment tokens for a collection',
    description: 'Returns all of the available payment tokens for a collection',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CollectionPaymentTokenEntity,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Get('/paymentTokens/all')
  getCollectionPaymentTokens() {
    return this.collectionsService.getCollectionPaymentTokens();
  }

  @ApiOperation({
    summary: 'Upload collection payment token icon',
    description:
      'Uploads collection payment token icon to the server, and updates it in collection payment token "icon" field. File should be sent as FormData, with the "file" key. Files uploads to /assets/icons/ path. Admin access required',
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
  @Post('currencyTypes/uploadIcon/:paymentTokenId')
  @ApiParam({
    name: 'paymentTokenId',
    required: true,
    description: 'ID of the collection payment token',
    schema: { type: 'integer' },
  })
  @UseInterceptors(
    FileInterceptor(
      'file',
      multerOptions('./uploads/icons', 1024 * 1024 * 10), //10 mb size limit
    ),
  )
  uploadPaymentTokenIcon(
    @UploadedFile() file: Express.Multer.File,
    @Param('paymentTokenId')
    paymentTokenId: string,
  ) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }
    if (!+paymentTokenId) {
      throw new HttpException('ID should be a number', HttpStatus.BAD_REQUEST);
    }
    return this.collectionsService.uploadPaymentTokenIcon(
      file,
      +paymentTokenId,
    );
  }
  @ApiOperation({
    summary: 'Add new category for collections',
    description: 'Adds new category for collections. Admin access required',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: CollectionPaymentTokenEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Category already exists',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Post('/categories/:category')
  @ApiParam({
    name: 'category',
    required: true,
    description: 'Name of the category',
    schema: { type: 'string' },
  })
  addCollectionCategory(@Param('category') category: string) {
    return this.collectionsService.addCollectionCategory(category);
  }

  @ApiOperation({
    summary: 'Get all available categories for a collection',
    description: 'Returns all of the available categories of a collection',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CollectionPaymentTokenEntity,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Get('/categories/all')
  getCollectionCategories() {
    return this.collectionsService.getCollectionCategories();
  }
  @ApiOperation({
    summary: 'Upload collection payment token icon',
    description:
      'Uploads collection payment token icon to the server, and updates it in collection payment token "icon" field. File should be sent as FormData, with the "file" key. Files uploads to /assets/icons/ path. Admin access required',
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
  @Post('categories/uploadIcon/:categoryId')
  @ApiParam({
    name: 'categoryId',
    required: true,
    description: 'ID of the collection category',
    schema: { type: 'integer' },
  })
  @UseInterceptors(
    FileInterceptor(
      'file',
      multerOptions('./uploads/icons', 1024 * 1024 * 10), //10 mb size limit
    ),
  )
  uploadCollectionCategoryIcon(
    @UploadedFile() file: Express.Multer.File,
    @Param('categoryId')
    categoryId: string,
  ) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }
    if (!+categoryId) {
      throw new HttpException('ID should be a number', HttpStatus.BAD_REQUEST);
    }
    return this.collectionsService.uploadCollectionCategoryIcon(
      file,
      +categoryId,
    );
  }
}
