import { Module } from '@nestjs/common/decorators';
import { PrismaModule } from '@ankora/models/prisma';
import { KeyMomentService } from './key-moment.service';
import { KeyMomentController } from './key-moment.controller';
import { AuthModule } from '../auth/auth.module';
import { CoreModule } from '@ankora/core';

@Module({
  imports: [CoreModule, PrismaModule, AuthModule],
  controllers: [KeyMomentController],
  providers: [KeyMomentService],
  exports: [KeyMomentService],
})
export class keyMomentModule {}
