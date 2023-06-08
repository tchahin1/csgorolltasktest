import { PrismaClient, TOURNAMENT_STATUS } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { TournamentService } from './tournament.service';
import { connectToTestDB } from '../../helpers/test.helper';
import { PrismaModule, PrismaService, runSeed } from '@ankora/models/prisma';

describe('Tournament', () => {
  let service: TournamentService;
  let prisma: PrismaClient;
  jest.setTimeout(10000000);
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [TournamentService, PrismaService],
    }).compile();

    prisma = await connectToTestDB();
    service = module.get<TournamentService>(TournamentService);
    await runSeed();
  });

  it('should create a tournament', async () => {
    const tournament = await service.createTournament({
      name: 'Sarajevo Open',
      oponent: 'Neko Nekic',
      result: '6-4 6-2 4-6 7-5 ',
      playerId: '00000000-0000-1000-c000-000000000001',
      status: TOURNAMENT_STATUS.WIN,
      remoteId: 10,
    });
    expect(tournament.name).toEqual('Sarajevo Open');
  });

  it('should update a tournament', async () => {
    const tournament = await service.updateTournament({
      name: 'Sarajevo Open',
      remoteId: 1,
    });

    expect(tournament.name).toEqual('Sarajevo Open');
  });

  it('should return all tournaments', async () => {
    const tournaments = await service.getAll(
      { playerId: '00000000-0000-1000-c000-000000000001' },
      {},
    );
    expect(tournaments).toBeDefined();
  });

  afterAll(async () => {
    await prisma.tournament.deleteMany();
  });
});
