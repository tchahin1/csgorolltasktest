import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { AuthModule } from '../auth/auth.module';
import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';

@Module({
  imports: [CoreModule, PrismaModule, AuthModule],
  providers: [PracticeService],
  exports: [PracticeService],
  controllers: [PracticeController],
})
export class PracticeModule {}
