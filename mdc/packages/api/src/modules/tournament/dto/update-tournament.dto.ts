import { TOURNAMENT_STATUS } from '@prisma/client';
import { IsDefined, IsOptional, IsString } from 'class-validator';

export class UpdateTournamentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  oponent?: string;

  @IsOptional()
  @IsString()
  result?: string;

  @IsOptional()
  @IsString()
  playerId?: string;

  @IsDefined()
  @IsString()
  remoteId: number;

  @IsOptional()
  status?: TOURNAMENT_STATUS;
}
