import { IsDate, IsDefined, IsOptional } from 'class-validator';

export class GetAppointmentsQuery {
  @IsDate()
  @IsDefined()
  from: Date;

  @IsDate()
  @IsDefined()
  to: Date;

  @IsOptional()
  coachIds?: string[];

  @IsOptional()
  courtIds?: string[];

  @IsOptional()
  playerIds?: string[];
}
