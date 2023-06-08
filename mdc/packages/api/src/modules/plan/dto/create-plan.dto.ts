import { IsArray, IsDefined, IsNumber, IsString } from 'class-validator';

export class CreatePlanDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsArray()
  tags: string[];

  @IsDefined()
  weeklyPlans: WeeklyPlansDto[];
}

export class WeeklyPlansDto {
  @IsDefined()
  @IsString()
  week: string;
  @IsDefined()
  @IsNumber()
  order: number;
  @IsDefined()
  dailyPlanPractices: DailyPlanPracticesDto[];
}

class DailyPlanPracticesDto {
  @IsDefined()
  @IsNumber()
  day: number;
  @IsDefined()
  practices: string[];
}
