import {
  IsDate,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { SEX } from '@prisma/client';

export class UpdateUserPlayerDto {
  @IsString()
  @IsDefined()
  fullName: string;

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

  @IsEnum(SEX)
  @IsOptional()
  sex?: SEX;

  @IsString({ each: true })
  @IsOptional()
  plays?: string[];

  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  height?: string;

  @IsString()
  @IsOptional()
  weight?: string;

  @IsString({ each: true })
  @IsOptional()
  coaches?: string[];
}
