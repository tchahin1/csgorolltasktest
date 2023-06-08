import {
  CustomSortDto,
  GetCustomSort,
  GetPagination,
  PaginationDto,
} from '@ankora/common';
import { ContextService } from '@ankora/core';
import { Coach, Player } from '@ankora/models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ROLE, User } from '@prisma/client';
import { Roles } from '../../decorators/auth.roles.decorator';
import {
  CurrentCoach,
  CurrentPlayer,
  CurrentUser,
} from '../../decorators/currentUser.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/auth.roles.guard';
import { GetAllPlayersQueryDto } from './dto/get-all-players-query.dto';
import { GetPlayersQueryDto } from './dto/get-players.dto';
import { UpdateCurrentPlayerDto } from './dto/update-current-player.dto';
import { UpdatePlayerInjuryDto } from './dto/update-player-injury.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayerService } from './player.service';

@Controller('player')
@ApiTags('Player')
@UseGuards(AuthGuard)
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
    private readonly contextService: ContextService,
  ) {}

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get('/coach')
  async getAvailablePlayersForCoach(
    @CurrentCoach() coach: Coach,
    @Query() query: GetPlayersQueryDto,
  ): Promise<Player[]> {
    return this.playerService.getAvailablePlayersForCoach(coach, query);
  }

  @Patch('/')
  async editPlayer(
    @CurrentUser() user: User,
    @Body() player: UpdatePlayerDto,
  ): Promise<Player> {
    return this.playerService.updatePlayer(player, user);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Patch('/injury/:id')
  async updateInjuryStatus(
    @Body() player: UpdatePlayerInjuryDto,
    @Param('id') id: string,
  ): Promise<Player> {
    return this.playerService.updatePlayerInjury(player, id);
  }

  @Roles(ROLE.PLAYER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete('/')
  async deletePlayer(@CurrentPlayer() player: Player): Promise<[Player, User]> {
    return this.playerService.deletePlayer(player.id);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get('/all-players')
  async getAllPlayerForCoach(
    @GetPagination() pagination: PaginationDto,
    @GetCustomSort() sortData: CustomSortDto,
    @Query() playerData: GetAllPlayersQueryDto,
    @CurrentCoach() coach: Coach,
  ): Promise<Player[]> {
    this.contextService.addMeta('pageSize', pagination.pageSize);
    this.contextService.addMeta('page', pagination.page);
    const object = await this.playerService.getAllPlayers(
      { ...playerData, coach: coach },
      pagination,
      sortData,
    );

    this.contextService.addMeta('count', object.count);
    return object.players;
  }

  @UseGuards(RolesGuard)
  @Get('/organization')
  async getAllPlayersByOrganization(
    @CurrentUser() user: User,
  ): Promise<Player[]> {
    const players = await this.playerService.getAllPlayersByOrganization(
      user.organizationId,
    );
    return players;
  }

  @Roles(ROLE.PLAYER)
  @UseGuards(RolesGuard)
  @Get('/current')
  async getCurrentPlayer(
    @CurrentPlayer() player: Player,
  ): Promise<Player | null> {
    return this.playerService.getCurrentPlayer(player);
  }

  @Roles(ROLE.PLAYER)
  @UseGuards(RolesGuard)
  @Patch('/current')
  async updateCurrentPlayer(
    @CurrentPlayer() player: Player,
    @Body() updateData: UpdateCurrentPlayerDto,
  ): Promise<Player> {
    return this.playerService.updatCurrentPlayer(updateData, player);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get('/:id')
  async getPlayerById(@Param('id') id: string): Promise<Player> {
    return this.playerService.getPlayerById(id);
  }
}
