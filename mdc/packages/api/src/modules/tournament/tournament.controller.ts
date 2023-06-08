import { GetPagination, PaginationDto } from '@ankora/common';
import { ContextService } from '@ankora/core';
import { Tournament } from '@ankora/models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { GetTournamentDto } from './dto/get-tournament.dto';
import { TournamentService } from './tournament.service';

@Controller('tournament')
@ApiTags('Tournament')
@UseGuards(AuthGuard)
export class TournamentController {
  constructor(
    private readonly tournamentService: TournamentService,
    private readonly contextService: ContextService,
  ) {}

  @Post('/')
  async create(@Body() tournament: CreateTournamentDto): Promise<Tournament> {
    return this.tournamentService.createTournament(tournament);
  }

  @Get('/')
  async getAllForPlayer(
    @GetPagination() pagination: PaginationDto,
    @Query() data: GetTournamentDto,
  ): Promise<Tournament[] | null> {
    this.contextService.addMeta('pageSize', pagination.pageSize);
    this.contextService.addMeta('page', pagination.page);
    const object = await this.tournamentService.getAll(data, pagination);
    this.contextService.addMeta('count', await object.count);
    return object.tournaments;
  }

  @Delete('/')
  async deleteCoach(@Param() id: string): Promise<Tournament> {
    return this.tournamentService.deleteTournament(id);
  }
}
