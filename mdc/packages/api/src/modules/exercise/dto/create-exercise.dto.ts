import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsDefined()
  description: string;

  @IsString()
  @IsDefined()
  videoUrl: string;

  @IsNotEmpty()
  @IsString()
  awsKey: string;

  @IsOptional()
  @IsNumber()
  duration?: number;
}
