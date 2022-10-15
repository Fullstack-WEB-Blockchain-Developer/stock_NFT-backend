import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferEntity } from './entities/offer.entity';
import { AuthModule } from '../auth/auth.module';
import { OfferCurrencyTypeEntity } from './entities/offerCurrencyType.entity';
import { NftEntity } from '../nfts/entities/nft.entity';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OfferEntity,
      OfferCurrencyTypeEntity,
      NftEntity,
      UserEntity,
    ]),
    HttpModule,
    AuthModule,
  ],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
