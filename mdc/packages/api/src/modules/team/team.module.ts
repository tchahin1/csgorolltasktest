import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [CoreModule, PrismaModule, AuthModule],
  providers: [TeamService],
  exports: [TeamService],
  controllers: [TeamController],
})
export class TeamModule {}
