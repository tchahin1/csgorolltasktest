import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { AuthModule } from '../auth/auth.module';
import { PracticeExerciseController } from './practice-exercise.controller';
import { PracticeExerciseService } from './practice-exercise.service';

@Module({
  imports: [CoreModule, PrismaModule, AuthModule],
  providers: [PracticeExerciseService],
  exports: [PracticeExerciseService],
  controllers: [PracticeExerciseController],
})
export class PracticeExerciseModule {}
