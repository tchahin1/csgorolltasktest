import { Test, TestingModule } from '@nestjs/testing';
import { PracticeService } from './practice.service';
import { connectToTestDB } from '../../helpers/test.helper';
import { PrismaModule, PrismaService, runSeed } from '@ankora/models/prisma';
import { PRACTICE_TYPE } from '@ankora/models';
import { MODALITY, PrismaClient } from '@prisma/client';

describe('Practice', () => {
  let service: PracticeService;
  let prisma: PrismaClient;
  jest.setTimeout(10000000);
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PracticeService, PrismaService],
    }).compile();

    prisma = await connectToTestDB();
    service = module.get<PracticeService>(PracticeService);

    await runSeed();
  });

  it('should create 1 new exercise', async () => {
    const practice = await service.createPractice(
      {
        name: 'BACKHEND',
        description: 'Practice how to do backhand movement',
        practiceType: PRACTICE_TYPE.TENNIS,
        modality: MODALITY.VIDEO,
      },
      '00000000-0000-1000-o000-000000000000',
      '00000000-0000-1000-b000-000000000000',
    );
    expect(practice.name).toEqual('BACKHEND');
  });

  it('should return backhand practice', async () => {
    const practice = await service.getOneById(
      '00000000-0000-1000-c000-000000000000',
    );
    expect(practice.name).toEqual('BACKHEND');
  });

  it.only('should assign players to practice on unique dates, skipping duplicates', async () => {
    await service.assignPlayers(
      {
        playerIds: [
          '00000000-0000-1000-c000-000000000000',
          '00000000-0000-1000-c000-000000000001',
        ],
        dates: [new Date(), new Date()],
      },
      '00000000-0000-1000-c000-000000000000',
    );

    const practice = await prisma.practice.findFirst({
      where: { id: '00000000-0000-1000-c000-000000000000' },
      include: { practicePlayer: true },
    });

    expect(practice).toBeDefined();
    expect(practice!.practicePlayer).toHaveLength(2);
  });

  it('should mark it as completed for Aaron Sampson', async () => {
    const practice = await prisma.practice.findFirst({
      where: {
        practicePlayer: {
          some: { playerId: '00000000-0000-1000-c000-000000000000' },
        },
      },
      include: { practicePlayer: true },
    });
    const completedPractice = await service.markAsCompleted(
      '00000000-0000-1000-c000-000000000000',
      practice?.practicePlayer[0].id as string,
    );
    expect(completedPractice.practicePlayer[0].completed).toEqual(true);
  });

  it('should return all practices for Aaron Sampson', async () => {
    const practices = await service.getAllForPlayer(
      '00000000-0000-1000-c000-000000000000',
      {
        practicePlayer: {
          some: {
            playerId: '00000000-0000-1000-c000-000000000000',
            date: undefined,
          },
        },
      },
    );
    expect(practices[0].name).toEqual('BACKHEND');
  });

  it('should delete BACKHEND practice', async () => {
    const coach = await prisma.coach.findFirst({
      where: {
        id: '00000000-0000-1000-b000-000000000004',
      },
      include: {
        user: true,
      },
    });
    await service.deletePractice(
      '00000000-0000-1000-c000-000000000000',
      coach!,
    );
    const practices = await service.getAllForCoach(coach!);
    expect(practices.length).toEqual(2);
  });
  afterAll(async () => {
    await prisma.practice.deleteMany();
  });
});
