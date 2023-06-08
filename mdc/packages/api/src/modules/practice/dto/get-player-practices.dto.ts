import { IsDate, IsOptional } from 'class-validator';

export class GetPlayerPracticesDto {
  @IsOptional()
  @IsDate()
  playerPracticeDate?: Date;
}
