import { CoreModule, JwtHelper } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { forwardRef } from '@nestjs/common';
import { Module } from '@nestjs/common/decorators';
import { MailerModule } from '../mailer/mailer.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    CoreModule,
    PrismaModule,
    forwardRef(() => UserModule),
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtHelper],
  exports: [AuthService],
})
export class AuthModule {}
