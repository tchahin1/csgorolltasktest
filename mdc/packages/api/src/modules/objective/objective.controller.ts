import { ApiTags } from '@nestjs/swagger';
import { ROLE } from '@prisma/client';
import { Roles } from '../../decorators/auth.roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/auth.roles.guard';
import { Coach, Objective, Player } from '@ankora/models';
import {
  Delete,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CurrentCoach,
  CurrentPlayer,
} from '../../decorators/currentUser.decorator';
import { GetObjectivesDto } from './dto/get-objectives.dto';
import { ObjectiveService } from './objective.service';
import { GetPlayerObjectivesDto } from './dto/get-player-objectives.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { CreateObjectivesDto } from './dto/create-objectives.dto';
import { EditObjectiveDto } from './dto/edit-objective.dto';

@Controller('objective')
@ApiTags('Objective')
@UseGuards(AuthGuard)
export class ObjectiveController {
  constructor(private readonly objectiveService: ObjectiveService) {}

  @Roles(ROLE.PLAYER)
  @UseGuards(RolesGuard)
  @Get('/player')
  async getObjectivesForCurrentPlayer(
    @CurrentPlayer() player: Player,
    @Query() query: GetObjectivesDto,
  ): Promise<Objective[]> {
    return this.objectiveService.getObjectivesForPlayer(player.id, query);
  }

  @Roles(ROLE.PLAYER)
  @UseGuards(RolesGuard)
  @Get('/player/current')
  async getCurrentPlayerObjective(
    @CurrentPlayer() player: Player,
  ): Promise<Objective> {
    return this.objectiveService.getCurrentPlayerObjective(player.id);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get('/coach')
  async getObjectivesForPlayer(
    @CurrentCoach() coach: Coach,
    @Query() query: GetPlayerObjectivesDto,
  ): Promise<Objective[]> {
    return this.objectiveService.getObjectivesForPlayer(
      query.playerId,
      query,
      coach,
    );
  }

  @Roles(ROLE.PLAYER)
  @UseGuards(RolesGuard)
  @Patch('/progress')
  async updateProgressForPlayerObjective(
    @Body() body: UpdateProgressDto,
  ): Promise<Objective> {
    return this.objectiveService.updateProgressForPlayerObjective(body);
  }
  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Delete('/delete/:id')
  async deleteObjectiveById(
    @Param('id') objectiveId: string,
  ): Promise<Objective> {
    return this.objectiveService.deleteObjectiveById(objectiveId);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Post('/:id')
  async createObjectiveForPlayer(
    @Param('id') id: string,
    @Body() body: CreateObjectivesDto,
  ): Promise<Objective> {
    return this.objectiveService.createObjective(body, id);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Patch('/:id')
  async editObjectiveById(
    @Param('id') objectiveId: string,
    @Body() body: EditObjectiveDto,
  ): Promise<Objective> {
    return this.objectiveService.editObjectiveById(objectiveId, body);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get('/:id')
  async getObjectiveById(@Param('id') objectiveId: string): Promise<Objective> {
    return this.objectiveService.getObjectiveById(objectiveId);
  }
}
