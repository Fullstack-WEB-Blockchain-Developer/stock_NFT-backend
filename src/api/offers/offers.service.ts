import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotImplementedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NftEntity } from '../nfts/entities/nft.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferEntity, offerStatus } from './entities/offer.entity';
import { OfferCurrencyTypeEntity } from './entities/offerCurrencyType.entity';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class OffersService {
  private logger: Logger = new Logger('Offers');
  constructor(
    @InjectRepository(OfferEntity)
    private offersRepository: Repository<OfferEntity>,
    @InjectRepository(NftEntity)
    private nftsRepository: Repository<NftEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(OfferCurrencyTypeEntity)
    private offerCurrencyTypesRepository: Repository<OfferCurrencyTypeEntity>,
    private httpService: HttpService,
  ) {}

  async createOffer(createOfferDto: CreateOfferDto, userDto: UserEntity) {
    const nft = await this.nftsRepository.findOne({
      relations: ['owner'],
      where: { id: createOfferDto.nftId },
    });
    if (!nft) {
      throw new HttpException('NFT not found', HttpStatus.BAD_REQUEST);
    }
    if (userDto.id === nft.owner.id) {
      throw new HttpException(
        "You can't make an offer to buy an NFT which is owned by you",
        HttpStatus.BAD_REQUEST,
      );
    }
    const currencyType = await this.offerCurrencyTypesRepository.findOne({
      where: { id: createOfferDto.currencyId },
    });
    if (!currencyType) {
      throw new HttpException(
        'Offer currency not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    const buyer = await this.usersRepository.findOne({
      where: { id: userDto.id },
      select: ['id', 'publicAddress', 'username', 'isTransferApproved'],
    });
    if (!buyer.isTransferApproved) {
      await this.usersRepository.save({ ...userDto, isTransferApproved: true });
    }
    await this.offersRepository.save({
      ...createOfferDto,
      buyer,
      seller: {
        id: nft.owner.id,
        publicAddress: nft.owner.publicAddress,
        username: nft.owner.username,
      },
      nft,
      currencyType,
    });
    return {
      ...createOfferDto,
      buyer,
      seller: {
        id: nft.owner.id,
        publicAddress: nft.owner.publicAddress,
        username: nft.owner.username,
      },
      currencyType,
    };
  }

  async acceptOffer(user: UserEntity, id: number) {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: ['nft', 'buyer', 'seller'],
    });

    if (!offer) {
      throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
    }
    if (offer.seller.id !== user.id) {
      throw new HttpException('Access forbidden', HttpStatus.FORBIDDEN);
    }
    if (offer.status !== offerStatus.PENDING) {
      throw new HttpException('Offer has expired', HttpStatus.NOT_FOUND);
    }
    if (Date.now() > new Date(offer.expirationDate).getTime()) {
      throw new HttpException('Offer has expired', HttpStatus.BAD_REQUEST);
    }
    // try {
    //   const data = await lastValueFrom(
    //     this.httpService
    //       .get(
    //         `https://api.etherscan.io/api?module=account&action=txlistinternal&txhash=${offer.blockchainHash}&apikey=${process.env.RINKEBY_API_KEY}`,
    //       )
    //       .pipe(map((res) => res.data)),
    //   );
    //   console.log(data);

    //   if (!data?.status || data?.status !== '1') {
    //     throw new Error('Transaction is not complete');
    //   }
    // } catch (error) {
    //   throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    // }

    this.nftsRepository.update({ id: offer.nft.id }, { owner: offer.buyer });
    return this.offersRepository.save({
      ...offer,
      status: offerStatus.ACCEPTED,
    });
  }

  async declineOffer(user: UserEntity, id: number) {
    const offer = await this.offersRepository.findOne({
      where: { id },
    });
    if (!offer) {
      throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
    }
    return this.offersRepository.save({
      ...offer,
      status: offerStatus.DECLINED,
    });
  }

  getAllOffers() {
    return this.offersRepository.find();
  }

  findOne(id: number) {
    throw new NotImplementedException();
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    throw new NotImplementedException();
  }

  async addOfferHash(id: number, blockchainHash: string) {
    const offer = await this.offersRepository.findOne({
      where: { id },
    });
    if (!offer) {
      throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
    }
    await this.offersRepository.update(
      { id: offer.id },
      {
        blockchainHash,
      },
    );
    return this.offersRepository.findOne({
      where: { id: offer.id },
    });
  }

  remove(id: number) {
    throw new NotImplementedException();
  }

  async addOfferCurrencyType(offerCurrencyType: string) {
    const OfferCurrencyTypeFound =
      await this.offerCurrencyTypesRepository.findOne({
        where: { name: offerCurrencyType },
      });
    if (OfferCurrencyTypeFound) {
      throw new HttpException(
        'Currency type already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const softDeletedType = await this.offerCurrencyTypesRepository.findOne({
      where: { name: offerCurrencyType },
      withDeleted: true,
    });
    if (softDeletedType) {
      await this.offerCurrencyTypesRepository.restore(softDeletedType.id);
      return softDeletedType;
    }
    return this.offerCurrencyTypesRepository.save({ name: offerCurrencyType });
  }

  getOfferCurrencyTypes() {
    return this.offerCurrencyTypesRepository.find();
  }

  async deleteOfferCurrencyTypeById(id: number) {
    const offerCurrencyType = await this.offerCurrencyTypesRepository.findOne({
      where: { id },
    });
    if (!offerCurrencyType) {
      throw new HttpException(
        'OfferCurrency type not found',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.offerCurrencyTypesRepository.softDelete(id);
    return id;
  }

  async uploadCurrencyIcon(file: Express.Multer.File, currencyId: number) {
    const offerCurrencyType = await this.offerCurrencyTypesRepository.findOne({
      where: { id: currencyId },
    });
    if (!offerCurrencyType) {
      throw new HttpException(
        'OfferCurrency type not found',
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      await this.offerCurrencyTypesRepository.update(currencyId, {
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
