import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { grpcPostClientOptions } from '../../grpc/grpc-client.options';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: 'POST_SERVICE',
        ...grpcPostClientOptions,
      },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
