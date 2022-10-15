import { Module } from '@nestjs/common';
import { NftsService } from './nfts.service';
import { NftsController } from './nfts.controller';
import { NftEntity } from './entities/nft.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionEntity } from '../collections/entities/collection.entity';
import { BlockchainTypeEntity } from './entities/blockchainType.entity';
import { AuthModule } from '../auth/auth.module';
import { FileEntity } from '../../entities/file.entity';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NftEntity,
      CollectionEntity,
      BlockchainTypeEntity,
      FileEntity,
      UserEntity,
    ]),
    AuthModule,
  ],
  controllers: [NftsController],
  providers: [NftsService],
})
export class NftsModule {}
