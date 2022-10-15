import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { OfferCurrencyTypeEntity } from './offerCurrencyType.entity';
import { NftEntity } from '../../nfts/entities/nft.entity';
import { Transform } from 'class-transformer';

export enum offerStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}
@Entity('offers')
export class OfferEntity extends BaseEntity {
  @ApiProperty({ description: 'Offered price of the token' })
  @Column({
    type: 'float',
    nullable: false,
  })
  price: number;

  @ApiProperty({ description: 'Offer expiration date' })
  @Transform(() => Date)
  @Column({
    type: 'date',
    nullable: false,
  })
  expirationDate: Date;

  @ApiProperty({ description: 'Offer status' })
  @Column({
    type: 'enum',
    nullable: false,
    enum: offerStatus,
    default: offerStatus.PENDING,
  })
  status: offerStatus;

  @ApiProperty({
    description: 'Blockchain transaction hash',
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  blockchainHash: string;

  @ManyToOne(() => UserEntity, (user) => user.purchaseOffers)
  buyer: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.saleOffers)
  seller: UserEntity;

  @ManyToOne(
    () => OfferCurrencyTypeEntity,
    (currencyType) => currencyType.offers,
  )
  currencyType: OfferCurrencyTypeEntity;

  @ManyToOne(() => NftEntity, (nft) => nft.offers)
  nft: NftEntity;
}
