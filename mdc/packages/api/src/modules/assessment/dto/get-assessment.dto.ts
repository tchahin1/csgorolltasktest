import { IsDefined, IsOptional, IsString } from 'class-validator';

export class GetAssessmentOptions {
  @IsDefined()
  @IsString()
  organizationId: string;

  @IsOptional()
  @IsString()
  playerId?: string;
}
