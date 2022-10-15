import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpExceptionDto } from '../../dto/httpException.dto';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { multerOptions } from '../../utils/multerOptions';
import {
  userSortOrderOptions,
  userAssetTabs,
  userSortOptions,
  userFilterStatuses,
  priceFilterOptions,
} from '../../utils/enums';
import { UserAssetsQueryDto } from './dto/userAssetsQuery.dto';
@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Add new user', description: 'Adds new user' })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: UserEntity,
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
  @Post()
  addUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.addUser(createUserDto);
  }

  @ApiOperation({
    summary: 'Username check',
    description: 'Checks if username is taken',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    schema: { example: { exists: true } },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Get('/checkUsername/:username')
  @ApiParam({
    name: 'username',
    required: true,
    description: 'Username',
    schema: { type: 'string' },
  })
  checkUsername(@Param('username') username: string) {
    return this.usersService.checkUsername(username);
  }

  @ApiOperation({
    summary: 'Check transfer approval status',
    description: 'Checks if user completed transfer approval',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    schema: { example: { isTransferApproved: true } },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/checkTransferApproval')
  checkTransferApproval(@Request() req) {
    const user: UserEntity = req.user.payload;
    return this.usersService.checkTransferApproval(user);
  }

  @ApiOperation({
    summary: 'Email check',
    description: 'Checks if provided email is taken',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    schema: { example: { exists: true } },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Get('/checkEmail/:email')
  @ApiParam({
    name: 'email',
    required: true,
    description: "User's email",
    schema: { type: 'string' },
  })
  checkEmail(@Param('email') email: string) {
    return this.usersService.checkEmail(email);
  }

  @ApiOperation({
    summary: 'Get all users',
    description:
      'Returns array with info about all of the users. Admin access required.',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UserEntity,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Get()
  getAllUsers(): Promise<UserEntity[]> {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({
    summary: 'Get user info if one exists, else create one',
    description:
      'This endpoint returns user info if user exists, or creates a user if one not found, and returns the info',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UserEntity,
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
  @Post(':publicAddress')
  @ApiParam({
    name: 'publicAddress',
    required: true,
    description: 'User wallet public address',
    schema: { type: 'string' },
  })
  getOrCreateUserByAddress(@Param('publicAddress') publicAddress: string) {
    return this.usersService.getOrCreateUserByAddress(publicAddress);
  }

  @ApiOperation({
    summary: 'Get user by public address',
    description:
      'Returns info about the user with provided crypto wallet public address',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Get(':publicAddress')
  @ApiParam({
    name: 'publicAddress',
    required: true,
    description: 'User wallet public address',
    schema: { type: 'string' },
  })
  getUserByAddress(@Param('publicAddress') publicAddress: string) {
    return this.usersService.getUserByAddress(publicAddress);
  }

  @ApiOperation({
    summary: 'Get user assets',
    description: 'Returns user assets, according to query',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      examples: [
        {
          publicAddress: 'test',
          favoritedNfts: 0,
          createdNfts: 4,
          ownedNfts: 4,
          totalValue: null,
          maxValue: null,
          data: [
            {
              id: 66,
              created: '2022-04-11T08:45:23.359Z',
              updatedAt: '2022-04-20T12:21:45.534Z',
              deletedAt: null,
              name: 'test',
              fileName: '7c573160-4dc6-4805-871b-16041ae6fefa.jpg',
              nftMediaLink: null,
              externalLink: null,
              description: 'test descr',
              properties: [
                {
                  id: 'test',
                  name: 'hair',
                  type: 'red',
                },
                {
                  id: 'test',
                  name: 'hair',
                  type: 'adfsf',
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
            },
            {
              id: 70,
              created: '2022-04-21T11:12:50.009Z',
              updatedAt: '2022-04-21T11:12:50.009Z',
              deletedAt: null,
              name: 'test',
              fileName: 'fd98109f-b980-49a1-80ed-8f14e18855e8.jpg',
              nftMediaLink: null,
              externalLink: null,
              description: 'test descr',
              properties: null,
              levels: null,
              stats: null,
              unlockableContent: null,
              isSensitiveContent: false,
              isAssetBacked: true,
              status: 'pending',
            },
          ],
        },
        {
          status: 200,
          message: 'No data',
        },
      ],
    },
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
  @Get('account/assets')
  @ApiQuery({
    name: 'tab',
    required: false,
    description: 'User assets tab',
    enum: userAssetTabs,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Parameter by which results should be sorted',
    enum: userSortOptions,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Order of sorting',
    enum: userSortOrderOptions,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Status to filter by, can be sent separated by comma',
    enum: userFilterStatuses,
  })
  @ApiQuery({
    name: 'priceFilterType',
    required: false,
    description: 'Type of price currency',
    enum: priceFilterOptions,
  })
  @ApiQuery({
    name: 'priceFilterMin',
    required: false,
    description: 'Min value of price filter',
    schema: { type: 'number' },
  })
  @ApiQuery({
    name: 'priceFilterMax',
    required: false,
    description: 'Max value of price filter',
    schema: { type: 'number' },
  })
  @ApiQuery({
    name: 'collectionId',
    required: false,
    description: 'Id of a collection, can be sent separated by comma',
    schema: { type: 'number' },
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Id of a category, can be sent separated by comma',
    schema: { type: 'number' },
  })
  @ApiQuery({
    name: 'paymentTokenId',
    required: false,
    description:
      'Id of a collection payment token, can be sent separated by comma',
    schema: { type: 'number' },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of tokens to send',
    schema: { type: 'number' },
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Number of tokens to skip',
    schema: { type: 'number' },
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getAccountAssets(
    @Query() userAssetsQueryDto: UserAssetsQueryDto,
    @Request() req,
  ) {
    const user: UserEntity = req.user.payload;
    return this.usersService.getAccountAssets(userAssetsQueryDto, user);
  }

  @ApiOperation({
    summary: 'Get user by id',
    description: 'Returns info of the user with provided id',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Get('id/:userId')
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'User id',
    schema: { type: 'integer' },
  })
  getUserById(@Param('userId') id: string): Promise<UserEntity> {
    return this.usersService.getUserById(Number(id));
  }

  @ApiOperation({
    summary: 'Update user by public address',
    description:
      'Updates user with provided crypto wallet public address. Needs bearer auth token of the account owner.',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Patch(':publicAddress')
  @ApiParam({
    name: 'publicAddress',
    required: true,
    description: 'User wallet public address',
    schema: { type: 'string' },
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateUser(
    @Param('publicAddress') publicAddress: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(publicAddress, updateUserDto);
  }

  @ApiOperation({
    summary: 'Delete user by public address',
    description:
      'Deletes user with provided crypto wallet public address. Admin access required',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @Delete(':publicAddress')
  @ApiParam({
    name: 'publicAddress',
    required: true,
    description: 'User wallet public address',
    schema: { type: 'string' },
  })
  deleteUser(@Param('publicAddress') publicAddress: string) {
    return this.usersService.deleteUser(publicAddress);
  }

  @ApiOperation({
    summary: 'Restore user by public address',
    description:
      'Restores user with provided crypto wallet public address. Returns public address of the restored user',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: { example: '0xa76B6373406a8E8C367d4fd5e9E70aF36536A10D' },
  })
  @ApiResponse({
    status: 400,
    description: 'User is not deleted',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @ApiBearerAuth()
  @Get('/restore/:publicAddress')
  @ApiParam({
    name: 'publicAddress',
    required: true,
    description: 'User wallet public address',
    schema: { type: 'string' },
  })
  restoreUser(@Param('publicAddress') publicAddress: string) {
    return this.usersService.restoreUser(publicAddress);
  }

  @ApiOperation({
    summary: 'Upload user profile photo',
    description:
      'Uploads user profile image to the server, and updates it in user "profileImage" field. File should be sent as FormData, with the "file" key. Files uploads to /assets/profileImages/ path. Needs bearer auth token of the account owner.',
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
    description: 'File too large. Max size: 80 mb.',
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('upload/profileImage')
  @UseInterceptors(
    FileInterceptor(
      'file',
      multerOptions('./uploads/profileImages', 1024 * 1024 * 80), //80 mb size limit
    ),
  )
  uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    const user: UserEntity = req.user.payload;
    return this.usersService.uploadProfileImage(user, file);
  }

  @ApiOperation({
    summary: 'Upload user profile banner',
    description:
      'Uploads user profile banner to the server, and updates it in user "profileBanner" field. File should be sent as FormData, with the "file" key. Files uploads to /assets/profileBanners/ path. Needs bearer auth token of the account owner.',
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
    description: 'File too large. Max size: 80 mb.',
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('upload/profileBanner')
  @UseInterceptors(
    FileInterceptor(
      'file',
      multerOptions('./uploads/profileBanners', 1024 * 1024 * 80),
    ),
  )
  uploadProfileBanner(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }
    const user: UserEntity = req.user.payload;
    return this.usersService.uploadProfileBanner(user, file);
  }

  @ApiOperation({
    summary: 'Delete user profile banner',
    description:
      'Deletes user profile banner. Needs bearer auth token of the account owner.',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UserEntity,
  })
  @ApiResponse({
    status: 401,
    description: 'Access denied',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 413,
    description: 'File too large. Max size: 80 mb.',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('delete/profileBanner')
  deleteProfileBanner(@Request() req) {
    const user: UserEntity = req.user.payload;
    return this.usersService.deleteProfileBanner(user.id);
  }

  @ApiOperation({
    summary: 'Delete user profile image',
    description:
      'Deletes user profile image. Needs bearer auth token of the account owner.',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UserEntity,
  })
  @ApiResponse({
    status: 401,
    description: 'Access denied',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 413,
    description: 'File too large. Max size: 80 mb.',
    type: HttpExceptionDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occured',
    type: HttpExceptionDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('delete/profileImage')
  deleteProfileImage(@Request() req) {
    const user: UserEntity = req.user.payload;
    return this.usersService.deleteProfileImage(user.id);
  }
}
