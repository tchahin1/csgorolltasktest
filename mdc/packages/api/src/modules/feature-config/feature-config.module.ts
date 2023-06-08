import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { FeatureConfigController } from './feature-config.controller';
import { FeatureConfigService } from './feature-config.service';

@Module({
  imports: [CoreModule, PrismaModule],
  controllers: [FeatureConfigController],
  providers: [FeatureConfigService],
})
export class FeatureConfigModule {}
