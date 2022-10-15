import { IsEnum, IsOptional } from 'class-validator';
import { userSortOrderOptions } from '../../../utils/enums';

export class sortOrderQueryDto {
  @IsEnum({
    message: 'Sort order be a one of the enum options',
    userSortOrderOptions,
  })
  @IsOptional()
  sortOrder: userSortOrderOptions;
}
