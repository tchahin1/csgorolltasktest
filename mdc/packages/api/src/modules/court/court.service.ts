import { Injectable } from '@nestjs/common/decorators';
import { PrismaService } from '@ankora/models/prisma';
import { GetCourtsQueryDto } from './dto/get-courts.dto';
import { CourtRepository } from '@ankora/repository';

@Injectable()
export class CourtService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAvailableCourtsForOrganization(
    organizationId: string,
    options: GetCourtsQueryDto,
  ) {
    const { startDate, endDate, ignoreAppointmentId } = options;
    return this.prismaService.court.findMany({
      where: {
        organizationId,
        appointments: {
          none: {
            id: { not: ignoreAppointmentId },
            OR: [
              {
                startDate: { lte: startDate },
                endDate: { gte: endDate },
              },
              {
                startDate: { gte: startDate },
                endDate: { lte: endDate },
              },
              {
                startDate: { lt: endDate },
                endDate: { gt: startDate },
              },
            ],
          },
        },
      },
    });
  }

  async getAllCourtsForOrganization(
    organizationId: string,
    search?: string,
    orderKey?: string,
    order?: string,
    page?: number,
    pageSize?: number,
  ) {
    return await CourtRepository.getAll(this.prismaService, {
      organizationId,
      search,
      page,
      pageSize,
      orderKey,
      order,
    });
  }

  async getById(courtId: string) {
    const court = await CourtRepository.getById(this.prismaService, courtId);
    if (!court) throw new Error('Court not found');
    return court;
  }
}
