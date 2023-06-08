import { EXERCISE_TYPE } from '@prisma/client';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUpdatePracticeExerciseDto {
  @IsString()
  @IsOptional()
  exerciseId: string;

  @IsNumber()
  @IsOptional()
  reps: number;

  @IsDefined()
  exerciseType: EXERCISE_TYPE;

  @IsNumber()
  @IsOptional()
  duration: number;

  @IsDefined()
  @IsNumber()
  sortValue: number;
}
