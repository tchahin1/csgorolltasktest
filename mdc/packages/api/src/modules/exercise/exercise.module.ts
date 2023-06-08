import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { AuthModule } from '../auth/auth.module';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';

@Module({
  imports: [CoreModule, PrismaModule, AuthModule],
  providers: [ExerciseService],
  exports: [ExerciseService],
  controllers: [ExerciseController],
})
export class ExerciseModule {}
