import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { OfferEntity } from './offer.entity';

@Entity('offer_currency_types')
export class OfferCurrencyTypeEntity extends BaseEntity {
  @ApiProperty({ description: 'Currency type' })
  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  name: string;

  @ApiProperty({ description: 'Name of the currency icon' })
  @Column({
    type: 'text',
    nullable: true,
  })
  icon: string;

  @OneToMany(() => OfferEntity, (offer) => offer.currencyType)
  offers: OfferEntity[];
}
