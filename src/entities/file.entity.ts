import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from '../api/users/entities/user.entity';

@Entity('files')
export class FileEntity extends BaseEntity {
  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  fileName: string;

  @ManyToOne(() => UserEntity, (user) => user.files)
  user: UserEntity;
}
