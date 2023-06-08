import { Test, TestingModule } from '@nestjs/testing';
import { PracticeExerciseService } from './practice-exercise.service';
import { connectToTestDB } from '../../helpers/test.helper';
import { PrismaModule, PrismaService, runSeed } from '@ankora/models/prisma';
import { PrismaClient } from '@prisma/client';

describe('Practice Exercise', () => {
  let service: PracticeExerciseService;
  let prisma: PrismaClient;
  jest.setTimeout(10000000);
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PracticeExerciseService, PrismaService],
    }).compile();

    prisma = await connectToTestDB();
    service = module.get<PracticeExerciseService>(PracticeExerciseService);
    await runSeed();
  });

  it('should create 1 new exercise', async () => {
    const exercise = await service.createPracticeExercise(
      {
        exerciseType: 'EXERCISE',
        exerciseId: '00000000-0000-1000-e000-000000000000',
        reps: 1,
        duration: 1,
        sortValue: 1,
      },
      '00000000-0000-1000-o000-000000000000',
    );
    expect(exercise.exerciseType).toEqual('EXERCISE');
  });

  afterAll(async () => {
    await prisma.practiceExercise.deleteMany();
  });
});
