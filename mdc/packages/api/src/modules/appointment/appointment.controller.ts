import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CurrentCoach,
  CurrentPlayer,
  CurrentUser,
} from '../../decorators/currentUser.decorator';
import { ROLE } from '@prisma/client';
import { AuthGuard } from '../../guards/auth.guard';
import { Appointment, Coach, Player, User } from '@ankora/models';
import { AppointmentService } from './appointment.service';
import { UpsertAppointmentDto } from './dto/upsert-appointment.dto';
import { RolesGuard } from '../../guards/auth.roles.guard';
import { Roles } from '../../decorators/auth.roles.decorator';
import { GetAppointmentsQuery } from './dto/get-appointment.dto';
import { GetAppointmentForPlayerDto } from './dto/get-appointment-for-player.dto';
import { GetAppointmentForCurrentPlayerDto } from './dto/get-appointment-for-current-player.dto';

@Controller('appointment')
@ApiTags('Appointment')
@UseGuards(AuthGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('/')
  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  async create(
    @CurrentCoach() coach: Coach,
    @CurrentUser() user: User,
    @Body() data: UpsertAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.createAppointment(data, [coach.id], user);
  }

  @Post('/super-coach/')
  @Roles(ROLE.SUPER_COACH)
  @UseGuards(RolesGuard)
  async createWithCoachIds(
    @CurrentUser() user: User,
    @Body() data: UpsertAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.createAppointmentForSuperCoach(data, user);
  }

  @Get('/coach')
  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  async get(
    @CurrentUser() user: User,
    @Query() data: GetAppointmentsQuery,
  ): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByOrganization(
      user.organizationId,
      data,
    );
  }

  @Put(':id')
  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  async update(
    @CurrentCoach() coach: Coach,
    @Param('id') appointmentId: string,
    @Body() data: UpsertAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.updateAppointment(
      appointmentId,
      data,
      [coach.id],
      false,
    );
  }

  @Put('/super-coach/:id')
  @Roles(ROLE.SUPER_COACH)
  @UseGuards(RolesGuard)
  async updateWithCoachIds(
    @Param('id') appointmentId: string,
    @Body() data: UpsertAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.updateAppointmentForSuperCoach(
      appointmentId,
      data,
    );
  }

  @Get('/player')
  @Roles(ROLE.PLAYER)
  @UseGuards(RolesGuard)
  async getAppointmentsForPlayer(
    @CurrentPlayer() player: Player,
    @Query() appointment: GetAppointmentForCurrentPlayerDto,
  ): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsForPlayer(player.id, {
      startDate: appointment.startDate,
      endDate: appointment.endDate,
    });
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async delete(
    @CurrentCoach() coach: Coach,
    @CurrentUser() user: User,
    @Param('id') appointmentId: string,
  ): Promise<Appointment> {
    return this.appointmentService.deleteAppointment(
      appointmentId,
      coach,
      user.role,
    );
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get('/player-coach')
  async getAllForPlayer(
    @Query() appointment: GetAppointmentForPlayerDto,
  ): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsForPlayer(
      appointment.playerId,
      { startDate: appointment.startDate, endDate: appointment.endDate },
    );
  }
}
