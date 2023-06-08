import { IsDate, IsString, IsOptional } from 'class-validator';

export class UpdateExerciseDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsDate()
  @IsOptional()
  description: string;

  @IsDate()
  @IsOptional()
  videoUrl: string;
}
