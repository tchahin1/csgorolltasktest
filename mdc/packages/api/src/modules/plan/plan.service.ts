import { Coach, PlayerPlan } from '@ankora/models';
import { PrismaService } from '@ankora/models/prisma';
import { PlanRepository } from '@ankora/repository';
import { Injectable } from '@nestjs/common/decorators';
import { AssignPlanDto } from './dto/assign-plan.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PLAN_STATUS, PracticeDailyPlanPractice } from '@prisma/client';
import dayjs = require('dayjs');

@Injectable()
export class PlanService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(
    coach: Coach,
    options: {
      search?: string;
    },
  ) {
    return await PlanRepository.getAll(this.prismaService, coach, options);
  }

  async create(coach: Coach, data: CreatePlanDto, organizationId: string) {
    const result = await this.prismaService.$transaction(async (prisma) => {
      const newPlan = await prisma.plan.create({
        data: {
          name: data.name,
          tags: data.tags,
          coachId: coach.id,
          organizationId: organizationId,
        },
      });
      const updatePlan = await prisma.plan.update({
        where: {
          id: newPlan.id,
        },
        data: {
          weeklyPlans: {
            create: data.weeklyPlans.map((weeklyPlan) => ({
              week: weeklyPlan.week,
              order: weeklyPlan.order,
              dailyPlanPractices: {
                create: weeklyPlan.dailyPlanPractices.map(
                  (dailyPlanPractice) => ({
                    day: dailyPlanPractice.day,
                    plan: { connect: { id: newPlan.id } }, // connect to the newly created plan
                    practiceDailyPlanPractices: {
                      create: dailyPlanPractice.practices.map((practiceId) => ({
                        practiceId: practiceId,
                      })),
                    },
                  }),
                ),
              },
            })),
          },
        },
        include: {
          weeklyPlans: {
            include: {
              dailyPlanPractices: {
                include: {
                  practiceDailyPlanPractices: true,
                },
              },
            },
          },
        },
      });
      return updatePlan;
    });
    return result;
  }

  async assignPlayers(assignData: AssignPlanDto) {
    let allPlayers: { playerId: string; teamId?: string | null }[] =
      assignData.playerIds?.map((playerId) => ({ playerId })) || [];

    if (assignData.teamIds) {
      const teamPlayers = await this.prismaService.teamPlayer.findMany({
        where: {
          teamId: { in: assignData.teamIds },
        },
      });

      allPlayers = allPlayers.concat(
        teamPlayers.map((teamPlayer) => teamPlayer),
      );
    }
    const result = this.prismaService.$transaction(async (prisma) => {
      const updatePlayerPlan = {
        playerPlans: {
          connectOrCreate: allPlayers.map(({ playerId, teamId }) => ({
            where: {
              playerId_planId: {
                planId: assignData.planId,
                playerId,
              },
            },
            create: {
              playerId,
              startDate: assignData.startDate,
              status: PLAN_STATUS.ACTIVE,
              teamId,
            },
          })),
        },
      };
      const plan = await prisma.plan.update({
        where: {
          id: assignData.planId,
        },
        data: updatePlayerPlan,
        include: {
          weeklyPlans: {
            include: {
              dailyPlanPractices: {
                include: {
                  practiceDailyPlanPractices: true,
                },
              },
            },
          },
          playerPlans: true,
        },
      });

      // In order to assign all plan practices to player we need to calculate correct day on which practice should be happening
      // based on start date, week and day in week for every practice in one plan

      let allPlayerDailyPractices: (PracticeDailyPlanPractice & {
        week: number;
        day: number;
      } & PlayerPlan)[] = [];

      plan.playerPlans.forEach((playerPlans) =>
        plan.weeklyPlans.forEach((weeklyPlan, index) => {
          weeklyPlan.dailyPlanPractices.forEach((dailyPlanPractice) => {
            const playerPractices =
              dailyPlanPractice.practiceDailyPlanPractices.map(
                (practiceDailyPlanPractice) => ({
                  ...practiceDailyPlanPractice,
                  week: index,
                  day: dailyPlanPractice.day,
                  ...playerPlans,
                }),
              );

            allPlayerDailyPractices =
              allPlayerDailyPractices.concat(playerPractices);
          });
        }),
      );

      await prisma.practicePlayer.createMany({
        data: allPlayerDailyPractices.map((dailyPractices) => ({
          playerId: dailyPractices.playerId,
          practiceId: dailyPractices.practiceId,
          date: dayjs(assignData.startDate)
            .add(dailyPractices.week, 'weeks')
            .add(dailyPractices.day, 'days')
            .toDate(),
        })),
      });

      return plan;
    });
    return result;
  }
}
