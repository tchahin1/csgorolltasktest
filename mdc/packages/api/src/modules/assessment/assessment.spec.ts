import { ASSESSMENT_STATUS, PrismaClient } from '@prisma/client';
import { TestingModule } from '@nestjs/testing/testing-module';
import { Test } from '@nestjs/testing/test';
import { AssessmentService } from './assessment.service';
import { Player, User, Coach } from '@ankora/models';
import { connectToTestDB } from '../../helpers/test.helper';
import { PrismaModule, PrismaService, runSeed } from '@ankora/models/prisma';
import { MailerService } from '@nestjs-modules/mailer';
import { QuestionaryService } from '../questionary/questionary.service';
import slugify from 'slugify';

describe('Assessment', () => {
  let service: AssessmentService;
  let prisma: PrismaClient;
  let player: Player;
  let user: User;
  let coach: Coach;
  jest.setTimeout(10000000);
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        AssessmentService,
        PrismaService,
        QuestionaryService,
        {
          provide: MailerService,
          useValue: {},
        },
      ],
    }).compile();

    prisma = await connectToTestDB();

    service = module.get<AssessmentService>(AssessmentService);

    await runSeed();

    user = await prisma.user.findFirstOrThrow({
      where: { id: '00000000-0000-1000-a000-000000000006' },
    });
    player = await prisma.player.findFirstOrThrow({
      where: { userId: user.id },
    });
    coach = await prisma.coach.findFirstOrThrow({
      where: { id: '00000000-0000-1000-b000-000000000000' },
    });

    expect(user).toBeDefined();
    expect(player).toBeDefined();
  });

  it('should get all assessments for player', async () => {
    const assessments = await service.getAllAssessmentsForPlayer(player.id, {
      organizationId: user.organizationId,
    });
    expect(assessments).toBeDefined();
    expect(assessments).toHaveLength(3);

    for (const assessment of assessments) {
      expect(assessment.playerId).toEqual(player.id);
      expect(assessment.organizationId).toEqual(user.organizationId);
    }
  });

  it('should get one assessment for player', async () => {
    const assessment = await service.getAssessmentById(
      '00000000-0000-1000-o000-000001000000',
      { playerId: player.id, organizationId: user.organizationId },
    );
    expect(assessment).toBeDefined();
    expect(assessment.playerId).toEqual(player.id);
    expect(assessment.organizationId).toEqual(user.organizationId);
  });

  it('should create assessment for player', async () => {
    const assessment = await service.createAssessment(
      user.organizationId,
      coach.id,
      {
        playerId: player.id,
        title: 'Test assessment',
        description: 'This is test assessment',
        notes: 'This are some notes',
      },
    );

    expect(assessment).toBeDefined();
    expect(assessment.playerId).toEqual(player.id);
    expect(assessment.coachId).toEqual(coach.id);
    expect(assessment.organizationId).toEqual(user.organizationId);
    expect(assessment.title).toEqual('Test assessment');
    expect(assessment.status).toEqual(ASSESSMENT_STATUS.WAITING_FOR_PLAYER);
  });

  it('Should not update assessment answers for player if status is not waiting for player', async () => {
    await expect(() =>
      service.addPlayerAnswers(
        '00000000-0000-1000-o000-000001000002',
        player.id,
        user.organizationId,
        [
          {
            questionSlug: slugify('Did I respect my pre-match goals?'),
            answer: false,
          },
        ],
      ),
    ).rejects.toThrowError();
  });

  it('Should update assessment answers for player', async () => {
    const assessment = await service.addPlayerAnswers(
      '00000000-0000-1000-o000-000001000000',
      player.id,
      user.organizationId,
      [
        {
          questionSlug: slugify('Did I respect my pre-match goals?'),
          answer: false,
        },
      ],
    );

    expect(assessment.answers).toHaveLength(1);
  });

  it('Should update assessment answers for coach', async () => {
    const assessment = await service.addCoachAnswers(
      '00000000-0000-1000-o000-000001000001',
      user.organizationId,
      [
        {
          questionSlug: slugify('Did I respect my pre-match goals?'),
          answer: false,
        },
      ],
    );

    expect(assessment.answers).toHaveLength(6);
  });

  afterAll(async () => {
    await prisma.assessment.deleteMany({});
  });
});
