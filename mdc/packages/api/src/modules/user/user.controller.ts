import { Coach, User } from '@ankora/models';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ROLE } from '@prisma/client';
import { Roles } from '../../decorators/auth.roles.decorator';
import { CurrentCoach } from '../../decorators/currentUser.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/auth.roles.guard';
import { CreatePlayerDto } from './dto/create-user-player.dto';
import { UpdateUserPlayerDto } from './dto/update-user-player.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:email')
  async getUser(@Param('email') email: string): Promise<{ role: ROLE } | null> {
    return this.userService.getRoleFromUser(email);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post('/player/create')
  async createPlayer(@Body() playerData: CreatePlayerDto): Promise<User> {
    return this.userService.createPlayer(playerData);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch('/player/update/:email')
  async updatePlayer(
    @Param('email') email: string,
    @CurrentCoach() coach: Coach,
    @Body() playerData: UpdateUserPlayerDto,
  ): Promise<User> {
    return this.userService.updatePlayer(playerData, coach, email);
  }
}
