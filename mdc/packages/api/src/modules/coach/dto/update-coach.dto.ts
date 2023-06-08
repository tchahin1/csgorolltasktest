import { IsString } from 'class-validator';

export class UpdateCoachDto {
  @IsString()
  id: string;
}
