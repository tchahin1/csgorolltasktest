import { IsDefined, IsString } from 'class-validator';

export class GetPresignedUrlDto {
  @IsDefined()
  @IsString()
  fileName: string;

  @IsDefined()
  @IsString()
  contentType: string;
}
