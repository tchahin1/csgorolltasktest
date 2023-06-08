import { IsOptional, IsString } from 'class-validator';

export class GetExerciseDto {
  @IsOptional()
  @IsString()
  search?: string;
}
