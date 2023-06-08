import { Coach, Team } from '@ankora/models';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ROLE, User } from '@prisma/client';
import { Roles } from '../../decorators/auth.roles.decorator';
import {
  CurrentCoach,
  CurrentUser,
} from '../../decorators/currentUser.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/auth.roles.guard';
import { AddPlayersDto } from './dto/add-players.dto';
import { GetCoachTeamsQueryDto } from './dto/get-teams.dto';
import { CreateTeamDto } from './dto/team.dto';
import { TeamService } from './team.service';

@Controller('team')
@ApiTags('Team')
@UseGuards(AuthGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Post('/')
  async createTeam(
    @CurrentUser() user: User,
    @Body() team: CreateTeamDto,
  ): Promise<Team> {
    return this.teamService.createTeam(team, user);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get('/')
  async getTeams(): Promise<Team[]> {
    return this.teamService.getTeams();
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get('/coach')
  async getCoachTeams(
    @CurrentCoach() coach: Coach,
    @Query() query: GetCoachTeamsQueryDto,
  ): Promise<Team[]> {
    return this.teamService.getAvailableTeamsForCoach(coach.id, query);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Patch('update-team-players')
  async updateTeamPlayers(@Body() playerData: AddPlayersDto): Promise<Team> {
    return this.teamService.addPlayersToTeams(playerData);
  }
}
