import { Injectable } from '@nestjs/common/decorators';
import { MailerService } from '@nestjs-modules/mailer';
import { apiConfig } from '@ankora/config';
import path = require('path');

@Injectable()
export class MdcMailerService {
  constructor(private readonly mailerService: MailerService) {}

  public async resetPassword(email: string, context: { link: string }) {
    await this.mailerService.sendMail({
      to: email,
      from: apiConfig.mailer.from,
      subject: 'Confirm mail',
      template: path.join(__dirname, '/src/templates/forgotPassword'),
      context,
    });

    return { success: true };
  }
}
