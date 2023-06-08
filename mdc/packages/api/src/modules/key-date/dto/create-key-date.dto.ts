import { IsDate, IsDefined, IsString } from 'class-validator';

export class CreateKeyDateDto {
  @IsString()
  title: string;

  @IsDate()
  @IsDefined()
  startsAt: Date;
}
