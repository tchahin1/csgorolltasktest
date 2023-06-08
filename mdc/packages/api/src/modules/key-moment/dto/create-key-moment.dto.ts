import { IsDefined, IsString } from 'class-validator';
import { KincubeResult } from './kincube-result.dto';

export class CreateKeyMomentDto {
  @IsDefined()
  kincubeData: KincubeResult;

  @IsDefined()
  @IsString()
  sessionId: string;
}
