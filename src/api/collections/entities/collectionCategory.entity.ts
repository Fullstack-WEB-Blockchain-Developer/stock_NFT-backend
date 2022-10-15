import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { CollectionEntity } from './collection.entity';

@Entity('collection_categories')
export class CollectionCategoryEntity extends BaseEntity {
  @ApiProperty({ description: 'Name of the collection category' })
  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  name: string;

  @ApiProperty({ description: 'Name of the collection category icon' })
  @Column({
    type: 'text',
    nullable: true,
  })
  icon: string;

  @OneToMany(() => CollectionEntity, (collection) => collection.category)
  collections: CollectionEntity[];
}
