import { IsDate, IsDefined, IsOptional, IsString } from 'class-validator';

export class GetPlayerObjectivesDto {
  @IsString()
  @IsDefined()
  playerId: string;

  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;
}
