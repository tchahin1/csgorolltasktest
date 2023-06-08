import { IsDate, IsDefined, IsOptional, IsString } from 'class-validator';

export class GetCourtsQueryDto {
  @IsDate()
  @IsDefined()
  startDate: Date;

  @IsDate()
  @IsDefined()
  endDate: Date;

  @IsString()
  @IsOptional()
  ignoreAppointmentId?: string;
}
