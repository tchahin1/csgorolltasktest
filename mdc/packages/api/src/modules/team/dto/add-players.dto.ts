import { IsNotEmpty, IsString } from 'class-validator';

export class AddPlayersDto {
  @IsNotEmpty()
  @IsString()
  teamId: string;

  @IsNotEmpty()
  players: string[];
}
