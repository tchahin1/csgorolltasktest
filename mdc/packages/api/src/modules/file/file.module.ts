import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [CoreModule, PrismaModule],
  providers: [FileService],
  exports: [FileService],
  controllers: [FileController],
})
export class FileModule {}
