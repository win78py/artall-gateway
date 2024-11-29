import { Inject, Injectable, UseFilters } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  MailServiceClient,
  SendMailRequest,
  SendMailResponse,
} from '../../common/interface/mail.interface';
import { GatewayExceptionFilter } from 'common/exceptions/gateway.exception';

@Injectable()
@UseFilters(GatewayExceptionFilter)
export class MailService {
  private mailServiceClient: MailServiceClient;

  constructor(@Inject('MAIL_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.mailServiceClient =
      this.client.getService<MailServiceClient>('MailService');
  }

  // sendMailTest(data: SendMailRequest): Observable<SendMailResponse> {
  //   console.log('Received SendMailRequest:', data);

  //   return this.mailServiceClient.sendMail(data);
  // }

  sendResetPasswordLink(data: SendMailRequest): Observable<SendMailResponse> {
    return this.mailServiceClient.sendResetPasswordLink(data);
  }
}
