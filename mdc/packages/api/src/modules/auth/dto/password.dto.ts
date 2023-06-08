import { ToBoolean } from '@ankora/core';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  generateMobileUrl?: boolean;
}
