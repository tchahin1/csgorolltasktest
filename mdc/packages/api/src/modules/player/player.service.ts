import { Injectable } from '@nestjs/common/decorators';
import { PrismaService } from '@ankora/models/prisma';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Coach, Player, User } from '@ankora/models';
import { GetPlayersQueryDto } from './dto/get-players.dto';
import { GetAllPlayersDto } from './dto/get-all-players.dto';
import { CustomSortDto, PaginationDto } from '@ankora/common';
import { PlayerRepository } from '@ankora/repository';
import { UpdatePlayerInjuryDto } from './dto/update-player-injury.dto';
import { UpdateCurrentPlayerDto } from './dto/update-current-player.dto';

@Injectable()
export class PlayerService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPlayerById(playerId: string) {
    const player = await PlayerRepository.getById(this.prismaService, playerId);

    if (!player) {
      throw new Error("Player with this id doesn't exist");
    }
    return player;
  }

  async updatePlayer(playerData: UpdatePlayerDto, user: User) {
    return this.prismaService.player.update({
      where: {
        userId: user.id,
      },
      data: {
        ...playerData,
      },
    });
  }

  async updatePlayerInjury(
    playerData: UpdatePlayerInjuryDto,
    playerId: string,
  ) {
    return this.prismaService.player.update({
      where: {
        id: playerId,
      },
      data: {
        isInjured: playerData.isInjured,
      },
    });
  }

  async deletePlayer(id: string) {
    const playerToDelete = await this.prismaService.player.findFirstOrThrow({
      where: { id },
    });
    return this.prismaService.$transaction([
      this.prismaService.player.delete({
        where: {
          id: id,
        },
      }),
      this.prismaService.user.delete({
        where: {
          id: playerToDelete.userId,
        },
      }),
    ]);
  }

  async getAvailablePlayersForCoach(coach: Coach, options: GetPlayersQueryDto) {
    const { startDate, endDate, ignoreAppointmentId } = options;
    return this.prismaService.player.findMany({
      where: {
        playerCoaches: {
          some: { coachId: coach.id },
        },
        playerAppointments: {
          none: {
            appointment: {
              id: { not: ignoreAppointmentId },
              OR: [
                {
                  startDate: { lte: startDate },
                  endDate: { gte: endDate },
                },
                {
                  startDate: { gte: startDate },
                  endDate: { lte: endDate },
                },
                {
                  startDate: { lt: endDate },
                  endDate: { gt: startDate },
                },
              ],
            },
          },
        },
      },
      include: { user: true },
    });
  }
  async getAllPlayers(
    playerData: GetAllPlayersDto,
    paginationData?: PaginationDto,
    sortData?: CustomSortDto,
  ) {
    const object = await PlayerRepository.getAll(
      this.prismaService,
      playerData.coach,
      { ...paginationData, ...sortData, search: playerData.search },
    );

    return object;
  }
  async getAllPlayersByOrganization(organizationId: string) {
    return this.prismaService.player.findMany({
      where: {
        user: {
          organizationId,
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getCurrentPlayer(player: Player) {
    return this.prismaService.player.findFirst({
      where: {
        id: player.id,
      },
      include: {
        user: true,
        keyDates: true,
        playerCoaches: {
          include: {
            coach: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }
  async updatCurrentPlayer(playerData: UpdateCurrentPlayerDto, player: Player) {
    const fullName = playerData.fullName;
    const data = {
      height: playerData.height,
      plays: playerData.plays,
      sex: playerData.sex,
      dateOfBirth: playerData.dateOfBirth,
    };
    return this.prismaService.player.update({
      where: {
        id: player.id,
      },
      data: {
        ...data,
        user: {
          update: {
            fullName,
          },
        },
      },
      include: {
        user: true,
      },
    });
  }
}
