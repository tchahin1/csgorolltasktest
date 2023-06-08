import { MODALITY, PRACTICE_TYPE } from '@prisma/client';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { PracticeExerciseDto } from './practice-exercise.dto';

export class CreatePracticeDto {
  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsDefined()
  description: string;

  @IsString()
  @IsOptional()
  instructions?: string;

  @IsDefined()
  practiceType: PRACTICE_TYPE;

  @IsDefined()
  modality: MODALITY;

  @IsOptional()
  questions?: JSON;

  @IsOptional()
  practiceExercises?: PracticeExerciseDto[];
}
