import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import * as fs from 'fs';
import * as moment from 'moment';
import { join } from 'path';
import {
  priceFilterOptions,
  userAssetTabs,
  userFilterStatuses,
  userSortOptions,
} from '../../utils/enums';
import { UserAssetsQueryDto } from './dto/userAssetsQuery.dto';
import { NftEntity } from '../nfts/entities/nft.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('Users');
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(NftEntity)
    private nftsRepository: Repository<NftEntity>,
    private httpService: HttpService,
  ) {}

  async addUser(createUserDto: CreateUserDto) {
    const userByAddress = await this.usersRepository.findOne({
      where: { publicAddress: createUserDto.publicAddress },
    });

    if (userByAddress) {
      throw new HttpException(
        'User with this public address already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const userByUsername = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (userByUsername) {
      throw new HttpException(
        'User with this username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Initialize with a random nonce
    const nonce = Math.floor(Math.random() * 1000000);
    const user = this.usersRepository.save({ ...createUserDto, nonce });

    return user;
  }

  getAllUsers() {
    return this.usersRepository.find({ withDeleted: true });
  }

  async getOrCreateUserByAddress(publicAddress: string) {
    const user = await this.usersRepository.findOne({
      where: { publicAddress },
    });

    if (user) {
      return user;
    }

    // Initialize with a random nonce
    const nonce = Math.floor(Math.random() * 1000000);

    return this.usersRepository.save({ publicAddress, nonce });
  }

  async getUserByAddress(publicAddress: string) {
    const user = await this.usersRepository.findOne({
      where: { publicAddress },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async updateUser(publicAddress: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { publicAddress },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.usersRepository.update({ id: user.id }, updateUserDto);
    return this.usersRepository.findOne({
      where: { publicAddress },
    });
  }

  async deleteUser(publicAddress: string) {
    const user = await this.usersRepository.findOne({
      where: { publicAddress },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.usersRepository.softRemove(user);
  }

  async restoreUser(publicAddress: string) {
    const user = await this.usersRepository.findOne({
      where: { publicAddress },
      withDeleted: true,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!user.deletedAt) {
      throw new HttpException('User is not deleted', HttpStatus.BAD_REQUEST);
    }
    await this.usersRepository.restore(user.id);
    return user.publicAddress;
  }

  async uploadProfileImage(user: UserEntity, file: Express.Multer.File) {
    try {
      await this.usersRepository.update(user.id, {
        profileImage: file.filename,
      });
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(
        'Internal server error occured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return file.filename;
  }

  async uploadProfileBanner(user: UserEntity, file: Express.Multer.File) {
    try {
      await this.usersRepository.update(user.id, {
        profileBanner: file.filename,
      });
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(
        'Internal server error occured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return file.filename;
  }

  async deleteProfileBanner(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user.profileBanner) {
      throw new HttpException(
        'Profile banner is already deleted',
        HttpStatus.BAD_REQUEST,
      );
    }
    fs.unlink(
      join(
        __dirname,
        '../../..',
        `/uploads/profileBanners/${user.profileBanner}`,
      ),
      (err) => this.logger.error(err),
    );
    return this.usersRepository.save({ ...user, profileBanner: null });
  }

  async deleteProfileImage(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user.profileImage) {
      throw new HttpException(
        'Profile image is already deleted',
        HttpStatus.BAD_REQUEST,
      );
    }
    fs.unlink(
      join(
        __dirname,
        '../../..',
        `/uploads/profileImages/${user.profileImage}`,
      ),
      (err) => this.logger.error(err),
    );
    return this.usersRepository.save({ ...user, profileImage: null });
  }

  async checkUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (user) {
      return { exists: true };
    }
    return { exists: false };
  }

  async checkEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (user) {
      return { exists: true };
    }
    return { exists: false };
  }

  async checkTransferApproval(userDto: UserEntity) {
    const user = await this.usersRepository.findOne({
      where: { publicAddress: userDto.publicAddress },
    });

    return { isTransferApproved: user.isTransferApproved };
  }

  async getAccountAssets(
    userAssetsQueryDto: UserAssetsQueryDto,
    user: UserEntity,
  ) {
    const stats = await this.nftsRepository
      .createQueryBuilder('nft')
      .where('nft.ownerId = :id', { id: user.id })
      .select('SUM(nft.price)', 'totalValue')
      .addSelect('MAX(nft.price)', 'maxValue')
      .getRawOne();

    const filterQuery = this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: user.id })
      .select('user.publicAddress')
      .loadRelationCountAndMap('user.favoritedNfts', 'user.favoritedNfts')
      .loadRelationCountAndMap('user.createdNfts', 'user.createdNfts')
      .loadRelationCountAndMap('user.ownedNfts', 'user.ownedNfts');

    //tab selects
    switch (userAssetsQueryDto.tab) {
      case userAssetTabs.COLLECTED:
        filterQuery
          .leftJoinAndMapMany('user.data', 'user.ownedNfts', 'data')
          .leftJoinAndSelect('data.owner', 'owner')
          .leftJoinAndSelect('data.blockchainType', 'blockchainType')
          .leftJoinAndSelect('data.collection', 'collection')
          .leftJoinAndSelect('collection.category', 'category')
          .leftJoinAndSelect('collection.paymentToken', 'paymentToken');
        break;
      case userAssetTabs.CREATED:
        filterQuery
          .leftJoinAndMapMany('user.data', 'user.createdNfts', 'data')
          .leftJoinAndSelect('data.owner', 'owner')
          .leftJoinAndSelect('data.blockchainType', 'blockchainType')
          .leftJoinAndSelect('data.collection', 'collection')
          .leftJoinAndSelect('collection.category', 'category')
          .leftJoinAndSelect('collection.paymentToken', 'paymentToken');
        break;
      case userAssetTabs.CREATED_COLLECTIONS:
        filterQuery
          .leftJoinAndMapMany('user.data', 'user.collections', 'data')
          .leftJoinAndSelect('data.user', 'user');
        break;
      case userAssetTabs.FAVORITED:
        filterQuery
          .leftJoinAndMapMany('user.data', 'user.favoritedNfts', 'data')
          .leftJoinAndSelect('data.owner', 'owner')
          .leftJoinAndSelect('data.blockchainType', 'blockchainType')
          .leftJoinAndSelect('data.collection', 'collection')
          .leftJoinAndSelect('collection.category', 'category')
          .leftJoinAndSelect('collection.paymentToken', 'paymentToken');
        break;
      case userAssetTabs.OFFERS_MADE:
        filterQuery
          .leftJoinAndMapMany('user.data', 'user.saleOffers', 'data')
          .leftJoinAndSelect('data.seller', 'seller')
          .leftJoinAndSelect('data.buyer', 'buyer')
          .leftJoinAndSelect('data.nft', 'nft');
        break;
      case userAssetTabs.OFFERS_RECEIVED:
        filterQuery
          .leftJoinAndMapMany('user.data', 'user.purchaseOffers', 'data')
          .leftJoinAndSelect('data.seller', 'seller')
          .leftJoinAndSelect('data.buyer', 'buyer')
          .leftJoinAndSelect('data.nft', 'nft');
        break;
      case userAssetTabs.ACTIVITY:
        filterQuery
          .leftJoinAndMapMany(
            'user.offersMade',
            'user.saleOffers',
            'offersMade',
          )
          .leftJoinAndMapMany(
            'user.sales',
            'user.saleOffers',
            'sales',
            `madeOffers.status = 'accepted'`,
          );
        break;
    }

    //tokens filtering
    if (
      [
        userAssetTabs.COLLECTED,
        userAssetTabs.CREATED,
        userAssetTabs.FAVORITED,
      ].includes(userAssetsQueryDto.tab)
    ) {
      switch (userAssetsQueryDto.sortBy) {
        case userSortOptions.PRICE:
          filterQuery.orderBy('data', userAssetsQueryDto.sortOrder);
      }

      //filtering by status
      if (userAssetsQueryDto.status) {
        const statusArray = userAssetsQueryDto.status.split(',');
        statusArray.forEach((status) => {
          switch (status) {
            case userFilterStatuses.BUY_NOW:
              filterQuery.andWhere('data.price IS NOT NULL');
              break;
            case userFilterStatuses.ON_AUCTION:
              filterQuery.andWhere('data.timeAuctionListingId IS NOT NULL');
              break;
            case userFilterStatuses.NEW:
              filterQuery.andWhere('data.created > :edgeDate', {
                edgeDate: moment().subtract(7, 'days').format('DD-MMM-YYYY'),
              });
              break;
            case userFilterStatuses.ON_AUCTION:
              filterQuery.andWhere('data.timeAuctionListingId IS NOT NULL');
          }
        });
      }

      //filtering by price
      if (
        userAssetsQueryDto.priceFilterType &&
        userAssetsQueryDto.priceFilterMin &&
        userAssetsQueryDto.priceFilterMax
      ) {
        let data: any;
        if (userAssetsQueryDto.priceFilterType !== priceFilterOptions.ETH) {
          try {
            //fetching exchange rates
            data = await lastValueFrom(
              this.httpService
                .get(
                  `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,SOL`,
                )
                .pipe(map((res) => res.data)),
            );
            //convert tokens which are not eth
            userAssetsQueryDto.priceFilterMax =
              userAssetsQueryDto.priceFilterMax /
              data[userAssetsQueryDto.priceFilterType];

            userAssetsQueryDto.priceFilterMin =
              userAssetsQueryDto.priceFilterMin /
              data[userAssetsQueryDto.priceFilterType];
          } catch (error) {
            this.logger.error(error);
            throw new HttpException(
              'Internal server error occured',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        }
        filterQuery.andWhere(
          `data.price <= ${userAssetsQueryDto.priceFilterMax} AND data.price >= ${userAssetsQueryDto.priceFilterMin}`,
        );
      }

      //filtering by collection id
      if (userAssetsQueryDto.collectionId) {
        const collectionIds = userAssetsQueryDto.collectionId.split(',');
        filterQuery.andWhere(
          new Brackets((sqb) => {
            collectionIds.forEach((collectionId) => {
              sqb.orWhere(`collection.id = ${+collectionId}`);
            });
          }),
        );
      }

      //filtering by category id
      if (userAssetsQueryDto.categoryId) {
        const categoryIds = userAssetsQueryDto.categoryId.split(',');
        filterQuery.andWhere(
          new Brackets((sqb) => {
            categoryIds.forEach((categoryId) => {
              sqb.orWhere(`category.id = ${+categoryId}`);
            });
          }),
        );
      }

      //filtering by payment token id
      if (userAssetsQueryDto.paymentTokenId) {
        const paymentTokenIds = userAssetsQueryDto.paymentTokenId.split(',');
        filterQuery.andWhere(
          new Brackets((sqb) => {
            paymentTokenIds.forEach((paymentTokenId) => {
              sqb.orWhere(`paymentToken.id = ${+paymentTokenId}`);
            });
          }),
        );
      }
    }

    //pagination
    if (
      typeof +userAssetsQueryDto.limit !== 'number' ||
      typeof +userAssetsQueryDto.offset !== 'number'
    ) {
      throw new HttpException(
        'Pagination parameters are invalid',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const assets: any = await filterQuery
        .limit(+userAssetsQueryDto.limit)
        .offset(+userAssetsQueryDto.offset)
        .getOne();

      if (!assets?.data) {
        return { statusCode: HttpStatus.OK, message: 'No data' };
      }
      const result = { ...assets, ...stats };
      return result;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
