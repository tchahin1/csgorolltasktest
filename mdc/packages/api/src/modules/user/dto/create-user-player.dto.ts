import { IsDefined, IsOptional, IsString } from 'class-validator';
import { SEX } from '@prisma/client';

export class CreatePlayerDto {
  @IsDefined()
  @IsString()
  email: string;

  @IsString()
  @IsDefined()
  fullName: string;

  @IsString()
  @IsDefined()
  password: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  zip?: string;

  @IsOptional()
  sex?: SEX;

  @IsOptional()
  plays?: string[];

  @IsOptional()
  dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  height?: string;

  @IsString()
  @IsOptional()
  weight?: string;

  @IsOptional()
  coaches?: string[];
}
