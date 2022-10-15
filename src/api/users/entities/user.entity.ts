import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsLowercase } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { CollectionEntity } from '../../collections/entities/collection.entity';
import { FileEntity } from '../../../entities/file.entity';
import { OfferEntity } from '../..//offers/entities/offer.entity';
import { NftEntity } from '../../nfts/entities/nft.entity';
import { NotificationEntity } from './notification.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @ApiProperty({ description: 'Username' })
  @Column({
    type: 'text',
    unique: true,
    nullable: true,
  })
  username: string;

  @ApiProperty({ description: "User's bio" })
  @Column({
    type: 'text',
    nullable: true,
  })
  bio: string;

  @ApiProperty({ description: "User's email" })
  @IsEmail()
  @Column({
    type: 'text',
    nullable: true,
  })
  email: string;

  @ApiProperty({ description: "Link to the user's Twitter account" })
  @Column({
    type: 'text',
    nullable: true,
  })
  twitterLink: string;

  @ApiProperty({ description: "Link to the user's Instagram account" })
  @Column({
    type: 'text',
    nullable: true,
  })
  instagramLink: string;

  @ApiProperty({ description: "Link to the user's website" })
  @Column({
    type: 'text',
    nullable: true,
  })
  websiteLink: string;

  @ApiProperty({ description: 'Randomly generated 6-digit nonce' })
  @Column({
    type: 'integer',
    nullable: false,
  })
  nonce: number;

  @ApiProperty({ description: "Name of user's profile image" })
  @Column({
    type: 'text',
    nullable: true,
  })
  profileImage: string;

  @ApiProperty({ description: "Name of user's profile banner" })
  @Column({
    type: 'text',
    nullable: true,
  })
  profileBanner: string;

  @ApiProperty({ description: "User's public wallet address" })
  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  publicAddress: string;

  @ApiProperty({
    description: 'Notification settings',
    example: {
      itemSold: true,
      bidActivity: true,
      priceChange: true,
      auctionExpiration: true,
      outbid: true,
      ownedItemsUpdates: true,
      successfulPurchase: true,
      stokeNftNewsletter: true,
      minBindThreshold: true,
    },
    default: {
      itemSold: true,
      bidActivity: true,
      priceChange: true,
      auctionExpiration: true,
      outbid: true,
      ownedItemsUpdates: true,
      successfulPurchase: true,
      stokeNftNewsletter: true,
      minBindThreshold: true,
    },
  })
  @Column({
    type: 'jsonb',
    default: {
      itemSold: true,
      bidActivity: true,
      priceChange: true,
      auctionExpiration: true,
      outbid: true,
      ownedItemsUpdates: true,
      successfulPurchase: true,
      stokeNftNewsletter: true,
      minBindThreshold: true,
    },
  })
  notificationSettings: {
    itemSold: boolean;
    bidActivity: boolean;
    priceChange: boolean;
    auctionExpiration: boolean;
    outbid: boolean;
    ownedItemsUpdates: boolean;
    successfulPurchase: boolean;
    stokeNftNewsletter: boolean;
    minBindThreshold: boolean;
  };

  @ApiProperty({ description: "User's transfer approval status" })
  @IsLowercase()
  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isTransferApproved: boolean;

  @OneToMany(() => CollectionEntity, (collection) => collection.user)
  collections: CollectionEntity[];

  @ManyToMany(() => NftEntity, (nft) => nft.favoritedUsers)
  @JoinTable()
  favoritedNfts: NftEntity[];

  @OneToMany(() => FileEntity, (file) => file.user)
  files: FileEntity[];

  @OneToMany(() => OfferEntity, (offer) => offer.seller)
  saleOffers: OfferEntity[];

  @OneToMany(() => OfferEntity, (offer) => offer.buyer)
  purchaseOffers: OfferEntity[];

  @OneToMany(() => NftEntity, (nft) => nft.owner)
  ownedNfts: NftEntity[];

  @OneToMany(() => NftEntity, (nft) => nft.creator)
  createdNfts: NftEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];
}
