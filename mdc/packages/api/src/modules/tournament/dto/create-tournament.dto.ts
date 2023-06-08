import { TOURNAMENT_STATUS } from '@prisma/client';
import { IsDefined, IsString } from 'class-validator';

export class CreateTournamentDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  oponent: string;

  @IsDefined()
  @IsString()
  result: string;

  @IsDefined()
  @IsString()
  playerId: string;

  @IsDefined()
  @IsString()
  remoteId: number;

  @IsDefined()
  status: TOURNAMENT_STATUS;
}
