import { Injectable } from '@nestjs/common/decorators';
import { PrismaService } from '@ankora/models/prisma';
import { GetObjectivesDto } from './dto/get-objectives.dto';
import { ObjectiveRepository } from '@ankora/repository';
import { Coach } from '@ankora/models';
import { UpdateProgressDto } from './dto/update-progress.dto';
import * as dayjs from 'dayjs';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as dayjsBusinessDays from 'dayjs-business-time';
import { CreateObjectivesDto } from './dto/create-objectives.dto';
import { EditObjectiveDto } from './dto/edit-objective.dto';

dayjs.extend(dayjsBusinessDays);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

@Injectable()
export class ObjectiveService {
  constructor(private readonly prismaService: PrismaService) {}

  async getObjectivesForPlayer(
    playerId: string,
    options: GetObjectivesDto,
    coach?: Coach,
  ) {
    const { startDate, endDate } = options;
    return ObjectiveRepository.getAllByPlayerId(
      this.prismaService,
      playerId,
      coach,
      {
        from: startDate,
        to: endDate,
      },
    );
  }

  async updateProgressForPlayerObjective(query: UpdateProgressDto) {
    const objective = await this.prismaService.objective.findFirst({
      where: {
        id: query.objectiveId,
      },
    });
    if (!objective) throw new Error('Objective not found');
    if (objective?.progress >= 100) throw new Error('Objective is done');

    const startDate = objective.startDate.toDateString();
    const endDate = objective.endDate.toDateString();
    const currentDate = new Date().toDateString();

    const numberOfWorkingDays = dayjs(startDate).businessDaysDiff(
      dayjs(endDate),
    );
    let progress = objective.progress + (1 / numberOfWorkingDays) * 100;
    if (progress > 99) progress = 100; //Added this because it will go to 99.99999%

    if (objective.lastInput) {
      if (
        dayjs(currentDate).isSame(dayjs(objective.lastInput.toDateString()))
      ) {
        throw new Error("Can't update progress twice in the same day");
      }
    }
    if (
      dayjs(currentDate).isSameOrAfter(dayjs(startDate)) &&
      dayjs(currentDate).isSameOrBefore(endDate) // Added this part so we can check if the startDate is today, we dont consider the time of the startDate
    ) {
      return this.prismaService.objective.update({
        where: {
          id: query.objectiveId,
        },
        data: {
          progress,
          lastInput: new Date(),
        },
      });
    } else
      throw new Error("Can't update progress for a future or past objective");
  }
  async deleteObjectiveById(objectiveId: string) {
    return ObjectiveRepository.deleteById(this.prismaService, objectiveId);
  }
  async createObjective(options: CreateObjectivesDto, playerId: string) {
    if (options.endDate <= options.startDate)
      throw new Error("Start date can't be after the end date");
    return ObjectiveRepository.createObjective(this.prismaService, {
      playerId,
      ...options,
    });
  }
  async editObjectiveById(objectiveId: string, options: EditObjectiveDto) {
    return this.prismaService.objective.update({
      where: {
        id: objectiveId,
      },
      data: {
        ...options,
      },
    });
  }
  async getCurrentPlayerObjective(playerId: string) {
    return ObjectiveRepository.getCurrent(this.prismaService, playerId, {
      from: new Date(),
    });
  }

  async getObjectiveById(objectiveId: string) {
    return this.prismaService.objective.findFirstOrThrow({
      where: { id: objectiveId },
    });
  }
}
