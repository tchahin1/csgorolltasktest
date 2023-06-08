import { apiConfig } from '@ankora/config';
import { Player } from '@ankora/models';
import { PrismaService } from '@ankora/models/prisma';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TOURNAMENT_STATUS } from '@prisma/client';
import axios from 'axios';
import { Draw, Event, Result } from './cron.type';

@Injectable()
export class TournamentCronJob {
  constructor(private prismaService: PrismaService) {}

  @Cron('45 15 * * *')
  async handleCron() {
    try {
      const players = await this.prismaService.player.findMany({
        include: { user: true },
      });
      players.forEach(async (player: Player) => {
        const response = await axios.get(
          `${apiConfig.remote.url}/v2/search/players?query=${player.user?.fullName}`,
        );
        if (!response.data.hits[0]) return;
        const id = response.data.hits[0].source.id;
        const tournamentInfo = await axios.get(
          `${apiConfig.remote.url}/v1/player/${id}/results`,
        );
        if (tournamentInfo.data && tournamentInfo.data.events) {
          tournamentInfo.data.events.forEach((event: Event) => {
            const name = event.name;
            event.draws.forEach((draw: Draw) => {
              const remoteId = draw.id;
              draw.results.forEach(async (result: Result) => {
                let result1 = '';
                const winner = `${result.players.winner1.firstName} ${result.players.winner1.lastName}`;
                const loser = `${result.players.loser1.firstName} ${result.players.loser1.lastName}`;
                const score: {
                  [key: string]: { winner: string; loser: string };
                } = {};

                for (const key in result.score) {
                  score[key] = {
                    winner: result.score[key].winner,
                    loser: result.score[key].loser,
                  };
                }
                Object.keys(score).forEach((key) => {
                  result1 += score[key].winner + '-' + score[key].loser + ' ';
                });

                const oponent =
                  winner === player.user?.fullName ? loser : winner;

                const tournament = {
                  remoteId,
                  name,
                  oponent,
                  result: result1,
                  playerId: player.id,
                  status:
                    winner === player.user?.fullName
                      ? TOURNAMENT_STATUS.WIN
                      : TOURNAMENT_STATUS.LOSS,
                };

                await this.prismaService.tournament.upsert({
                  where: {
                    remoteId: remoteId,
                  },
                  update: {
                    ...tournament,
                  },
                  create: {
                    ...tournament,
                  },
                });
              });
            });
          });
        }
      });
    } catch (error) {
      console.error('Error updating tournaments:', error);
    }
  }
}
