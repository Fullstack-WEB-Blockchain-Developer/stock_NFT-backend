import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { NftEntity } from '../../nfts/entities/nft.entity';

@Entity('fixed_price_listings')
export class FixedPriceListingEntity extends BaseEntity {
  @ApiProperty({ description: 'Price of the token' })
  @Column({
    type: 'float',
    nullable: false,
  })
  price: number;

  @ApiProperty({ description: 'Listing duration' })
  @Transform(() => Date)
  @Column({
    type: 'date',
    nullable: false,
  })
  duration: Date;

  @ApiProperty({
    description: 'Sell NFTs as a bundle',
  })
  @Column({
    type: 'boolean',
    default: false,
  })
  asBundle: boolean;

  @ApiProperty({ description: 'Bundle name' })
  @Column({
    type: 'text',
    nullable: true,
  })
  bundleName: string;

  @ApiProperty({ description: 'Bundle description' })
  @Column({
    type: 'text',
    nullable: true,
  })
  bundleDescription: string;

  @OneToMany(() => NftEntity, (nft) => nft.fixedPriceListing)
  nfts: NftEntity[];
}
