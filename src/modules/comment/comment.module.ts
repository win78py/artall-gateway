import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { grpcPostClientOptions } from '../../grpc/grpc-client.options';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [
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
