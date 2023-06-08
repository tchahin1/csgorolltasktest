import { IsDefined, IsOptional, IsString } from 'class-validator';

export class GetTournamentDto {
  @IsDefined()
  @IsString()
  playerId: string;

  @IsOptional()
  @IsString()
  search?: string;
}
