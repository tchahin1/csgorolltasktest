import { IsNotEmpty, IsString } from 'class-validator';

export class DeletePlayersDto {
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @IsString()
  @IsNotEmpty()
  players: string[];
}
