import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { AuthModule } from '../auth/auth.module';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
  imports: [CoreModule, PrismaModule, AuthModule],
  providers: [PlanService],
  exports: [PlanService],
  controllers: [PlanController],
})
export class PlanModule {}
