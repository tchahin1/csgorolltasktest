import { IsDateString, IsDefined, IsString } from 'class-validator';

export class AssignPracticeDto {
  @IsDefined()
  @IsString({ each: true })
  playerIds: string[];

  @IsDefined()
  @IsDateString({}, { each: true })
  dates: Date[];
}
