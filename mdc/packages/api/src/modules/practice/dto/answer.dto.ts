import { IsDefined } from 'class-validator';

export class AnswerDto {
  @IsDefined()
  answers: Record<string, unknown>[];
}
