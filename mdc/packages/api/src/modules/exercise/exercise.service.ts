import { Injectable } from '@nestjs/common/decorators';
import { PrismaService } from '@ankora/models/prisma';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseRepository } from '@ankora/repository';
import { Exercise } from '@ankora/models';

@Injectable()
export class ExerciseService {
  constructor(private readonly prismaService: PrismaService) {}

  async createExercise(data: CreateExerciseDto, organizationId: string) {
    return this.prismaService.exercise.create({
      data: {
        name: data.name as string,
        description: data.description,
        videoUrl: data.videoUrl,
        organization: {
          connect: { id: organizationId },
        },
        file: {
          create: {
            url: data.videoUrl,
            key: data.awsKey,
            duration: data.duration,
          },
        },
      },
      include: {
        file: true,
      },
    });
  }

  async updateExercise(data: UpdateExerciseDto, id: string) {
    return this.prismaService.exercise.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async deleteExercise(id: string): Promise<Exercise> {
    return this.prismaService.exercise.delete({
      where: {
        id,
      },
    });
  }

  async getAll(organizationId: string, search?: string) {
    return ExerciseRepository.getAllForOrganization(
      this.prismaService,
      organizationId,
      search,
    );
  }
}
