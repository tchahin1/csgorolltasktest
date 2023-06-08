import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectiveService } from './objective.service';
import { connectToTestDB } from '../../helpers/test.helper';
import { PrismaModule, PrismaService, runSeed } from '@ankora/models/prisma';

describe('Objectives', () => {
  let service: ObjectiveService;
  let prisma: PrismaClient;
  jest.setTimeout(10000000);
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ObjectiveService, PrismaService],
    }).compile();

    prisma = await connectToTestDB();
    service = module.get<ObjectiveService>(ObjectiveService);

    await runSeed();
  });
  it('Should return all objectives for player', async () => {
    const objectives = service.getObjectivesForPlayer(
      '00000000-0000-1000-c000-000000000000',
      {},
    );
    expect(objectives).toBeDefined();
  });

  it('Should return all objectives for player with start and end date', async () => {
    const objectives = service.getObjectivesForPlayer(
      '00000000-0000-1000-c000-000000000000',
      {
        startDate: new Date(2024, 3, 3, 11, 0),
        endDate: new Date(2024, 3, 12, 12, 30),
      },
    );
    expect(objectives).toBeDefined();
  });
  it('Should change the title for the objective with the specific id', async () => {
    const objective = await service.editObjectiveById(
      '00000000-0000-1000-o000-000000000000',
      { title: 'Test' },
    );
    expect(objective.title).toEqual('Test');
  });
  afterAll(async () => {
    await prisma.appointment.deleteMany();
    await prisma.court.deleteMany();
  });
});
