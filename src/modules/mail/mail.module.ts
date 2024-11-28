import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { grpcMailClientOptions } from '../../grpc/grpc-client.options';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MAIL_SERVICE',
        ...grpcMailClientOptions,
      },
    ]),
  ],
  providers: [MailService],
})
export class MailModule {}
