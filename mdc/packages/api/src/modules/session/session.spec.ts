import { Test, TestingModule } from '@nestjs/testing';
import { connectToTestDB } from '../../helpers/test.helper';
import { PrismaModule, PrismaService, runSeed } from '@ankora/models/prisma';
import { SessionService } from './session.service';
import { PrismaClient } from '@prisma/client';

describe('Session', () => {
  let service: SessionService;
  let prisma: PrismaClient;
  jest.setTimeout(10000000);
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [SessionService, PrismaService],
    }).compile();

    prisma = await connectToTestDB();
    service = module.get<SessionService>(SessionService);
    await runSeed();
  });

  it('should create 1 new exercise', async () => {
    const session = await service.createSession({
      name: 'Test',
      videoUrl: 'bla',
      awsKey: 'bla',
      coachId: '00000000-0000-1000-b000-000000000001',
      opponentId: '00000000-0000-1000-c000-000000000002',
      playerId: '00000000-0000-1000-c000-000000000001',
      duration: 300,
    });
    expect(session.name).toEqual('Test');
  });
  it('should create 1 new session', async () => {
    const session = await service.createSession({
      name: 'Test2',
      videoUrl: 'bla',
      awsKey: 'bla',
      coachId: '00000000-0000-1000-b000-000000000001',
      playerId: '00000000-0000-1000-c000-000000000001',
      duration: 500,
    });
    expect(session.name).toEqual('Test2');
  });

  afterAll(async () => {
    await prisma.file.deleteMany({});
    await prisma.session.deleteMany({});
  });
});
