import { PRACTICE_TYPE } from '@ankora/models';
import { IsDate, IsDefined, IsString } from 'class-validator';

export class CreateObjectivesDto {
  @IsString()
  @IsDefined()
  title: string;

  @IsDefined()
  practiceType: PRACTICE_TYPE;

  @IsDate()
  @IsDefined()
  startDate: Date;

  @IsDate()
  @IsDefined()
  endDate: Date;

  @IsString()
  @IsDefined()
  description: string;
}
