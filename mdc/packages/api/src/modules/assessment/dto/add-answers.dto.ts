import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';

class Answer {
  @IsString()
  @IsDefined()
  questionSlug: string;

  @IsDefined()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answer: any;
}

export class AssessmentAnswersDto {
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers: Record<string, unknown>[];
}
