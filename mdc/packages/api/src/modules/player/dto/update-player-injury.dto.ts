import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdatePlayerInjuryDto {
  @IsBoolean()
  @IsNotEmpty()
  isInjured: boolean;
}
