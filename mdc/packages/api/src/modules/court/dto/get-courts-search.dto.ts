import { IsOptional, IsString } from 'class-validator';

export class GetCourtSearchDto {
  @IsOptional()
  @IsString()
  search?: string;
}
