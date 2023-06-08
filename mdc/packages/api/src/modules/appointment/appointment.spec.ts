import { PRACTICE_TYPE, PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointment.service';
import { User } from '@ankora/models';
import { connectToTestDB } from '../../helpers/test.helper';
import { PrismaModule, PrismaService, runSeed } from '@ankora/models/prisma';

describe('Appointments', () => {
  let service: AppointmentService;
  let prisma: PrismaClient;
  jest.setTimeout(10000000);
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [AppointmentService, PrismaService],
    }).compile();

    prisma = await connectToTestDB();
    service = module.get<AppointmentService>(AppointmentService);
    await runSeed();
  });

  it('should create 1 new appointment', async () => {
    const coach = await prisma.coach.findUnique({
      where: { id: '00000000-0000-1000-b000-000000000000' },
    });
    const user = await prisma.user.findUnique({
      where: {
        id: '00000000-0000-1000-a000-000000000000',
      },
    });

    expect(user).toBeDefined();
    expect(coach).toBeDefined();

    const newAppointment = {
      id: '00000000-0000-1000-c000-000000000102',
      title: 'Test practice',
      practice: PRACTICE_TYPE.FITNESS,
      startDate: new Date(2024, 3, 20, 11, 0),
      endDate: new Date(2024, 3, 20, 12, 30),
      objectives: `Warm-up: 10 minutes of jogging, stretching, and footwork drills
      Serve practice: focus on consistency and placement
      Forehand/backhand drills: work on technique and power
      Point play: simulate match situations and work on strategy`,
      court: '00000000-0000-1000-c000-000000000011',
      coachId: '00000000-0000-1000-b000-000000000000',
      players: ['00000000-0000-1000-c000-000000000000'],
      organizationId: '00000000-0000-1000-o000-000000000000',
    };
    const appointment = await service.createAppointment(
      newAppointment,
      ['00000000-0000-1000-b000-000000000000'],
      user as User,
    );
    expect(newAppointment.title).toEqual(appointment.title);
  });

  it('Should return all appointments for player Chase Abel', async () => {
    const appointments = await service.getAppointmentsForPlayer(
      '00000000-0000-1000-c000-000000000002',
      {},
    );
    expect(appointments).toBeDefined();
  });

  it('Should update appointment', async () => {
    const coach = await prisma.coach.findUnique({
      where: { id: '00000000-0000-1000-b000-000000000000' },
    });

    expect(coach).toBeDefined();

    const newAppointment = {
      id: '00000000-0000-1000-c000-000000000102',
      title: 'Testing',
      practice: PRACTICE_TYPE.FITNESS,
      court: '00000000-0000-1000-c000-000000000011',
      startDate: new Date(2023, 1, 8, 11, 0),
      endDate: new Date(2023, 1, 8, 12, 30),
    };
    const updatedAppointment = await service.updateAppointment(
      '00000000-0000-1000-c000-000000000102',
      newAppointment,
      ['00000000-0000-1000-b000-000000000000'],
    );
    expect(updatedAppointment.title).toEqual('Testing');
  });

  afterAll(async () => {
    await prisma.appointment.deleteMany({});
  });
});
