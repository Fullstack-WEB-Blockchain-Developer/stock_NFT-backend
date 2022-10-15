import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionEntity } from './entities/collection.entity';
import { CollectionCategoryEntity } from './entities/collectionCategory.entity';
import { CollectionPaymentTokenEntity } from './entities/collectionPaymentToken.entity';

@Injectable()
export class CollectionsService {
  private logger: Logger = new Logger('Collections');
  constructor(
    @InjectRepository(CollectionEntity)
    private collectionsRepository: Repository<CollectionEntity>,
    @InjectRepository(CollectionPaymentTokenEntity)
    private collectionPaymentTokensRepository: Repository<CollectionPaymentTokenEntity>,
    @InjectRepository(CollectionCategoryEntity)
    private collectionCategoriesRepository: Repository<CollectionCategoryEntity>,
  ) {}

  async addCollection(
    user: UserEntity,
    createCollectionDto: CreateCollectionDto,
  ) {
    throw NotImplementedException;
    // const file = await this.filesRepository.findOne({
    //   where: { fileName: createNftDto.fileName },
    // });
    // if (!file) {
    //   throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    // }
    // const blockchainType = await this.blockchainTypesRepository.findOne({
    //   where: { id: +createNftDto.blockchainTypeId },
    // });
    // if (!blockchainType) {
    //   throw new HttpException(
    //     'Invalid blockchain type ID',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    // let collection: CollectionEntity;
    // if (createNftDto.collectionId) {
    //   collection = await this.collectionsRepository.findOne({
    //     where: { id: +createNftDto.collectionId },
    //   });
  }

  getAllCollections() {
    return this.collectionsRepository.find({ withDeleted: true });
  }

  async getAllUserCollections(user: UserEntity) {
    // const stats = await this.collectionsRepository
    //   .createQueryBuilder('collection')
    //   .loadRelationCountAndMap('collection.nfts', 'collection.nfts', 'nfts')
    //   .loadRelationCountAndMap('nfts', 'collection.nfts', 'nfts')
    //   .select(
    //     'COUNT(nft.fixedPriceListing OR nft.timeAuctionListing )',
    //     'listedNfts',
    //   )
    //   .addSelect('COUNT(nft.timeAuctionListing )', 'auctionedNfts')
    //   .getRawOne();
    // console.log(stats);
    //mock
    const data: any = await this.collectionsRepository
      .createQueryBuilder('collection')
      .innerJoinAndSelect('collection.user', 'owner')
      .where('owner.id = :id', { id: user.id })
      // .leftJoinAndSelect('collection.nfts', 'nfts')
      .loadRelationCountAndMap('collection.nfts', 'collection.nfts', 'nfts')
      // .loadRelationCountAndMap(
      //   'collection.listedNfts',
      //   'nfts.fixedPriceListing',
      //   'listedNfts',
      // )
      // .addSelect('COUNT(nfts.fixedPriceListing)', 'listedNfts')
      // .addSelect('COUNT(nfts.timeAuctionListing )', 'auctionedNfts')
      .getMany();
   

    const result = data.map((obj) => ({
      ...obj,
      auctionedNfts: null,
      listedNfts: null,
    }));
    return result;
  }
  async getCollectionById(id: number) {
    const collection = await this.collectionsRepository.findOne({
      where: { id },
      join: {
        alias: 'collection',
        leftJoinAndSelect: {
          nfts: 'collection.nfts',
        },
      },
    });
    if (!collection) {
      throw new HttpException('Collection not found', HttpStatus.NOT_FOUND);
    }
    return collection;
  }

  update(id: number, updateCollectionDto: UpdateCollectionDto) {
    return `This action updates a #${id} collection`;
  }

  remove(id: number) {
    return `This action removes a #${id} collection`;
  }

  async addCollectionPaymentToken(collectionPaymentToken: string) {
    const collectionPaymentTokenFound =
      await this.collectionPaymentTokensRepository.findOne({
        where: { name: collectionPaymentToken },
      });
    if (collectionPaymentTokenFound) {
      throw new HttpException(
        'Payment token already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const softDeletedPaymentToken =
      await this.collectionPaymentTokensRepository.findOne({
        where: { name: collectionPaymentToken },
        withDeleted: true,
      });
    if (softDeletedPaymentToken) {
      await this.collectionPaymentTokensRepository.restore(
        softDeletedPaymentToken.id,
      );
      return softDeletedPaymentToken;
    }
    return this.collectionPaymentTokensRepository.save({
      name: collectionPaymentToken,
    });
  }
  async addCollectionCategory(collectionCategory: string) {
    const collectionCategoryFound =
      await this.collectionCategoriesRepository.findOne({
        where: { name: collectionCategory },
      });
    if (collectionCategoryFound) {
      throw new HttpException(
        'Payment token already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const softDeletedCategory =
      await this.collectionCategoriesRepository.findOne({
        where: { name: collectionCategory },
        withDeleted: true,
      });
    if (softDeletedCategory) {
      await this.collectionCategoriesRepository.restore(softDeletedCategory.id);
      return softDeletedCategory;
    }
    return this.collectionCategoriesRepository.save({
      name: collectionCategory,
    });
  }

  getCollectionPaymentTokens() {
    return this.collectionPaymentTokensRepository.find();
  }

  async deleteCollectionPaymentTokenById(id: number) {
    const collectionPaymentToken =
      await this.collectionPaymentTokensRepository.findOne({
        where: { id },
      });
    if (!collectionPaymentToken) {
      throw new HttpException(
        'Collection payment token not found',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.collectionPaymentTokensRepository.softDelete(id);
    return id;
  }
  async uploadPaymentTokenIcon(
    file: Express.Multer.File,
    paymentTokenId: number,
  ) {
    const collectionPaymentToken =
      await this.collectionPaymentTokensRepository.findOne({
        where: { id: paymentTokenId },
      });
    if (!collectionPaymentToken) {
      throw new HttpException(
        'Collection payment token not found',
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      await this.collectionPaymentTokensRepository.update(paymentTokenId, {
        icon: file.filename,
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

  getCollectionCategories() {
    return this.collectionCategoriesRepository.find();
  }

  async uploadCollectionCategoryIcon(
    file: Express.Multer.File,
    categoryId: number,
  ) {
    const collectionCategory =
      await this.collectionCategoriesRepository.findOne({
        where: { id: categoryId },
      });
    if (!collectionCategory) {
      throw new HttpException(
        'Collection payment token not found',
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      await this.collectionCategoriesRepository.update(categoryId, {
        icon: file.filename,
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
}
