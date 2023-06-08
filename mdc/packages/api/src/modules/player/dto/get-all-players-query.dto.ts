import { IsOptional, IsString } from 'class-validator';

export class GetAllPlayersQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
