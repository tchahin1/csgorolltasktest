import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PlanService } from './plan.service';
import { PrismaModule, PrismaService, runSeed } from '@ankora/models/prisma';
import { connectToTestDB } from '../../helpers/test.helper';
import { Coach } from '@ankora/models';

describe('Plans', () => {
  let service: PlanService;
  let prisma: PrismaClient;
  jest.setTimeout(10000000);
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PlanService, PrismaService],
    }).compile();

    prisma = await connectToTestDB();
    service = module.get<PlanService>(PlanService);
    await runSeed();
  });

  it('Should return all plans for coach', async () => {
    const coach = await prisma.coach.findUnique({
      where: { id: '00000000-0000-1000-b000-000000000000' },
    });

    expect(coach).toBeDefined();

    const plans = await service.getAll(coach as Coach, {});
    expect(plans).toBeDefined();
    expect(plans).toHaveLength(1);
  });

  it('Should return assign players to a plan', async () => {
    const playerIds = [
      '00000000-0000-1000-c000-000000000000',
      '00000000-0000-1000-c000-000000000001',
    ];
    const planId = '00000000-0000-1000-p000-000000000000';
    const startDate = new Date('1-1-2023');

    await service.assignPlayers({ playerIds, planId, startDate });

    const plan = await prisma.plan.findFirstOrThrow({
      where: { id: planId },
      include: { playerPlans: true },
    });
    expect(plan).toBeDefined();
    expect(
      plan.playerPlans.map((playerPlan) => playerPlan.playerId).sort(),
    ).toEqual(playerIds.sort());
  });

  it('Should create a new plan', async () => {
    const newPlanData = {
      name: 'TEST',
      tags: ['Test1'],
      weeklyPlans: [
        {
          week: 'Week 1',
          order: 1,
          dailyPlanPractices: [
            {
              day: 1,
              practices: ['00000000-0000-1000-c000-000000000000'],
            },
          ],
        },
      ],
    };
    const coach = await prisma.coach.findFirst({
      where: {
        id: '00000000-0000-1000-b000-000000000000',
      },
    });
    expect(coach).toBeDefined();
    const organizationId = '00000000-0000-1000-o000-000000000000';

    const newPlan = await service.create(coach!, newPlanData, organizationId);
    expect(newPlan).toBeDefined();
    expect(newPlan.name).toEqual('TEST');
    expect(newPlan.weeklyPlans[0].week).toEqual('Week 1');
  });
  afterAll(async () => {
    await prisma.plan.deleteMany();
  });
});
