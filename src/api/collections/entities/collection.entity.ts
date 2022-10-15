import { ApiProperty } from '@nestjs/swagger';
import { Max, MaxLength } from 'class-validator';
import { NftEntity } from '../../nfts/entities/nft.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CollectionPaymentTokenEntity } from './collectionPaymentToken.entity';
import { CollectionCategoryEntity } from './collectionCategory.entity';

export enum collectionThemes {
  PADDED = 'padded',
  CONTAINED = 'contained',
  COVERED = 'covered',
}

@Entity('collections')
export class CollectionEntity extends BaseEntity {
  @ApiProperty({ description: 'Name of the collection' })
  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  name: string;

  @ApiProperty({ description: 'Name of the collection logo image' })
  @Column({
    type: 'text',
    nullable: true,
  })
  logoImage: string;

  @ApiProperty({ description: 'Name of the collection featured image' })
  @Column({
    type: 'text',
    nullable: true,
  })
  featuredImage: string;

  @ApiProperty({ description: 'Name of the collection banner image' })
  @Column({
    type: 'text',
    nullable: true,
  })
  bannerImage: string;

  @ApiProperty({ description: 'Customized URL of the collection' })
  @Column({
    type: 'text',
    nullable: true,
  })
  url: string;

  @ApiProperty({
    description: 'Description of the collection. Max size: 1000 characters',
  })
  @MaxLength(1000)
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({ description: 'Website link' })
  @Column({
    type: 'text',
    nullable: true,
  })
  websiteLink: string;

  @ApiProperty({ description: 'Discord link' })
  @Column({
    type: 'text',
    nullable: true,
  })
  discordLink: string;

  @ApiProperty({ description: 'Instagram link' })
  @Column({
    type: 'text',
    nullable: true,
  })
  instagramLink: string;

  @ApiProperty({ description: 'Medium link' })
  @Column({
    type: 'text',
    nullable: true,
  })
  mediumLink: string;

  @ApiProperty({ description: 'Telegram link' })
  @Column({
    type: 'text',
    nullable: true,
  })
  telegramLink: string;

  @ApiProperty({ description: 'Creator earnings as a percentage, max 10%' })
  @Column({
    type: 'float',
    nullable: true,
  })
  creatorEarnings: number;

  @ApiProperty({ description: 'Display theme of the collection' })
  @Column({
    type: 'enum',
    enum: collectionThemes,
    nullable: false,
    default: collectionThemes.CONTAINED,
  })
  displayTheme: collectionThemes;

  @ApiProperty({
    description: 'Does this collection contain explicit & sensitive content',
  })
  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  IsSensitiveContent: boolean;

  @ApiProperty({
    description: 'Public addresses of collection collaborators',
  })
  @Column({
    type: 'jsonb',
    nullable: true,
    array: true,
  })
  collaborators: string[];

  @ManyToOne(
    () => CollectionPaymentTokenEntity,
    (paymentToken) => paymentToken.collections,
  )
  paymentToken: CollectionPaymentTokenEntity;

  @OneToMany(() => NftEntity, (nft) => nft.collection)
  nfts: NftEntity[];

  @ManyToOne(() => UserEntity, (user) => user.collections)
  user: UserEntity;

  @ManyToOne(() => CollectionCategoryEntity, (category) => category.collections)
  category: CollectionCategoryEntity;
}
