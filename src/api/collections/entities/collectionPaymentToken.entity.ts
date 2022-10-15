import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { CollectionEntity } from './collection.entity';

@Entity('collection_payment_tokens')
export class CollectionPaymentTokenEntity extends BaseEntity {
  @ApiProperty({ description: 'Name of a collection payment token' })
  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  name: string;

  @ApiProperty({ description: 'Name of a collection payment token icon' })
  @Column({
    type: 'text',
    nullable: true,
  })
  icon: string;

  @OneToMany(() => CollectionEntity, (collection) => collection.paymentToken)
  collections: CollectionEntity[];
}
