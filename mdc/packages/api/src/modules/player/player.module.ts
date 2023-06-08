import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { AuthModule } from '../auth/auth.module';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

@Module({
  imports: [CoreModule, PrismaModule, AuthModule],
  providers: [PlayerService],
  exports: [PlayerService],
  controllers: [PlayerController],
})
export class PlayerModule {}
