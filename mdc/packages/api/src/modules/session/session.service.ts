import { Injectable } from '@nestjs/common/decorators';
import { PrismaService } from '@ankora/models/prisma';
import { CreateSessionDto } from './dto/create-session.dto';
import { Coach, Player } from '@ankora/models';
import { VIDEO_STATUS } from '@prisma/client';
import { pick } from 'lodash';
import { SqsProducerService } from '../sqs-producer/sqs-producer.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly sqsService: SqsProducerService,
  ) {}
  async createSession(sessionData: CreateSessionDto) {
    return this.prismaService.session.create({
      data: {
        ...pick(sessionData, ['name', 'videoStatus']),
        player: {
          connect: { id: sessionData.playerId },
        },
        opponent: sessionData.opponentId
          ? {
              connect: { id: sessionData.opponentId },
            }
          : undefined,
        coach: {
          connect: { id: sessionData.coachId },
        },
        file: {
          create: {
            url: sessionData.videoUrl,
            key: sessionData.awsKey,
            duration: sessionData.duration,
          },
        },
      },
      include: {
        file: true,
        player: {
          include: {
            user: true,
          },
        },
        opponent: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async updateVideoStatus(id: string, player: Player) {
    const session = await this.prismaService.session.findFirst({
      where: {
        AND: [
          {
            id: id,
          },
          {
            playerId: player.id,
          },
          {
            videoStatus: VIDEO_STATUS.NEW,
          },
        ],
      },
    });

    if (session) {
      return this.updateSessionStatus(id, VIDEO_STATUS.IN_REVIEW);
    } else throw new Error('Session could not be updated');
  }

  async getAllForPlayer(player: Player) {
    return this.prismaService.session.findMany({
      where: {
        playerId: player.id,
      },
      include: {
        file: true,
        player: {
          include: {
            user: true,
          },
        },
        opponent: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findKeyMoments(id: string, coach: Coach) {
    const session = await this.prismaService.session.findFirstOrThrow({
      where: { id, coachId: coach.id },
      include: { file: true },
    });

    if (!session.file.key) throw new Error('Video could not be processed');

    await this.sqsService.findKeyMoments(
      session.file.key,
      coach.userId,
      session.id,
    );

    return this.updateSessionStatus(id, VIDEO_STATUS.PROCESSING);
  }

  async updateSessionStatus(id: string, status: VIDEO_STATUS) {
    return this.prismaService.session.update({
      where: { id },
      data: { videoStatus: status },
    });
  }
}
