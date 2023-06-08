import { ApiTags } from '@nestjs/swagger';
import { ROLE } from '@prisma/client';
import { Roles } from '../../decorators/auth.roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/auth.roles.guard';
import { CreateKeyDateDto } from './dto/create-key-date.dto';
import { Coach, KeyDate } from '@ankora/models';
import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { CurrentCoach } from '../../decorators/currentUser.decorator';
import { GetKeyDatesQueryDto } from './dto/get-key-dates.dto';
import { KeyDateService } from './key-date.service';

@Controller('key-date')
@ApiTags('KeyDate')
@UseGuards(AuthGuard)
export class KeyDateController {
  constructor(private readonly keyDateService: KeyDateService) {}

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Post('/:playerId')
  async create(
    @Param('playerId') playerId: string,
    @Body() data: CreateKeyDateDto,
  ): Promise<KeyDate> {
    return this.keyDateService.createKeyDate(playerId, data);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get('/:playerId')
  async getKeyDatesByPlayerId(
    @CurrentCoach() coach: Coach,
    @Param('playerId') playerId: string,
    @Query() query: GetKeyDatesQueryDto,
  ): Promise<KeyDate[]> {
    return this.keyDateService.getKeyDatesForPlayer(coach, playerId, query);
  }
}
