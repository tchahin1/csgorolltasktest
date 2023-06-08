import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { AuthModule } from '../auth/auth.module';
import { KeyDateController } from './key-date.controller';
import { KeyDateService } from './key-date.service';

@Module({
  imports: [CoreModule, PrismaModule, AuthModule],
  providers: [KeyDateService],
  exports: [KeyDateService],
  controllers: [KeyDateController],
})
export class KeyDateModule {}
