import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { NftEntity } from '../../nfts/entities/nft.entity';
export enum timeAuctionMethods {
  HIGHEST_BID = 'highestBid',
  DECLINING_PRICE = 'decliningPrice',
}
@Entity('time_auction_listings')
export class TimeAuctionListingEntity extends BaseEntity {
  @ApiProperty({ description: 'Starting price of the token' })
  @Column({
    type: 'float',
    nullable: false,
  })
  startingPrice: number;

  @ApiProperty({ description: 'Time auction method' })
  @Column({
    enum: timeAuctionMethods,
    nullable: false,
    default: timeAuctionMethods.HIGHEST_BID,
  })
  method: timeAuctionMethods;

  @ApiProperty({ description: 'Listing duration' })
  @Transform(() => Date)
  @Column({
    type: 'date',
    nullable: false,
  })
  duration: Date;

  @ApiProperty({ description: 'Reserve price of the token' })
  @Column({
    type: 'float',
    nullable: false,
  })
  reservePrice: number;

  @OneToMany(() => NftEntity, (nft) => nft.timeAuctionListing)
  nfts: NftEntity;
}
