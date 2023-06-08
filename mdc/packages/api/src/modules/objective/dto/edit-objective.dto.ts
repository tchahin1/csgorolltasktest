import { PRACTICE_TYPE } from '@ankora/models';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class EditObjectiveDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  practiceType?: PRACTICE_TYPE;
  @IsOptional()
  @IsDate()
  startDate?: Date;
  @IsOptional()
  @IsDate()
  endDate?: Date;
  @IsOptional()
  @IsString()
  description?: string;
}
