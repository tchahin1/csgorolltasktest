import { PrismaClient } from '@prisma/client';
import { TestingModule } from '@nestjs/testing/testing-module';
import { Test } from '@nestjs/testing/test';
import { Player, User } from '@ankora/models';
import { connectToTestDB } from '../../helpers/test.helper';
import { PrismaModule, PrismaService, runSeed } from '@ankora/models/prisma';
import { MailerService } from '@nestjs-modules/mailer';
import { CoachService } from './coach.service';

describe('Assessment', () => {
  let service: CoachService;
  let prisma: PrismaClient;
  let player: Player;
  let user: User;
  jest.setTimeout(10000000);
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        PrismaService,
        CoachService,
        {
          provide: MailerService,
          useValue: {},
        },
      ],
    }).compile();

    prisma = await connectToTestDB();

    service = module.get<CoachService>(CoachService);
    await runSeed();

    user = await prisma.user.findFirstOrThrow({
      where: { id: '00000000-0000-1000-a000-000000000006' },
    });
    player = await prisma.player.findFirstOrThrow({
      where: { userId: user.id },
    });
    expect(user).toBeDefined();
    expect(player).toBeDefined();
  });
  it('Should return all coaches for an organization', async () => {
    const coaches = await service.getAllCoachesForOrganization(
      '00000000-0000-1000-o000-000000000000',
    );

    expect(coaches).toBeDefined();

    coaches.forEach((coach) => {
      expect(coach.user.organizationId).toEqual(
        '00000000-0000-1000-o000-000000000000',
      );
    });
  });
  afterAll(async () => {
    await prisma.assessment.deleteMany({});
    await prisma.team.deleteMany({});
    await prisma.coach.deleteMany({});
    await prisma.file.deleteMany({});
    await prisma.session.deleteMany({});
  });
});
