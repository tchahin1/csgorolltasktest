import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { PlayerCronJob } from './player-cron.job';
import { TournamentCronJob } from './tournament-cron.job';

@Module({
  imports: [CoreModule, PrismaModule],
  providers: [TournamentCronJob, PlayerCronJob],
  exports: [TournamentCronJob, PlayerCronJob],
  controllers: [],
})
export class CronModule {}
