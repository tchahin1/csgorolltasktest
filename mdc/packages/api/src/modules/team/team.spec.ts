import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { User } from '@ankora/models';
import { connectToTestDB } from '../../helpers/test.helper';
import { PrismaModule, PrismaService, runSeed } from '@ankora/models/prisma';

describe('Teams', () => {
  let service: TeamService;
  let prisma: PrismaClient;
  jest.setTimeout(10000000);
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [TeamService, PrismaService],
    }).compile();

    prisma = await connectToTestDB();

    service = module.get<TeamService>(TeamService);
    await runSeed();
  });
  it('Should create a team', async () => {
    const newTeamData = {
      id: '00000000-0000-1000-t000-000020000009',
      name: 'Test Team',
      coachId: '00000000-0000-1000-b000-000000000004',
      players: ['00000000-0000-1000-c000-000000000008'],
      organizationId: '00000000-0000-1000-o000-000000000000',
    };
    const user = await prisma.user.findUnique({
      where: {
        id: '00000000-0000-1000-a000-000000000000',
      },
    });
    const newTeam = service.createTeam(newTeamData, user as User);
    expect(newTeam).toBeDefined();
  });

  afterAll(async () => {
    await prisma.team.deleteMany();
  });
});
