import { Injectable } from '@nestjs/common/decorators';
import { FeatureConfigRepository } from '@ankora/repository';
import { PrismaService } from '@ankora/models/prisma';
@Injectable()
export class FeatureConfigService {
  constructor(private readonly prismaService: PrismaService) {}
  getAll = () => {
    return FeatureConfigRepository.getAll(this.prismaService);
  };
}
