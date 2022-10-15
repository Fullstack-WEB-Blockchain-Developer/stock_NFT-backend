import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { NftEntity } from './nft.entity';

@Entity('blockchain_types')
export class BlockchainTypeEntity extends BaseEntity {
  @ApiProperty({ description: 'Blockchain type' })
  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  name: string;

  @ApiProperty({ description: 'Name of the blockchain type icon' })
  @Column({
    type: 'text',
    nullable: true,
  })
  icon: string;

  @OneToMany(() => NftEntity, (nft) => nft.blockchainType)
  nfts: NftEntity[];
}
