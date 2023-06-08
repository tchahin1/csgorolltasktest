import { Injectable } from '@nestjs/common/decorators';
import { Tournament } from '@ankora/models';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { PrismaService } from '@ankora/models/prisma';
import { TournamentRepository } from '@ankora/repository';
import { GetTournamentDto } from './dto/get-tournament.dto';
import { PaginationDto } from '@ankora/common';

@Injectable()
export class TournamentService {
  constructor(private readonly prismaService: PrismaService) {}
  async createTournament(tournamentData: CreateTournamentDto) {
    return this.prismaService.tournament.create({
      data: {
        ...tournamentData,
      },
    });
  }
  async deleteTournament(id: string): Promise<Tournament> {
    return this.prismaService.tournament.delete({
      where: {
        id: id,
      },
    });
  }
  async updateTournament(tournamentData: UpdateTournamentDto) {
    return this.prismaService.tournament.update({
      where: {
        remoteId: tournamentData.remoteId,
      },
      data: {
        ...tournamentData,
      },
    });
  }
  async getAll(data: GetTournamentDto, paginationData: PaginationDto) {
    return TournamentRepository.getAllForPlayer(
      this.prismaService,
      data.playerId,
      { search: data.search, ...paginationData },
    );
  }
  async upsertTournament(tournamentData: CreateTournamentDto) {
    return this.prismaService.tournament.upsert({
      where: {
        remoteId: tournamentData.remoteId,
      },
      update: {
        ...tournamentData,
      },
      create: {
        ...tournamentData,
      },
    });
  }
}
