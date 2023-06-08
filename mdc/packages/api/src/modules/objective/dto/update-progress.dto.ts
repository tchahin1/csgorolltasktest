import { IsDefined, IsString } from 'class-validator';

export class UpdateProgressDto {
  @IsDefined()
  @IsString()
  objectiveId: string;
}
