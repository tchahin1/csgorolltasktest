import { IsDefined } from 'class-validator';

export class MarkPracticeDto {
  @IsDefined()
  id: string;

  @IsDefined()
  playerPracticeId: string;
}
