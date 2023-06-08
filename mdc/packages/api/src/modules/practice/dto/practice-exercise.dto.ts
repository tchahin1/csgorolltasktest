import { EXERCISE_TYPE } from '@prisma/client';
import { IsString, IsOptional, IsNumber, IsDefined } from 'class-validator';

export class PracticeExerciseDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  exerciseId?: string;

  @IsNumber()
  @IsOptional()
  reps: number;

  @IsDefined()
  exerciseType: EXERCISE_TYPE;

  @IsNumber()
  @IsOptional()
  duration: number;

  @IsNumber()
  @IsDefined()
  sortValue: number;
}
