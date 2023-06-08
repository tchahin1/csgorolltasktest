import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { Module } from '@nestjs/common/decorators';
import { AuthModule } from '../auth/auth.module';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { SqsProducerModule } from '../sqs-producer/sqs-producer.module';

@Module({
  imports: [CoreModule, PrismaModule, AuthModule, SqsProducerModule],
  providers: [SessionService],
  exports: [SessionService],
  controllers: [SessionController],
})
export class SessionModule {}
