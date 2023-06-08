import { SEX } from '@prisma/client';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateCurrentPlayerDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  plays?: string[];

  @IsOptional()
  sex?: SEX;

  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  height?: string;
}
