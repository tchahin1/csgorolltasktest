import { IsOptional } from 'class-validator';
import { PracticeExerciseDto } from './practice-exercise.dto';

export class UpdatePracticeDto {
  @IsOptional()
  questions?: JSON;

  @IsOptional()
  practiceExercises?: PracticeExerciseDto[];
}
