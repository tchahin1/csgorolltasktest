import { IsOptional, IsString } from 'class-validator';

export class GetPlansDto {
  @IsOptional()
  @IsString()
  search?: string;
}
