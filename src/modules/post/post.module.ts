// post.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {
  grpcMailClientOptions,
  grpcPostClientOptions,
} from '../../grpc/grpc-client.options';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
@Module({
  imports: [
    AuthModule,
    MailModule,
    ClientsModule.register([
      {
        name: 'POST_SERVICE',
        ...grpcPostClientOptions,
      },
      {
        name: 'MAIL_SERVICE',
        ...grpcMailClientOptions,
      },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, MailService],
})
export class PostModule {}
