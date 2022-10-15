import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  priceFilterOptions,
  userAssetTabs,
  userFilterStatuses,
  userSortOptions,
  userSortOrderOptions,
} from '../../../utils/enums';

export class UserAssetsQueryDto {
  @IsEnum(userSortOptions, {
    message: 'Sort by should be one of the valid options',
  })
  @IsOptional()
  sortBy: userSortOptions = null;

  @IsEnum(userSortOrderOptions, {
    message: 'Sort order should be one of the valid options',
  })
  @IsOptional()
  sortOrder: userSortOrderOptions = null;

  @IsEnum(userAssetTabs, {
    message: 'Tab should be one of the valid options',
  })
  @IsOptional()
  tab: userAssetTabs = userAssetTabs.COLLECTED;

  @IsOptional()
  status: userFilterStatuses = null;

  @IsOptional()
  priceFilterType: priceFilterOptions = null;

  @IsOptional()
  priceFilterMin: number = null;

  @IsOptional()
  priceFilterMax: number = null;

  @IsOptional()
  collectionId: string = null;

  @IsOptional()
  blockchainId: string = null;

  @IsOptional()
  categoryId: string = null;

  @IsOptional()
  paymentTokenId: string = null;

  @IsOptional()
  limit = '12';

  @IsOptional()
  offset = '0';
}
