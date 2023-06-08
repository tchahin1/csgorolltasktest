import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetAppointmentForPlayerDto {
  @IsNotEmpty()
  @IsString()
  playerId: string;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;
}
