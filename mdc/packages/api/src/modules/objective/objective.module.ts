import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { AuthModule } from '../auth/auth.module';
import { ObjectiveController } from './objective.controller';
import { ObjectiveService } from './objective.service';

@Module({
  imports: [CoreModule, PrismaModule, AuthModule],
  providers: [ObjectiveService],
  exports: [ObjectiveService],
  controllers: [ObjectiveController],
})
export class ObjectiveModule {}
