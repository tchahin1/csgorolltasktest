import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { AuthModule } from '../auth/auth.module';
import { QuestionaryModule } from '../questionary/questionary.module';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';

@Module({
  imports: [CoreModule, PrismaModule, AuthModule, QuestionaryModule],
  providers: [AssessmentService],
  exports: [AssessmentService],
  controllers: [AssessmentController],
})
export class AssessmentModule {}
