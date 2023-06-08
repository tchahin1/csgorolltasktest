import { IsDate, IsDefined, IsOptional, IsString } from 'class-validator';

export class AssignPlanDto {
  @IsOptional()
  @IsString({ each: true })
  playerIds?: string[];

  @IsOptional()
  @IsString({ each: true })
  teamIds?: string[];

  @IsDefined()
  planId: string;

  @IsDefined()
  @IsDate()
  startDate: Date;
}
