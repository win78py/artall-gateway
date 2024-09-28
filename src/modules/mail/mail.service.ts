import { Injectable } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  SendMailRequest,
  SendMailResponse,
} from 'src/common/interface/mail.interface';
import { grpcMailClientOptions } from 'src/grpc/grpc-client.options';

@Injectable()
export class MailService {
  @Client(grpcMailClientOptions)
  private readonly client: ClientGrpc;

  private mailServiceClient: any;

  onModuleInit() {
    this.mailServiceClient = this.client.getService('MailService');
  }

  sendMail(data: SendMailRequest): Observable<SendMailResponse> {
    return this.mailServiceClient.sendMail(data);
  }
}
