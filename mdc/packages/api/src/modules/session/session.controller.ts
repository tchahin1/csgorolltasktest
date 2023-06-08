import { Player, Session } from '@ankora/models';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Coach, ROLE } from '@prisma/client';
import { Roles } from '../../decorators/auth.roles.decorator';
import {
  CurrentCoach,
  CurrentPlayer,
} from '../../decorators/currentUser.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/auth.roles.guard';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionService } from './session.service';

@Controller('session')
@ApiTags('Session')
@UseGuards(AuthGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Roles(ROLE.PLAYER)
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe({ groups: ['player'] }))
  @Post('/')
  async createSession(
    @CurrentPlayer() player: Player,
    @Body() sessionData: CreateSessionDto,
  ): Promise<Session> {
    return this.sessionService.createSession({
      ...sessionData,
      playerId: player.id,
    });
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe({ groups: ['coach'] }))
  @Post('/from-coach')
  async createSessionFromCoach(
    @CurrentCoach() coach: Coach,
    @Body() sessionData: CreateSessionDto,
  ): Promise<Session> {
    return this.sessionService.createSession({
      ...sessionData,
      coachId: coach.id,
    });
  }

  @Roles(ROLE.PLAYER)
  @UseGuards(RolesGuard)
  @Patch('/:id')
  async updateVideoStatus(
    @Param('id') id: string,
    @CurrentPlayer() player: Player,
  ): Promise<Session> {
    return this.sessionService.updateVideoStatus(id, player);
  }

  @Roles(ROLE.PLAYER)
  @UseGuards(RolesGuard)
  @Get('/')
  async getAllForPlayer(@CurrentPlayer() player: Player): Promise<Session[]> {
    return this.sessionService.getAllForPlayer(player);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Put('/key-moments/:id')
  async findKeyMoments(
    @CurrentCoach() coach: Coach,
    @Param('id') id: string,
  ): Promise<Session> {
    return this.sessionService.findKeyMoments(id, coach);
  }
}
