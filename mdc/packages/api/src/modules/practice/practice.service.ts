import { Injectable } from '@nestjs/common/decorators';
import { PrismaService } from '@ankora/models/prisma';
import { PracticeRepository } from '@ankora/repository';
import { Coach, Practice } from '@ankora/models';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { UpdatePracticeDto } from './dto/update-practice.dto';
import { MODALITY, Player, PracticePlayer, Prisma, ROLE } from '@prisma/client';
import { AssignPracticeDto } from './dto/assign-practice.dto';
import { AnswerDto } from './dto/answer.dto';

@Injectable()
export class PracticeService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPractice(
    data: CreatePracticeDto,
    organizationId: string,
    coachId: string,
  ) {
    const { practiceExercises, ...dataPractice } = data;
    return this.prismaService.practice.create({
      data: {
        ...dataPractice,
        organization: {
          connect: { id: organizationId },
        },
        coach: {
          connect: { id: coachId },
        },
        practiceExercise:
          dataPractice.modality === MODALITY.VIDEO && practiceExercises
            ? {
                createMany: {
                  data: practiceExercises.map((el) => ({
                    exerciseId: el.exerciseId,
                    reps: el.reps,
                    duration: el.duration,
                    exerciseType: el.exerciseType,
                    organizationId: organizationId,
                    sortValue: el.sortValue,
                  })),
                },
              }
            : undefined,
        questions:
          dataPractice.modality === MODALITY.QUESTION ||
          dataPractice.modality === MODALITY.TODO
            ? JSON.parse(JSON.stringify([dataPractice.questions]))
            : undefined,
      },
      include: {
        practicePlayer: true,
      },
    });
  }

  async updatePractice(
    data: UpdatePracticeDto,
    id: string,
    organizationId: string,
  ) {
    const practiceToUpdate = await this.prismaService.practice.findFirstOrThrow(
      {
        where: {
          id,
          organizationId,
        },
        include: {
          practiceExercise: true,
        },
      },
    );

    let newData: Prisma.PracticeUpdateInput = {};

    if (data.practiceExercises) {
      const practiceExerciseToDelete = practiceToUpdate.practiceExercise.filter(
        (practiceExercise) =>
          !data.practiceExercises?.find(({ id }) => id === practiceExercise.id),
      );

      const practiceExercisesToUpdate = data.practiceExercises.filter(
        (practiceExercise) =>
          practiceToUpdate.practiceExercise.find(
            ({ id }) => id === practiceExercise.id,
          ),
      );

      const practiceExerciseToCreate = data.practiceExercises?.filter(
        ({ id }) => !id,
      );

      newData = {
        ...newData,
        ...{
          practiceExercise: {
            create: practiceExerciseToCreate.map((pe) =>
              Object.assign({ organizationId }, { ...pe }),
            ),
            deleteMany: practiceExerciseToDelete.map((pe) => ({
              AND: {
                practiceId: id,
                exerciseId: pe.exerciseId,
              },
            })),
            update: practiceExercisesToUpdate.map(
              (practiceExerciseToUpdate) => ({
                where: {
                  id: practiceExerciseToUpdate.id,
                },
                data: Object.assign({}, { ...practiceExerciseToUpdate }),
              }),
            ),
          },
        },
      };
    }

    if (data.questions) {
      newData = {
        ...newData,
        questions: JSON.parse(JSON.stringify([data.questions])),
      };
    }

    return this.prismaService.practice.update({
      where: { id },
      data: newData,
      include: {
        practiceExercise: true,
        practicePlayer: true,
      },
    });
  }

  async getOneById(id: string) {
    return PracticeRepository.getPracticeById(this.prismaService, id);
  }

  async getAllForCoach(coach: Coach) {
    return PracticeRepository.getAllForCoach(this.prismaService, coach);
  }

  async assignPlayers(assignData: AssignPracticeDto, id: string) {
    const data = assignData.playerIds.flatMap((player) =>
      assignData.dates.map((date) => ({
        date,
        playerId: player,
        practiceId: id,
      })),
    );
    return this.prismaService.practicePlayer.createMany({
      data,
      skipDuplicates: true,
    });
  }

  playersToCreateAndDelete(
    practice:
      | (Practice & {
          practicePlayer: PracticePlayer[];
        })
      | null,
    playerIds: string[] | undefined,
  ) {
    const playerPracticeToDelete = practice?.practicePlayer.filter(
      (practicePlayer) =>
        !playerIds?.find((player) => player === practicePlayer.playerId),
    );

    const playerPracticeToCreate = playerIds?.filter(
      (player) =>
        !playerPracticeToDelete?.find(
          (playerAppointment) => playerAppointment.playerId === player,
        ),
    );
    return { playerPracticeToCreate, playerPracticeToDelete };
  }

  async markAsCompleted(id: string, playerPracticeId: string) {
    return await this.prismaService.practice.update({
      where: {
        id,
      },
      data: {
        practicePlayer: {
          update: {
            where: {
              id: playerPracticeId,
            },
            data: {
              completed: true,
            },
          },
        },
      },
      include: {
        practicePlayer: true,
      },
    });
  }

  async getAllForPlayer(playerId: string, options?: Prisma.PracticeWhereInput) {
    return await PracticeRepository.getAllForPlayer(
      this.prismaService,
      playerId,
      options,
    );
  }

  async updatePlayerAnswer(
    player: Player,
    answer: AnswerDto,
    id: string,
    playerPracticeId: string,
  ) {
    return await this.prismaService.practice.update({
      where: { id },
      data: {
        practicePlayer: {
          update: {
            where: {
              id: playerPracticeId,
            },
            data: {
              answer: JSON.parse(JSON.stringify([answer.answers])),
            },
          },
        },
      },
    });
  }

  async deletePractice(id: string, coach: Coach): Promise<Practice> {
    const isSuperCoach = coach.user?.role === ROLE.SUPER_COACH;
    const organizationId = coach.user?.organizationId;
    await this.prismaService.practice.findFirstOrThrow({
      where: {
        AND: [
          {
            coachId: isSuperCoach ? undefined : coach.id,
          },
          {
            organizationId: organizationId,
          },
        ],
      },
    });
    return this.prismaService.practice.delete({
      where: {
        id: id,
      },
    });
  }
}
