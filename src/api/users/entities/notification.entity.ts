import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { UserEntity } from './user.entity';

export enum notificationTypes {
  ITEM_SOLD = 'itemSold',
  BID_ACTIVITY = 'bidActivity',
  PRICE_CHANGE = 'priceChange',
  AUCTION_EXPIRATION = 'auctionExpiration',
  OUTBID = 'outbid',
  OWNED_ITEMS_UPDATE = 'ownedItemsUpdates',
  SUCCESSFUL_PURCHASE = 'successfulPurchase',
  STOKE_NFT_NEWSLETTER = 'stokeNftNewsletter',
  MIN_BID_THESHOLD = 'minBindThreshold',
  OTHER = 'other',
}

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @ApiProperty({ description: 'Notification text' })
  @Column({
    type: 'text',
    nullable: true,
  })
  text: string;

  @ApiProperty({ description: 'Notification type' })
  @Column({
    type: 'enum',
    enum: notificationTypes,
    nullable: true,
  })
  type: notificationTypes;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  user: UserEntity;
}
