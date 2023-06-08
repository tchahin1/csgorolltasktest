import { Injectable } from '@nestjs/common/decorators';
import { PrismaService } from '@ankora/models/prisma';
import { CreateKeyDateDto } from './dto/create-key-date.dto';
import { GetKeyDatesQueryDto } from './dto/get-key-dates.dto';
import { KeyDateRepository } from '@ankora/repository';
import { Coach } from '@ankora/models';

@Injectable()
export class KeyDateService {
  constructor(private readonly prismaService: PrismaService) {}

  async createKeyDate(playerId: string, data: CreateKeyDateDto) {
    const { title, startsAt } = data;
    return this.prismaService.keyDate.create({
      data: {
        title,
        startsAt,
        player: { connect: { id: playerId } },
      },
    });
  }

  async getKeyDatesForPlayer(
    coach: Coach,
    playerId: string,
    options: GetKeyDatesQueryDto,
  ) {
    const { startDate, endDate } = options;
    return KeyDateRepository.getAllByPlayerId(
      this.prismaService,
      coach,
      playerId,
      {
        from: startDate,
        to: endDate,
      },
    );
  }
}
