import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../../guards/auth.guard';
import { FileService } from './file.service';
import { GetPresignedUrlDto } from './dto/get-presigned-url.dto';

@Controller('file')
@ApiTags('File')
@UseGuards(AuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/presigned-url')
  async getPresignedUrl(
    @Body() data: GetPresignedUrlDto,
  ): Promise<{ presignedUrl: string; key: string }> {
    return this.fileService.getPresignedUrl(data);
  }
}
