import { IsDate, IsOptional } from 'class-validator';

export class GetObjectivesDto {
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;
}
