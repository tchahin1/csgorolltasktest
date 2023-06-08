import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseService } from './exercise.service';
import { connectToTestDB } from '../../helpers/test.helper';
import { PrismaModule, PrismaService, runSeed } from '@ankora/models/prisma';
import { PrismaClient } from '@prisma/client';

describe('Exercise', () => {
  let service: ExerciseService;
  let prisma: PrismaClient;
  jest.setTimeout(10000000);
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ExerciseService, PrismaService],
    }).compile();

    prisma = await connectToTestDB();
    service = module.get<ExerciseService>(ExerciseService);
    await runSeed();
  });

  it('should create 1 new exercise', async () => {
    const exercise = await service.createExercise(
      {
        name: 'Backhand',
        description:
          'Striking the ball with the palm facing towards the chest and the back of hand moving towards the opponent on the follow through',
        videoUrl: 'https://www.youtube.com/watch?v=9RqGM6ZIq0U',
        awsKey: 'test',
        duration: 0,
      },
      '00000000-0000-1000-o000-000000000000',
    );
    expect(exercise.name).toEqual('Backhand');
  });

  it('Should return all exercises for an organization', async () => {
    const exercises = await service.getAll(
      '00000000-0000-1000-o000-000000000000',
    );

    expect(exercises).toBeDefined();
    expect(exercises).toHaveLength(4);

    exercises.forEach((exercise) => {
      expect(exercise.organizationId).toEqual(
        '00000000-0000-1000-o000-000000000000',
      );
    });
  });
  afterAll(async () => {
    await prisma.exercise.deleteMany();
  });
});
