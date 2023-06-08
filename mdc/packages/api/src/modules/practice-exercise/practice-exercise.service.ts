import { Injectable } from '@nestjs/common/decorators';
import { PrismaService } from '@ankora/models/prisma';
import { CreateUpdatePracticeExerciseDto } from './dto/create-update-practice-exercise.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PracticeExerciseService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPracticeExercise(
    data: CreateUpdatePracticeExerciseDto,
    organizationId: string,
  ) {
    const { exerciseId, ...practiceExerciseData } = data;
    const createData: Prisma.PracticeExerciseCreateInput = {
      ...practiceExerciseData,
      organization: {
        connect: { id: organizationId },
      },
      exercise: exerciseId
        ? {
            connect: { id: exerciseId },
          }
        : undefined,
    };

    return this.prismaService.practiceExercise.create({
      data: createData,
    });
  }

  async updatePracticeExercise(
    data: CreateUpdatePracticeExerciseDto,
    id: string,
  ) {
    return this.prismaService.practiceExercise.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async deletePracticeExercise(id: string) {
    return this.prismaService.practiceExercise.delete({
      where: {
        id,
      },
    });
  }
}
