import { IsDate, IsDefined, IsOptional, IsString } from 'class-validator';

export class GetCoachTeamsQueryDto {
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
