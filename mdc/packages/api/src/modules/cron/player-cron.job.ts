import { apiConfig } from '@ankora/config';
import { Player } from '@ankora/models';
import { PrismaService } from '@ankora/models/prisma';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RANK_STATUS } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class PlayerCronJob {
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
        if (response.data.hits[0].source.threeMonthRatingChangeDetails) {
          const rating =
            response.data.hits[0].source.threeMonthRatingChangeDetails.rating;
          const direction =
            response.data.hits[0].source.threeMonthRatingChangeDetails
              .changeDirection === 'up'
              ? RANK_STATUS.UP
              : RANK_STATUS.DOWN;
          await this.prismaService.player.update({
            where: {
              id: player.id,
            },
            data: {
              rank: rating,
              rankStatus: direction,
            },
          });
        }
      });
    } catch (error) {
      console.error('Error updating tournaments:', error);
    }
  }
}
