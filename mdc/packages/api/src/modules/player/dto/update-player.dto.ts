import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SEX } from '@prisma/client';

export class UpdatePlayerDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  height?: string;

  @IsString()
  @IsOptional()
  weight?: string;

  @IsOptional()
  sex?: SEX;
  userId: string;
}
