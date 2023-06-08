import { AppConfigService, FirebaseHelper, JwtHelper } from '@ankora/core';
import { PrismaService } from '@ankora/models/prisma';
import { Injectable } from '@nestjs/common/decorators';
import { auth } from 'firebase-admin';
import { omit } from 'lodash';
import { privateRsaKey } from '../../constants/jwt';
import { MdcMailerService } from '../mailer/mailer.service';
import { UserService } from '../user/user.service';
import { UserSignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtHelper: JwtHelper,
    private readonly firebaseHelper: FirebaseHelper,
    private readonly userService: UserService,
    private readonly mailerService: MdcMailerService,
    private readonly configService: AppConfigService,
  ) {}

  async generateToken(token: string, email: string): Promise<string> {
    const firebaseUser = await auth().verifyIdToken(token, false);
    if (!firebaseUser.email || firebaseUser.email !== email) {
      throw new Error('Firebase token not valid');
    }
    return this.jwtHelper.generateJwtForUser(
      { email: firebaseUser.email },
      privateRsaKey,
    );
  }

  async verifyTokenAndUser(token: string): Promise<string> {
    const firebaseUser = await auth().verifyIdToken(token, false);

    const user = await this.prismaService.user.findUnique({
      where: {
        email: firebaseUser.email,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return this.jwtHelper.generateJwtForUser(
      { email: firebaseUser.email as string },
      privateRsaKey,
    );
  }

  async createUser(data: UserSignupDto) {
    await this.userService.createUser(omit(data, 'firebaseToken'));
  }

  async sendResetPasswordEmail(email: string, generateMobileUrl?: boolean) {
    const user = await this.userService.getUserByEmail(email);
    if (user) {
      const token = this.jwtHelper.generateJwtForUser({ email }, privateRsaKey);
      const link = generateMobileUrl
        ? `${this.configService.getAppUrl()}/mobile-reset-password?token=${token}`
        : `${this.configService.getAppUrl()}/auth/reset-password?token=${token}`;
      return await this.mailerService.resetPassword(email, { link });
    } else {
      throw new Error('User not found');
    }
  }

  async resetPassword(
    password: string,
    token: string,
    confirmPassword: string,
  ) {
    const tokenData = await this.jwtHelper.decodePayload(token);
    if (tokenData.email && password === confirmPassword)
      await this.firebaseHelper.resetPassword(
        tokenData.email as string,
        password,
      );
    else {
      throw new Error('Invalid token');
    }

    return 'success';
  }
}
