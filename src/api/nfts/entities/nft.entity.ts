import { ApiProperty } from '@nestjs/swagger';
import { CollectionEntity } from '../../collections/entities/collection.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { BlockchainTypeEntity } from './blockchainType.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { OfferEntity } from '../../offers/entities/offer.entity';
import { FixedPriceListingEntity } from '../../listings/entities/fixedPriceListing.entity';

export enum nftStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  LISTED = 'listed',
}
@Entity('nfts')
export class NftEntity extends BaseEntity {
  @ApiProperty({ description: 'Name of the NFT' })
  @Column({
    type: 'text',
    nullable: false,
  })
  name: string;

  @ApiProperty({ description: 'Price of the token' })
  @Column({
    type: 'float',
    nullable: true,
  })
  price: number;

  @ApiProperty({ description: 'NFT content file name' })
  @Column({
    type: 'text',
    nullable: false,
  })
  fileName: string;

  @ApiProperty({
    description: 'Link to the NFT media on a decentralized storage',
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  nftMediaLink: string;

  @ApiProperty({
    description: 'External link that will be displayed to another users',
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  externalLink: string;

  @ApiProperty({ description: 'NFT description' })
  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @ApiProperty({
    description: 'NFT properties',
    example: [{ type: 'Hair color', name: 'Red', frequency: 0.2 }],
  })
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  properties: { type: string; name: string; frequency: number }[];

  @ApiProperty({
    description: 'NFT levels',
    example: [{ name: 'Speed', nftValue: 3, maxValue: 5 }],
  })
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  levels: { name: string; nftValue: number; maxValue: number }[];

  @ApiProperty({
    description: 'NFT stats',
    example: [{ name: 'Speed', nftValue: 3, maxValue: 5 }],
  })
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  stats: { name: string; nftValue: number; maxValue: number }[];

  @ApiProperty({
    description: 'NFT unlockable content (access key, link and etc.)',
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  unlockableContent: string;

  @ApiProperty({
    description: 'Explicit and Sensitive Content presence',
  })
  @Column({
    type: 'boolean',
    default: false,
  })
  isSensitiveContent: boolean;

  @ApiProperty({
    description: 'NFT asset-backed property',
  })
  @Column({
    type: 'boolean',
    default: false,
  })
  isAssetBacked: boolean;

  @ApiProperty({
    description: 'Current status of the NFT. Default: pending',
  })
  @Column({
    type: 'enum',
    enum: nftStatus,
    default: nftStatus.PENDING,
  })
  status: nftStatus;

  @ManyToOne(
    () => BlockchainTypeEntity,
    (blockchainType) => blockchainType.nfts,
  )
  blockchainType: BlockchainTypeEntity;

  @ManyToOne(() => CollectionEntity, (collection) => collection.nfts)
  collection: CollectionEntity;

  @ManyToOne(() => UserEntity, (owner) => owner.ownedNfts)
  owner: UserEntity;

  @ManyToOne(() => UserEntity, (creator) => creator.createdNfts)
  creator: UserEntity;

  @ManyToOne(
    () => FixedPriceListingEntity,
    (fixedPriceListing) => fixedPriceListing.nfts,
  )
  fixedPriceListing: FixedPriceListingEntity;

  @ManyToOne(
    () => FixedPriceListingEntity,
    (fixedPriceListing) => fixedPriceListing.nfts,
  )
  timeAuctionListing: FixedPriceListingEntity;

  @OneToMany(() => OfferEntity, (offer) => offer.nft)
  offers: OfferEntity[];

  @ManyToMany(() => UserEntity, (user) => user.favoritedNfts)
  favoritedUsers: UserEntity[];
}
