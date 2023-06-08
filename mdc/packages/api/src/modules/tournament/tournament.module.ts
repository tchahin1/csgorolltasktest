import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { AuthModule } from '../auth/auth.module';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';

@Module({
  imports: [CoreModule, PrismaModule, AuthModule],
  providers: [TournamentService],
  exports: [TournamentService],
  controllers: [TournamentController],
})
export class TournamentModule {}
