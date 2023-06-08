import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { AuthModule } from '../auth/auth.module';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';

@Module({
  imports: [CoreModule, PrismaModule, AuthModule],
  providers: [AppointmentService],
  exports: [AppointmentService],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
