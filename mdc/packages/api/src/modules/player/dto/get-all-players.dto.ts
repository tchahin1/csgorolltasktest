import { Coach } from '@ankora/models';
import { IsDefined, IsOptional, IsString } from 'class-validator';

export class GetAllPlayersDto {
  @IsDefined()
  coach: Coach;

  @IsOptional()
  @IsString()
  search?: string;
}
