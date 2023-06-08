import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { CourtController } from './court.controller';
import { CourtService } from './court.service';

@Module({
  imports: [CoreModule, PrismaModule],
  providers: [CourtService],
  exports: [CourtService],
  controllers: [CourtController],
})
export class CourtModule {}
