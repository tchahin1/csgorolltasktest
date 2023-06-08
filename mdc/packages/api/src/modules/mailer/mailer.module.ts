import { CoreModule, JwtHelper } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { MdcMailerService } from './mailer.service';

@Module({
  imports: [CoreModule, PrismaModule],
  controllers: [],
  providers: [MdcMailerService, JwtHelper],
  exports: [MdcMailerService],
})
export class MailerModule {}
