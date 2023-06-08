import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { Coach, User } from '@ankora/models';
import { connectToTestDB } from '../../helpers/test.helper';
import { GetAllPlayersDto } from './dto/get-all-players.dto';
import { PrismaModule, PrismaService, runSeed } from '@ankora/models/prisma';

describe('Players', () => {
  let service: PlayerService;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PlayerService, PrismaService],
    }).compile();

    prisma = await connectToTestDB();
    service = module.get<PlayerService>(PlayerService);
    await runSeed();
  });

  it('Should update a player', async () => {
    const user = await prisma.user.findUnique({
      where: {
        id: '00000000-0000-1000-a000-000000000007',
      },
    });
    const player = await service.updatePlayer(
      {
        id: '00000000-0000-1000-c000-000000000002',
        height: '194',
        userId: '00000000-0000-1000-a000-000000000007',
      },
      user as User,
    );
    expect(player.height).toEqual('194');
  });

  it('Should return all available players for Coach', async () => {
    const coach = await prisma.coach.findUnique({
      where: { id: '00000000-0000-1000-b000-000000000000' },
    });
    const players = await service.getAvailablePlayersForCoach(coach as Coach, {
      startDate: new Date(2024, 5, 8, 11, 0),
      endDate: new Date(2024, 5, 8, 12, 30),
    });
    expect(players).toBeDefined();
  });

  it('Should return player by id', async () => {
    const player = await service.getPlayerById(
      '00000000-0000-1000-c000-000000000005',
    );
    expect(player).toBeDefined();
  });

  it.only('Should delete player', async () => {
    const playerToDelete = await prisma.player.findFirst({
      where: { id: '00000000-0000-1000-c000-000000000002' },
    });
    expect(playerToDelete).toBeDefined();
    const player = await service.deletePlayer(
      '00000000-0000-1000-c000-000000000002',
    );
    expect(player).toBeDefined();

    const deletedPlayer = await prisma.player.findFirst({
      where: { id: '00000000-0000-1000-c000-000000000002' },
    });

    const deletedUser = await prisma.user.findFirst({
      where: { id: playerToDelete?.userId },
    });
    expect(deletedPlayer).toBe(null);
    expect(deletedUser).toBe(null);
  });

  it('Should return Taylor Fritz', async () => {
    const coach = await prisma.coach.findFirstOrThrow({
      where: { id: '00000000-0000-1000-b000-000000000000' },
      include: {
        user: true,
      },
    });
    const object = await service.getAllPlayers({
      coach,
      search: 'Taylor',
    } as GetAllPlayersDto);
    const player = object.players;
    expect(player).toBeDefined();
    expect(player[0].user?.fullName).toEqual('Taylor Fritz');
  });

  afterAll(async () => {
    await prisma.file.deleteMany({});
    await prisma.practice.deleteMany({});
    await prisma.player.deleteMany({});
    await prisma.session.deleteMany({});
  });
});
