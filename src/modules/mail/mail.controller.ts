import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Observable } from 'rxjs';
import {
  SendMailRequest,
  SendMailResponse,
} from '../../common/interface/mail.interface';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  sendMail(): Observable<SendMailResponse> {
    const request: SendMailRequest = {
      to: 'thangtnsa000@gmail.com',
      subject: 'Your contribution has been rejected!',
      template: './rejectMail.hbs',
    };
    return this.mailService.sendMail(request);
  }
}
