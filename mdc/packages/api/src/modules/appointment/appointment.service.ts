import { Injectable } from '@nestjs/common/decorators';
import { Coach, User } from '@ankora/models';
import { PrismaService } from '@ankora/models/prisma';
import { UpsertAppointmentDto } from './dto/upsert-appointment.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { AppointmentRepository } from '@ankora/repository';
import { GetAppointmentsQuery } from './dto/get-appointment.dto';
import { isEqual } from 'lodash';
import { Prisma, ROLE } from '@prisma/client';
import dayjs = require('dayjs');

@Injectable()
export class AppointmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async createAppointment(
    data: UpsertAppointmentDto,
    coachIds: string[],
    user: User,
  ) {
    const {
      court,
      players = [],
      team: teamId,
      practice,
      endDate,
      startDate,
      objectives,
      title,
      assessmentId,
    } = data;
    // Save all players, including the ones from team
    const playerIds = await this.getAllPlayers(players, teamId);
    const upsertData: Prisma.AppointmentCreateInput = {
      practice,
      startDate,
      endDate,
      objectives,
      title,
      coachAppointments: {
        createMany: { data: coachIds.map((el) => ({ coachId: el })) },
      },
      playerAppointments: {
        create: playerIds.map((playerId) => ({ playerId })),
      },
      team: teamId ? { connect: { id: teamId } } : undefined,
      organization: {
        connect: { id: user.organizationId },
      },
      assessment: assessmentId
        ? {
            connect: { id: assessmentId },
          }
        : undefined,
      court: court ? { connect: { id: court } } : undefined,
    };

    await this.checkAvailability(
      startDate,
      endDate,
      [],
      court,
      playerIds,
      coachIds,
    );

    return this.prismaService.appointment.create({
      data: upsertData,
    });
  }

  async createAppointmentForSuperCoach(data: UpsertAppointmentDto, user: User) {
    const { coachIds } = data;

    return this.createAppointment(data, coachIds || [], user);
  }

  async updateAppointmentForSuperCoach(id: string, data: UpsertAppointmentDto) {
    return this.updateAppointment(id, data, data.coachIds || [], true);
  }

  private async getAllPlayers(players: string[], teamId?: string) {
    let playerIds: string[] = players;

    if (teamId) {
      const teamData = await this.prismaService.team.findFirstOrThrow({
        where: { id: teamId },
        include: { teamPlayers: true },
      });
      playerIds = teamData.teamPlayers.map((teamPlayer) => teamPlayer.playerId);
    }

    return playerIds;
  }

  // Check if court is available in startDate-endDate period
  // or if any of players or coach has another appointment in given period
  async checkAvailability(
    startDate: Date,
    endDate: Date,
    excludeAppointmentIds: string[] = [],
    courtId?: string,
    playerIds?: string[],
    coachIds?: string[],
  ) {
    const timeRangeQuery = {
      OR: [
        {
          startDate: { lte: startDate },
          endDate: { gte: endDate },
        },
        {
          startDate: { gte: startDate },
          endDate: { lte: endDate },
        },
        {
          startDate: { lt: endDate },
          endDate: { gt: startDate },
        },
      ],
    };

    const searchQuery = [];

    if (courtId) {
      searchQuery.push({
        AND: {
          courtId,
          OR: timeRangeQuery.OR,
        },
      });
    }

    if (playerIds) {
      searchQuery.push({
        AND: {
          playerAppointments: {
            some: { playerId: { in: playerIds } },
          },
          OR: timeRangeQuery.OR,
        },
      });
    }

    if (coachIds) {
      searchQuery.push({
        AND: {
          coachAppointments: { some: { coachId: { in: coachIds } } },

          OR: timeRangeQuery.OR,
        },
      });
    }

    const appointment = await this.prismaService.appointment.findFirst({
      where: {
        id: {
          notIn: excludeAppointmentIds,
        },
        OR: searchQuery,
      },
      include: { coachAppointments: true },
    });
    if (!appointment) return 'All resources are available';

    if (appointment?.courtId === courtId)
      throw new BadRequestException('Court is already booked at this time.)');
    else if (
      appointment.coachAppointments.find((coachAppointment) =>
        coachIds?.includes(coachAppointment.coachId),
      ) &&
      !this.checkDate(startDate, appointment.endDate)
    )
      throw new BadRequestException('Coach is already booked at this time.)');
    else if (!this.checkDate(startDate, appointment.endDate))
      throw new BadRequestException('Player is already booked at this time.)');
  }

  checkDate(startDate: Date, endDate: Date) {
    return (
      dayjs(startDate).isSame(endDate) &&
      !dayjs(startDate).isAfter(dayjs(startDate)) &&
      !dayjs(startDate).isBefore(endDate)
    );
  }

  async getAppointmentsForPlayer(
    playerId: string,
    options: { startDate?: Date; endDate?: Date },
  ) {
    return AppointmentRepository.getAllForPlayer(
      this.prismaService,
      playerId,
      options,
    );
  }

  async updateAppointment(
    id: string,
    data: UpsertAppointmentDto,
    coachIds: string[],
    isSuperCoach?: boolean,
  ) {
    const {
      court,
      players = [],
      team: teamId,
      practice,
      endDate,
      startDate,
      objectives,
      title,
    } = data;

    const appointmentToUpdate = await this.prismaService.appointment.findFirst({
      where: {
        id,
        coachAppointments: isSuperCoach
          ? undefined
          : {
              some: { coachId: { in: coachIds } },
            },
      },
      include: { playerAppointments: true, coachAppointments: true },
    });

    if (!appointmentToUpdate) throw new Error("Appointment doesn't exists");

    // Save all players, including the ones from team

    const playerIds = await this.getAllPlayers(players, teamId);

    const isAvailable = await this.checkAvailability(
      startDate,
      endDate,
      [id],
      court === appointmentToUpdate.courtId ? undefined : court,
      isEqual(
        playerIds,
        appointmentToUpdate.playerAppointments.map(
          (playerApp) => playerApp.playerId,
        ),
      )
        ? undefined
        : playerIds,
      isEqual(
        coachIds,
        appointmentToUpdate.coachAppointments.map(
          (coachAppointment) => coachAppointment.coachId,
        ),
      )
        ? undefined
        : coachIds,
    );

    if (!isAvailable) {
      throw new BadRequestException(
        'Court, coach or players not available at this period',
      );
    }

    const playerAppointmentsToDelete =
      appointmentToUpdate.playerAppointments.filter(
        (playerAppointment) =>
          !playerIds.find((player) => player === playerAppointment.playerId),
      );

    const playerAppointmentsToCreate = playerIds.filter(
      (player) =>
        !playerAppointmentsToDelete.find(
          (playerAppointment) => playerAppointment.playerId === player,
        ),
    );

    const coachAppointmentsToDelete =
      appointmentToUpdate.coachAppointments.filter(
        (coachAppointment) =>
          !coachIds.find((coachId) => coachId === coachAppointment.coachId),
      );

    const coachAppointmentsToCreate = coachIds.filter(
      (coachId) =>
        !coachAppointmentsToDelete.find(
          (appointment) => appointment.coachId === coachId,
        ),
    );

    const [appointment] = await this.prismaService.$transaction([
      this.prismaService.appointment.update({
        where: { id },
        data: {
          practice,
          startDate,
          endDate,
          objectives,
          title,
          coachAppointments: {
            connectOrCreate: coachAppointmentsToCreate.map((coach) => ({
              where: {
                appointmentId_coachId: { coachId: coach, appointmentId: id },
              },
              create: { coachId: coach },
            })),
            deleteMany: {
              AND: {
                coachId: {
                  in: coachAppointmentsToDelete.map(
                    (coachAppointment) => coachAppointment.coachId,
                  ),
                },
                appointmentId: id,
              },
            },
          },
          court: { connect: { id: court } },
          playerAppointments: {
            connectOrCreate: playerAppointmentsToCreate.map((player) => ({
              where: {
                appointmentId_playerId: { playerId: player, appointmentId: id },
              },
              create: { playerId: player },
            })),
            deleteMany: {
              AND: {
                playerId: {
                  in: playerAppointmentsToDelete.map(
                    (playerAppointment) => playerAppointment.playerId,
                  ),
                },
                appointmentId: id,
              },
            },
          },

          team: teamId ? { connect: { id: teamId } } : { disconnect: true },
        },
      }),
      this.prismaService.playerAppointment.deleteMany({
        where: {
          AND: {
            playerId: {
              in: playerAppointmentsToDelete.map(
                (playerAppointment) => playerAppointment.playerId,
              ),
            },
            appointmentId: id,
          },
        },
      }),
    ]);

    return appointment;
  }

  async deleteAppointment(id: string, coach: Coach, role: ROLE) {
    await this.prismaService.appointment.findFirstOrThrow({
      where: {
        id,
        coachAppointments: {
          some: {
            coachId: role === ROLE.SUPER_COACH ? undefined : coach.id,
          },
        },
      },
    });
    return this.prismaService.appointment.delete({
      where: {
        id,
      },
    });
  }

  async getAppointmentsByOrganization(
    organizationId: string,
    options: GetAppointmentsQuery,
  ) {
    const appointments = await AppointmentRepository.getAll(
      this.prismaService,
      organizationId,
      options,
    );
    return appointments;
  }
}
