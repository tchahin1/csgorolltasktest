import { ROLE } from '@prisma/client';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UserSignupDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  fullName?: string | null;

  @IsNotEmpty()
  role: ROLE;

  @IsNotEmpty()
  firebaseToken: string;
}
