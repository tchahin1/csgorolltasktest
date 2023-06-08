import { VIDEO_STATUS } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsOptional()
  @IsString()
  opponentId?: string;

  @IsOptional({ groups: ['coach'] })
  @IsNotEmpty({ groups: ['player'] })
  @IsString()
  coachId?: string;

  @IsNotEmpty()
  @IsString()
  videoUrl: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  awsKey: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsString()
  playerId?: string;

  @IsOptional()
  videoStatus?: VIDEO_STATUS;
}
