import { Injectable } from '@nestjs/common/decorators';
import { PrismaService } from '@ankora/models/prisma';
import { CreateKeyMomentDto } from './dto/create-key-moment.dto';
import { KincubeMatchResult } from './dto/kincube-result.dto';
import { Prisma, VIDEO_STATUS } from '@prisma/client';
import {
  calculateServeStatistics,
  calculateServeZones,
} from './statistics/serve';
import {
  calculateHitPositionZones,
  calculateReturnBouncesZones,
} from './statistics/return';
import { calculateBaselineStatistics } from './statistics/baseline';
import { calculateNetStatistics } from './statistics/net';
import { calculatePhysicalStatistics } from './statistics/physical';
import { calculatePlanOfPlayStatistics } from './statistics/plan-of-play';
import { calculateBounceStatistics } from './statistics/bounces';
import { calculateHitStatistics } from './statistics/hit';
import { KeyMoment } from '@ankora/models';
import { plainToClass } from 'class-transformer';
import { calculateRallyShotStatistics } from './statistics/rally';

@Injectable()
export class KeyMomentService {
  constructor(private readonly prismaService: PrismaService) {}

  async createKeyMoment(keyMomentData: CreateKeyMomentDto) {
    const keyMomentStatistics = this.calculateStatistics(
      keyMomentData.kincubeData.result,
    );

    const keyMoment = await this.prismaService.keyMoment.create({
      data: {
        kincubeData: JSON.parse(JSON.stringify(keyMomentData.kincubeData)),
        ...keyMomentStatistics,
        session: {
          connect: { id: keyMomentData.sessionId },
        },
      },
    });

    if (keyMoment) {
      await this.prismaService.session.update({
        where: { id: keyMomentData.sessionId },
        data: { videoStatus: VIDEO_STATUS.COMPLETED },
      });
    }
    return plainToClass(KeyMoment, keyMoment);
  }

  private calculateStatistics(kincubeResult: KincubeMatchResult[]) {
    const rallyShots = calculateRallyShotStatistics(
      kincubeResult,
    ) as unknown as Prisma.InputJsonValue;
    const serve = calculateServeStatistics(
      kincubeResult,
    ) as unknown as Prisma.InputJsonValue;

    const serveZones = calculateServeZones(
      kincubeResult,
    ) as unknown as Prisma.InputJsonValue;

    const returnBounces = calculateReturnBouncesZones(
      kincubeResult,
    ) as unknown as Prisma.InputJsonValue;

    const returnHitPosition = calculateHitPositionZones(
      kincubeResult,
    ) as unknown as Prisma.InputJsonValue;

    const baseline = calculateBaselineStatistics(
      kincubeResult,
    ) as unknown as Prisma.InputJsonValue;

    const net = calculateNetStatistics(
      kincubeResult,
    ) as unknown as Prisma.InputJsonValue;

    const physical = calculatePhysicalStatistics(
      kincubeResult,
    ) as unknown as Prisma.InputJsonValue;

    const planOfPlay = calculatePlanOfPlayStatistics(
      kincubeResult,
    ) as unknown as Prisma.InputJsonValue;

    const bounces = calculateBounceStatistics(
      kincubeResult,
    ) as unknown as Prisma.InputJsonValue;

    const hitPoints = calculateHitStatistics(
      kincubeResult,
    ) as unknown as Prisma.InputJsonValue;

    return {
      rallyShots,
      serve: { serveStatistics: serve, serveZones },
      return: { returnBounces, returnHitPosition },
      baseline,
      net,
      physical,
      planOfPlay,
      bounces,
      hitPoints,
    };
  }

  async getKeyMoment(sessionId: string): Promise<KeyMoment> {
    const keyMoment = await this.prismaService.keyMoment.findFirstOrThrow({
      where: { sessionId },
    });

    return plainToClass(KeyMoment, keyMoment);
  }
}
