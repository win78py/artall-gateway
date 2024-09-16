import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendMail(
    contributionId: string,
    studentEmail: string,
    studentName: string,
  ) {
    const baseUrl = this.configService.get('BASE_URL');
    await this.mailerService.sendMail({
      to: studentEmail,
      subject: 'Your contribution has been reject!',
      template: './rejectMail.hbs',
      context: {
        contributionId: contributionId,
        name: studentName,
        baseUrl: baseUrl,
      },
    });
  }
}
