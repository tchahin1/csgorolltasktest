import { Injectable } from '@nestjs/common';
import { PrismaService } from '@ankora/models/prisma';
import { User } from '@ankora/models';
import { CreateTeamDto } from './dto/team.dto';
import { AddPlayersDto } from './dto/add-players.dto';
import { GetCoachTeamsQueryDto } from './dto/get-teams.dto';

@Injectable()
export class TeamService {
  constructor(private readonly prismaService: PrismaService) {}
  async createTeam(teamData: CreateTeamDto, user: User) {
    let teamPlayers: { playerId: string }[] = [];
    if (teamData.players) {
      teamPlayers = teamData.players.map((player) => ({ playerId: player }));
    }
    return this.prismaService.team.create({
      data: {
        name: teamData.name,
        coach: { connect: { id: teamData.coachId } },
        teamPlayers: { create: teamPlayers },
        organization: {
          connect: { id: user.organizationId },
        },
      },
      include: {
        coach: true,
        teamPlayers: {
          include: {
            player: true,
          },
        },
      },
    });
  }

  async getTeams() {
    return this.prismaService.team.findMany({
      include: {
        teamPlayers: true,
        coach: true,
      },
    });
  }

  async getAvailableTeamsForCoach(
    coachId: string,
    options: GetCoachTeamsQueryDto,
  ) {
    const { startDate, endDate, ignoreAppointmentId } = options;
    return this.prismaService.team.findMany({
      where: {
        coachId,
        teamPlayers: {
          every: {
            player: {
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
                        startDate: { gte: startDate, lte: endDate },
                      },
                      {
                        endDate: { gte: startDate, lte: endDate },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async addPlayersToTeams(addPlayersData: AddPlayersDto) {
    let teamPlayers: { playerId: string }[] = [];
    if (addPlayersData.players) {
      teamPlayers = addPlayersData.players.map((player) => ({
        playerId: player,
      }));
    }

    return this.prismaService.team.update({
      where: {
        id: addPlayersData.teamId,
      },
      data: {
        teamPlayers: {
          create: teamPlayers,
        },
      },
      include: {
        teamPlayers: true,
        coach: true,
      },
    });
  }
}
