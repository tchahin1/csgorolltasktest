import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Coach, Player } from '@ankora/models';
import { CoachService } from './coach.service';
import { UpdateCoachDto } from './dto/update-coach.dto';
import {
  CurrentPlayer,
  CurrentUser,
} from '../../decorators/currentUser.decorator';
import { ROLE, User } from '@prisma/client';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from '../../decorators/auth.roles.decorator';
import { RolesGuard } from '../../guards/auth.roles.guard';

@Controller('coach')
@ApiTags('Coach')
@UseGuards(AuthGuard)
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Patch('/')
  async update(
    @CurrentUser() user: User,
    @Body() coach: UpdateCoachDto,
  ): Promise<Coach> {
    return this.coachService.updateCoach(coach, user);
  }
  @Delete('/')
  async deleteCoach(@CurrentUser() user: User): Promise<Coach> {
    return this.coachService.deleteCoach(user.id);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get()
  async getAllCoachesForOrganization(
    @CurrentUser() user: User,
  ): Promise<Coach[]> {
    return this.coachService.getAllCoachesForOrganization(user.organizationId);
  }

  @Roles(ROLE.PLAYER)
  @UseGuards(RolesGuard)
  @Get('/player')
  async getAllCoachesForPlayer(
    @CurrentPlayer() player: Player,
  ): Promise<Coach[]> {
    return this.coachService.getAllCoachesForPlayer(player.id);
  }
}
