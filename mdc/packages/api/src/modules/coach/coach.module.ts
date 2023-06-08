import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { AuthModule } from '../auth/auth.module';
import { CoachController } from './coach.controller';
import { CoachService } from './coach.service';

@Module({
  imports: [CoreModule, PrismaModule, AuthModule],
  providers: [CoachService],
  exports: [CoachService],
  controllers: [CoachController],
})
export class CoachModule {}
