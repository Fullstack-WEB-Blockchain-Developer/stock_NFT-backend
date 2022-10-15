import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionEntity } from './entities/collection.entity';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from '../users/entities/user.entity';
import { CollectionPaymentTokenEntity } from './entities/collectionPaymentToken.entity';
import { CollectionCategoryEntity } from './entities/collectionCategory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CollectionEntity,
      UserEntity,
      CollectionPaymentTokenEntity,
      CollectionCategoryEntity,
    ]),
    AuthModule,
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
