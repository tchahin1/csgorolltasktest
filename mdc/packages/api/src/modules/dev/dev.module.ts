import { UtilsHelper } from '@ankora/common';
import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { DevController } from './dev.controller';

@Module({
  imports: [CoreModule, PrismaModule],
  controllers: [DevController],
  providers: [UtilsHelper],
})
export class DevModule {}
