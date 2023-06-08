import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ROLE } from '@prisma/client';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  fullName?: string | null;

  @IsNotEmpty()
  role: ROLE;
}
