import { Test, TestingModule } from '@nestjs/testing';
import { KeyDateService } from './key-date.service';
import { connectToTestDB } from '../../helpers/test.helper';
import { PrismaModule, PrismaService, runSeed } from '@ankora/models/prisma';
import { PrismaClient } from '@prisma/client';

describe('Key Dates', () => {
  let service: KeyDateService;
  let prisma: PrismaClient;

  jest.setTimeout(10000000);
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [KeyDateService, PrismaService],
    }).compile();

    prisma = await connectToTestDB();

    service = module.get<KeyDateService>(KeyDateService);
    await runSeed();
  });

  it('should create 1 new key date', async () => {
    const keyDate = await service.createKeyDate(
      '00000000-0000-1000-c000-000000000005',
      {
        title: 'Argentina Open',
        startsAt: new Date(2023, 2, 11),
      },
    );
    expect(keyDate.title).toEqual('Argentina Open');
    expect(keyDate.playerId).toEqual('00000000-0000-1000-c000-000000000005');
  });

  it('Should return all key-dates for a player', async () => {
    const coach = await prisma.coach.findFirstOrThrow({
      where: { id: '00000000-0000-1000-b000-000000000000' },
      include: {
        user: true,
      },
    });
    expect(coach).toBeDefined();
    const keyDates = await service.getKeyDatesForPlayer(
      coach,
      '00000000-0000-1000-c000-000000000000',
      {
        startDate: new Date('2023-01-01T14:46:40.580Z'),
        endDate: new Date('2023-12-31T14:46:40.580Z'),
      },
    );

    expect(keyDates).toBeDefined();
    expect(keyDates).toHaveLength(2);

    keyDates.forEach((keyDate) => {
      expect(keyDate.playerId).toEqual('00000000-0000-1000-c000-000000000000');
    });
  });
  afterAll(async () => {
    await prisma.keyDate.deleteMany();
  });
});
