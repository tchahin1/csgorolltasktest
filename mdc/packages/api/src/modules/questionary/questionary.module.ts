import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { AuthModule } from '../auth/auth.module';
import { QuestionaryController } from './questionary.controller';
import { QuestionaryService } from './questionary.service';

@Module({
  imports: [CoreModule, PrismaModule, AuthModule],
  providers: [QuestionaryService],
  exports: [QuestionaryService],
  controllers: [QuestionaryController],
})
export class QuestionaryModule {}
