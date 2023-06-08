import { IsDefined, IsString } from 'class-validator';

export class CreateAssessmentDto {
  @IsDefined()
  @IsString()
  title: string;

  @IsDefined()
  @IsString()
  description: string;

  @IsDefined()
  @IsString()
  notes: string;

  @IsDefined()
  @IsString()
  playerId: string;
}
