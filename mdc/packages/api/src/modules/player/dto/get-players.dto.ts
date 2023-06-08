import { IsDate, IsDefined, IsOptional, IsString } from 'class-validator';

export class GetPlayersQueryDto {
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
