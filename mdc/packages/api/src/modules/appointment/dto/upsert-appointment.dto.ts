import { PRACTICE_TYPE } from '@prisma/client';
import {
  IsDate,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpsertAppointmentDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(PRACTICE_TYPE)
  @IsDefined()
  practice: PRACTICE_TYPE;

  @IsDate()
  @IsDefined()
  startDate: Date;

  @IsDate()
  @IsDefined()
  endDate: Date;

  @IsString()
  @IsOptional()
  court?: string;

  @IsString({ each: true })
  @IsOptional()
  players?: string[];

  @IsString({ each: true })
  @IsOptional()
  team?: string;

  @IsString()
  @IsOptional()
  objectives?: string;

  @IsString({ each: true })
  @IsOptional()
  coachIds?: string[];

  @IsString()
  @IsOptional()
  assessmentId?: string;
}
