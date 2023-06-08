import { Injectable } from '@nestjs/common/decorators';
import { PrismaService } from '@ankora/models/prisma';
import { Coach } from '@ankora/models';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { User } from '@prisma/client';
import { CoachRepository } from '@ankora/repository';

@Injectable()
export class CoachService {
  constructor(private readonly prismaService: PrismaService) {}
  async updateCoach(coachData: UpdateCoachDto, user: User) {
    return this.prismaService.coach.update({
      where: {
        userId: user.id,
      },
      data: {
        ...coachData,
      },
    });
  }
  async deleteCoach(id: string): Promise<Coach> {
    return this.prismaService.coach.delete({
      where: {
        id: id,
      },
    });
  }

  async getAllCoachesForOrganization(organizationId: string) {
    return CoachRepository.getAllCoachesForOrganization(
      this.prismaService,
      organizationId,
    );
  }

  async getAllCoachesForPlayer(playerId: string) {
    return this.prismaService.coach.findMany({
      where: {
        playerCoaches: {
          some: {
            playerId: playerId,
          },
        },
      },
      include: { user: true },
    });
  }
}
