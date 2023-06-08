import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../decorators/auth.roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/auth.roles.guard';
import { Coach, Player, Practice, User } from '@ankora/models';
import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import {
  CurrentCoach,
  CurrentPlayer,
  CurrentUser,
} from '../../decorators/currentUser.decorator';
import { PracticeService } from './practice.service';

import { Prisma, ROLE } from '@prisma/client';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { UpdatePracticeDto } from './dto/update-practice.dto';
import { AssignPracticeDto } from './dto/assign-practice.dto';
import { AnswerDto } from './dto/answer.dto';
import { MarkPracticeDto } from './dto/mark-practice.dto';
import { GetPlayerPracticesDto } from './dto/get-player-practices.dto';

@Controller('practice')
@ApiTags('Practice')
@UseGuards(AuthGuard)
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Post('/')
  async create(
    @CurrentUser() user: User,
    @CurrentCoach() coach: Coach,
    @Body() data: CreatePracticeDto,
  ): Promise<Practice> {
    return this.practiceService.createPractice(
      data,
      user.organizationId,
      coach.id,
    );
  }
  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Delete('/:id')
  async delete(
    @Param('id') id: string,
    @CurrentCoach() coach: Coach,
  ): Promise<Practice> {
    return this.practiceService.deletePractice(id, coach);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Patch('/update/:id')
  async updatePractice(
    @Param('id') id: string,
    @Body() data: UpdatePracticeDto,
    @CurrentUser() user: User,
  ): Promise<Practice> {
    return this.practiceService.updatePractice(data, id, user.organizationId);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Patch('/assign/:id')
  async assignPractice(
    @Param('id') id: string,
    @Body() data: AssignPracticeDto,
  ): Promise<Prisma.BatchPayload> {
    return this.practiceService.assignPlayers(data, id);
  }

  @Roles(ROLE.PLAYER)
  @UseGuards(RolesGuard)
  @Patch('/completed')
  async markAsCompleted(@Query() query: MarkPracticeDto): Promise<Practice> {
    return this.practiceService.markAsCompleted(
      query.id,
      query.playerPracticeId,
    );
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get('/get-one/:id')
  async getPractice(@Param('id') id: string): Promise<Practice> {
    return this.practiceService.getOneById(id);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get('/coach/get-all')
  async getPracticeForCoach(@CurrentCoach() coach: Coach): Promise<Practice[]> {
    return this.practiceService.getAllForCoach(coach);
  }

  @Roles(ROLE.PLAYER)
  @UseGuards(RolesGuard)
  @Get('/player/get-all')
  async getPracticeForPlayer(
    @CurrentPlayer() player: Player,
    @Query() data?: GetPlayerPracticesDto,
  ): Promise<Practice[]> {
    return this.practiceService.getAllForPlayer(player.id, {
      practicePlayer: {
        some: {
          playerId: player.id,
          date: data?.playerPracticeDate,
        },
      },
    });
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get('/player/:playerId/get-all')
  async getPlayerPracticesForCoach(
    @CurrentUser() user: User,
    @Param('playerId') playerId: string,
  ): Promise<Practice[]> {
    return this.practiceService.getAllForPlayer(playerId, {
      organizationId: user.organizationId,
    });
  }

  @Roles(ROLE.PLAYER)
  @UseGuards(RolesGuard)
  @Patch('/answer')
  async updatePlayerAnswer(
    @CurrentPlayer() player: Player,
    @Query() query: MarkPracticeDto,
    @Body() data: AnswerDto,
  ): Promise<Practice> {
    return this.practiceService.updatePlayerAnswer(
      player,
      data,
      query.id,
      query.playerPracticeId,
    );
  }
}
