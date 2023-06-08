import { IsDate, IsOptional } from 'class-validator';

export class GetAppointmentForCurrentPlayerDto {
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;
}
