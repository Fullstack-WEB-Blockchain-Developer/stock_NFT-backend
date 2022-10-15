import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { NftsService } from './nfts.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NftEntity } from './entities/nft.entity';
import { HttpExceptionDto } from '../../dto/httpException.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { UserEntity } from '../users/entities/user.entity';
import { multerOptions } from '../../utils/multerOptions';
import { BlockchainTypeEntity } from './entities/blockchainType.entity';

@ApiTags('NFT')
@Controller('api/nfts')
export class NftsController {
  constructor(private readonly nftsService: NftsService) {}

  @ApiOperation({
    summary: 'Add new NFT',
    description:
      'Adds new NFT to the server. NFT media should be uploaded first, received name of the file is required. Needs bearer auth token of the account on which token should be created',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: NftEntity,
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
  addNft(@Body() createNftDto: CreateNftDto, @Request() req) {
    const user: UserEntity = req.user.payload;
    return this.nftsService.addNft(user, createNftDto);
  }

  @ApiOperation({
    summary: 'Upload NFT media',
    description:
      'Uploads NFT media to the server and returns the name with which it can be accessed. Files uploads to /assets/nftMedia/ path',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    schema: { example: 'uuidGeneratedName.jpg' },
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('upload/media')
  @UseInterceptors(
    FileInterceptor(
      'content',
      multerOptions('./uploads/nftMedia', 1024 * 1024 * 100),
    ),
  )
  uploadNftMedia(@UploadedFile() content: Express.Multer.File, @Request() req) {
    if (!content) {
      throw new HttpException(
        'No nft content provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user: UserEntity = req.user.payload;
    return this.nftsService.uploadMedia(content.filename, user);
  }

  @ApiOperation({
    summary: 'Get all NFTs',
    description:
      'Returns array with all of the created NFTs. Admin access required',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: NftEntity,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Get()
  getAllNfts() {
    return this.nftsService.getAllNfts();
  }

  @ApiOperation({
    summary: 'Get all NFTs ID',
    description: 'Returns array with IDs of all created NFTs',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: NftEntity,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Get('/ids')
  getAllNftsId() {
    return this.nftsService.getAllNftsId();
  }

  @ApiOperation({
    summary: 'Get NFT by ID',
    description:
      'Returns NFT with provided ID. Also returns frequency of appearence in collection for every NFT property as a two-digit fraction from 0 to 1',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      example: {
        id: 67,
        created: '2022-04-11T12:07:18.520Z',
        updatedAt: '2022-04-11T12:07:18.520Z',
        deletedAt: null,
        name: 'test',
        fileName: '7c573160-4dc6-4805-871b-16041ae6fefa.jpg',
        nftMediaLink: null,
        externalLink: null,
        description: 'test descr',
        properties: [
          {
            id: 'dasf',
            name: 'smth',
            type: 'red',
            frequency: 0.29,
          },
          {
            id: 'dasf',
            name: 'smth',
            type: 'adfsf',
            frequency: 0.29,
          },
        ],
        levels: [
          {
            id: '7c573160-4dc6-4805-871b-16041ae6fefa',
            name: 'Speed',
            maxValue: 5,
            nftValue: 3,
          },
        ],
        stats: [
          {
            id: 'smth',
            name: 'Speed',
            maxValue: 5,
            nftValue: 3,
          },
          {
            id: 'smth',
            name: 'Speed',
            maxValue: 5,
            nftValue: 3,
          },
        ],
        unlockableContent: null,
        isSensitiveContent: true,
        isAssetBacked: true,
        status: 'pending',
        user: {
          id: 2,
          username: 'CorrecatUser',
        },
        blockchainType: {
          name: 'Etherium',
        },
        collection: {
          id: 100,
          name: 'Unnamed collection #100',
          logoImage: null,
          url: null,
          description: null,
          category: {
            name: 'Art',
          },
        },
        offers: [
          {
            id: 45,
            created: '2022-04-19T06:11:44.166Z',
            updatedAt: '2022-04-19T06:11:44.166Z',
            deletedAt: null,
            price: 0.0001,
            expirationDate: '2022-04-22',
            status: 'pending',
            buyer: {
              username: 'Test user',
              publicAddress: '0xa76B6373406a8E8C367d4fd5e9E70aF36536A11D',
            },
            seller: {
              username: 'Test user 2',
              publicAddress: '0xa76B6373406a8E8C367d4fd5e9E70aF36536A12D',
            },
          },
        ],
      },
    },
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
    description: 'ID of the NFT',
    schema: { type: 'integer' },
  })
  getNftById(@Param('id') id: string) {
    return this.nftsService.getNftById(+id);
  }

  @ApiOperation({
    summary: 'Get NFT metadata by ID',
    description: 'Returns metadata of NFT with provided ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      example: {
        id: 66,
        created: '2022-04-11T08:45:23.359Z',
        updatedAt: '2022-04-11T08:45:23.359Z',
        deletedAt: null,
        name: 'test',
        fileName: '7c573160-4dc6-4805-871b-16041ae6fefa.jpg',
        nftMediaLink: null,
        externalLink: null,
        description: 'test descr',
        properties: [
          {
            id: 'OptionalidForFrontend',
            name: 'smth',
            type: 'red',
            frequency: 0.29,
          },
          {
            id: 'OptionalidForFrontend',
            name: 'smth',
            type: 'smth',
            frequency: 0.29,
          },
        ],
        levels: [
          {
            id: '7c573160-4dc6-4805-871b-16041ae6fefa',
            name: 'Speed',
            maxValue: 5,
            nftValue: 3,
          },
        ],
        stats: [
          {
            id: 'smth',
            name: 'Speed',
            maxValue: 5,
            nftValue: 3,
          },
          {
            id: 'smth',
            name: 'Speed',
            maxValue: 5,
            nftValue: 3,
          },
        ],
        unlockableContent: null,
        isSensitiveContent: true,
        isAssetBacked: true,
        status: 'pending',
        user: {
          id: 1,
          username: 'username',
        },
        blockchainType: {
          name: 'Etherium',
        },
        collection: {
          id: 100,
          name: 'Unnamed collection #100',
          logoImage: null,
          url: null,
          description: null,
        },
        offers: [
          {
            id: 11,
            created: '2022-04-13T05:44:29.200Z',
            updatedAt: '2022-04-13T05:44:29.200Z',
            deletedAt: null,
            price: 0.22,
            expirationDate: '2012-04-22T18:00:00.000Z',
            status: 'pending',
            user: {
              username: 'anotherUsername',
              publicAddress: '0xa76B6373406a8E8C367d4fd5e9E70aF36536A10D',
            },
          },
          {
            id: 12,
            created: '2022-04-13T05:44:34.195Z',
            updatedAt: '2022-04-13T05:44:34.195Z',
            deletedAt: null,
            price: 0.22,
            expirationDate: '2012-04-22T18:00:00.000Z',
            status: 'pending',
            user: {
              username: 'anotherUsername2',
              publicAddress: '0xa76B6373406a8E8C367d4fd5e9E70aF36536A10D',
            },
          },
        ],
      },
    },
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
  @Get('metadata/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the NFT',
    schema: { type: 'integer' },
  })
  getNftMetadataById(@Param('id') id: string) {
    return this.nftsService.getNftMetadataById(+id);
  }

  @ApiOperation({
    summary: 'Update NFT by ID',
    description: 'Updates NFT by provided ID',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: NftEntity,
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
  @Patch(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the NFT',
    schema: { type: 'integer' },
  })
  updateNftById(@Param('id') id: string, @Body() updateNftDto: UpdateNftDto) {
    if (!+id) {
      throw new HttpException('ID should be a number', HttpStatus.BAD_REQUEST);
    }
    return this.nftsService.updateNftById(+id, updateNftDto);
  }

  @ApiOperation({
    summary: 'Delete NFT by ID',
    description:
      'Deletes NFT with provided ID. Auth token of the NFT owner is needed',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: NftEntity,
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
  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the NFT',
    schema: { type: 'integer' },
  })
  deleteNftById(@Param('id') id: string) {
    if (!+id) {
      throw new HttpException('ID should be a number', HttpStatus.BAD_REQUEST);
    }
    return this.nftsService.deleteNftById(+id);
  }

  @ApiOperation({
    summary: 'Add new blockchain type',
    description: 'Adds new blockchain type. Admin access required',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: BlockchainTypeEntity,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Post('/blockchainTypes/:blockchainType')
  @ApiParam({
    name: 'blockchainType',
    required: true,
    description: 'Name of the blockchain type',
    schema: { type: 'string' },
  })
  addBlockchainType(@Param('blockchainType') blockchainType: string) {
    return this.nftsService.addBlockchainType(blockchainType);
  }

  @ApiOperation({
    summary: 'Get all blockchain types',
    description: 'Returns all of the blockchain types',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: BlockchainTypeEntity,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Get('/blockchainTypes/all')
  getBlockchainTypes() {
    return this.nftsService.getBlockchainTypes();
  }

  @ApiOperation({
    summary: 'Delete blockchain type',
    description:
      'Deletes blockchain type with provided id and return id of the deleted item. Admin access required',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: { example: '1' },
  })
  @ApiResponse({
    status: 400,
    description: 'Type already exists',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Delete('/blockchainTypes/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the blockchain type',
    schema: { type: 'integer' },
  })
  deleteBlockchainTypeById(
    @Param('id')
    id: string,
  ) {
    if (!+id) {
      throw new HttpException('ID should be a number', HttpStatus.BAD_REQUEST);
    }

    return this.nftsService.deleteBlockchainTypeById(+id);
  }
  @ApiOperation({
    summary: 'Upload blockchain type icon',
    description:
      'Uploads blockchain type icon to the server, and updates it in currency "icon" field. File should be sent as FormData, with the "file" key. Files uploads to /assets/icons/ path. Admin access required',
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
  @Post('blockchainTypes/uploadIcon/:blockchainTypeId')
  @ApiParam({
    name: 'blockchainTypeId',
    required: true,
    description: 'ID of the blockchain type',
    schema: { type: 'integer' },
  })
  @UseInterceptors(
    FileInterceptor(
      'file',
      multerOptions('./uploads/icons', 1024 * 1024 * 10), //10 mb size limit
    ),
  )
  uploadBlockchainTypeIcon(
    @UploadedFile() file: Express.Multer.File,
    @Param('blockchainTypeId')
    blockchainTypeId: string,
  ) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }
    if (!+blockchainTypeId) {
      throw new HttpException('ID should be a number', HttpStatus.BAD_REQUEST);
    }
    return this.nftsService.uploadBlockchainTypeIcon(file, +blockchainTypeId);
  }
}
