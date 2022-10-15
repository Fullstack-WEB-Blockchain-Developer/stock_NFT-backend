import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../../entities/file.entity';
import { Repository } from 'typeorm';
import { CollectionEntity } from '../collections/entities/collection.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { BlockchainTypeEntity } from './entities/blockchainType.entity';
import { NftEntity } from './entities/nft.entity';

@Injectable()
export class NftsService {
  private logger: Logger = new Logger('NFT');
  constructor(
    @InjectRepository(NftEntity)
    private nftsRepository: Repository<NftEntity>,
    @InjectRepository(BlockchainTypeEntity)
    private blockchainTypesRepository: Repository<BlockchainTypeEntity>,
    @InjectRepository(CollectionEntity)
    private collectionsRepository: Repository<CollectionEntity>,
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
  ) {}

  async addNft(user: UserEntity, createNftDto: CreateNftDto) {
    const file = await this.filesRepository.findOne({
      where: { fileName: createNftDto.fileName },
    });

    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    const blockchainType = await this.blockchainTypesRepository.findOne({
      where: { id: +createNftDto.blockchainTypeId },
    });
    if (!blockchainType) {
      throw new HttpException(
        'Invalid blockchain type ID',
        HttpStatus.BAD_REQUEST,
      );
    }
    let collection: CollectionEntity;
    if (createNftDto.collectionId) {
      collection = await this.collectionsRepository.findOne({
        where: { id: +createNftDto.collectionId },
      });
    }

    if (!collection) {
      //assign last id of the collections + 1 to unnamed collection
      const lastId = await this.collectionsRepository
        .createQueryBuilder('collections')
        .select('MAX(collections.id)', 'max')
        .getRawOne();

      if (!lastId.max) lastId.max = 0;

      await this.collectionsRepository.save({
        name: `Unnamed collection #${+lastId.max + 1}`,
        user,
      });

      collection = await this.collectionsRepository.findOne({
        where: { id: +lastId.max + 1 },
      });
    }

    return this.nftsRepository.save({
      ...createNftDto,
      blockchainType,
      collection,
      owner: user,
      creator: user,
    });
  }

  getAllNfts() {
    return this.nftsRepository.find({
      join: {
        alias: 'nft',
        leftJoinAndSelect: {
          blockchainType: 'nft.blockchainType',
          collection: 'nft.collection',
        },
      },
    });
  }

  async getAllNftsId() {
    const nftsIdObj = await this.nftsRepository.find({
      select: ['id'],
    });
    const nftsId: number[] = [];
    nftsIdObj.forEach((el) => nftsId.push(el.id));
    return nftsId;
  }

  async getNftById(id: number) {
    const nft = await this.nftsRepository
      .createQueryBuilder('nft')
      .where({ id })
      .select([
        'nft',
        'owner.id',
        'owner.username',
        'owner.publicAddress',
        'collection.id',
        'collection.name',
        'collection.url',
        'collection.logoImage',
        'collection.description',
        'category.name',
        'blockchainType.name',
        'offers',
        'buyer.username',
        'buyer.publicAddress',
        'seller.username',
        'seller.publicAddress',
      ])
      .leftJoin('nft.owner', 'owner')
      .leftJoin('nft.blockchainType', 'blockchainType')
      .leftJoin('nft.collection', 'collection')
      .leftJoin('nft.offers', 'offers')
      .leftJoin('offers.buyer', 'buyer')
      .leftJoin('offers.seller', 'seller')
      .leftJoin('collection.category', 'category')
      .getOne();

    if (!nft) {
      throw new HttpException('NFT not found', HttpStatus.NOT_FOUND);
    }

    if (!nft.collection) {
      return nft;
    }

    //count how often a trait appears in the collection
    const collectionNfts = await this.nftsRepository
      .createQueryBuilder('nft')
      .where(`collection.id = ${nft.collection.id}`)
      .leftJoin('nft.collection', 'collection')
      .getMany();

    if (nft.properties) {
      //count frequency of the property
      let propertyCounter: number;
      //count total number
      let totalCounter: number;
      //loop through current nfts props
      for (const property of nft.properties) {
        propertyCounter = 0;
        totalCounter = 0;
        //loop through all nfts in the collection
        collectionNfts.forEach((collectionNft) => {
          totalCounter++;
          //loop through properties of the nft in the collection
          if (collectionNft.properties) {
            for (const collectionNftProp of collectionNft.properties) {
              if (collectionNftProp.name === property.name) {
                propertyCounter++;
                return;
              }
            }
          }
        });
        property.frequency = Number(
          (propertyCounter / totalCounter).toFixed(2),
        );
      }
    }
    return nft;
  }
  async getNftMetadataById(id: number) {
    const nft = await this.nftsRepository.findOne({
      where: { id },
    });
    if (!nft) {
      throw new HttpException('NFT not found', HttpStatus.NOT_FOUND);
    }
    //converting attributes to nft metadata standard
    const attrs: { trait_type: string; value: number | string }[] = [];
    if (nft.properties) {
      nft.properties.forEach((prop) => {
        attrs.push({
          trait_type: prop.name,
          value: prop.type,
        });
      });
    }
    if (nft.levels) {
      nft.levels.forEach((level) => {
        attrs.push({
          trait_type: level.name,
          value: level.nftValue,
        });
      });
    }
    if (nft.stats) {
      nft.stats.forEach((stat) => {
        attrs.push({
          trait_type: stat.name,
          value: stat.nftValue,
        });
      });
    }

    const nftMetadata = {
      name: nft.name,
      description: nft.description,
      image: nft.nftMediaLink,
    };
    if (attrs) {
      nftMetadata['attributes'] = attrs;
    }
    if (nft.externalLink) {
      nftMetadata['external_url'] = nft.externalLink;
    }
    return nftMetadata;
  }

  async updateNftById(id: number, updateNftDto: UpdateNftDto) {
    const nft = await this.nftsRepository.findOne({
      where: { id },
    });
    if (!nft) {
      throw new HttpException('NFT not found', HttpStatus.NOT_FOUND);
    }
    await this.nftsRepository.update(
      { id: nft.id },
      {
        ...updateNftDto,
      },
    );
    return this.nftsRepository.findOne({
      where: { id },
    });
  }

  async deleteNftById(id: number) {
    const nft = await this.nftsRepository.softRemove({ id });
    if (!nft) {
      throw new HttpException('NFT not found', HttpStatus.NOT_FOUND);
    }
    return nft;
  }

  async addBlockchainType(blockchainType: string) {
    const blockchainTypeFound = await this.blockchainTypesRepository.findOne({
      where: { name: blockchainType },
    });
    if (blockchainTypeFound) {
      throw new HttpException('Type already exists', HttpStatus.BAD_REQUEST);
    }
    const softDeletedType = await this.blockchainTypesRepository.findOne({
      where: { name: blockchainType },
      withDeleted: true,
    });
    if (softDeletedType) {
      await this.blockchainTypesRepository.restore(softDeletedType.id);
      return softDeletedType;
    }
    return this.blockchainTypesRepository.save({ name: blockchainType });
  }

  getBlockchainTypes() {
    return this.blockchainTypesRepository.find();
  }

  async deleteBlockchainTypeById(id: number) {
    const blockchainType = await this.blockchainTypesRepository.findOne({
      where: { id },
    });
    if (!blockchainType) {
      throw new HttpException(
        'Blockchain type not found',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.blockchainTypesRepository.softDelete(id);
    return id;
  }

  async uploadMedia(fileName: string, user: UserEntity) {
    await this.filesRepository.save({ fileName, user });
    return fileName;
  }

  async uploadBlockchainTypeIcon(
    file: Express.Multer.File,
    blockchainTypeId: number,
  ) {
    const blockchainType = await this.blockchainTypesRepository.findOne({
      where: { id: blockchainTypeId },
    });
    if (!blockchainType) {
      throw new HttpException(
        'Blockchain type not found',
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      await this.blockchainTypesRepository.update(
        { id: blockchainTypeId },
        {
          icon: file.filename,
        },
      );
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
