import { IsDate, IsOptional } from 'class-validator';

export class GetKeyDatesQueryDto {
  @IsDate()
  @IsOptional()
  startDate: Date;

  @IsDate()
  @IsOptional()
  endDate: Date;
}
