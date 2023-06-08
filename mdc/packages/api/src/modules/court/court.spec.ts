import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { CourtService } from './court.service';
import { connectToTestDB } from '../../helpers/test.helper';
import { PrismaModule, PrismaService, runSeed } from '@ankora/models/prisma';

describe('Courts', () => {
  let service: CourtService;
  let prisma: PrismaClient;
  jest.setTimeout(10000000);
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [CourtService, PrismaService],
    }).compile();

    prisma = await connectToTestDB();
    service = module.get<CourtService>(CourtService);
    await runSeed();
  });

  it('Should return all courts for organization', async () => {
    const courts = service.getAvailableCourtsForOrganization(
      '00000000-0000-1000-o000-000000000000',
      {
        startDate: new Date(2024, 5, 8, 11, 0),
        endDate: new Date(2024, 5, 8, 12, 30),
      },
    );
    expect(courts).toBeDefined();
  });

  it('Should return court by id', async () => {
    const court = await service.getById('00000000-0000-1000-c000-000000000013');
    expect(court.name).toEqual('Court 13');
  });
  afterAll(async () => {
    await prisma.appointment.deleteMany();
    await prisma.court.deleteMany();
  });
});
