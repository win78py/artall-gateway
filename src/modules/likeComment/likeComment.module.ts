import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { LikeCommentController } from './likeComment.controller';
import { LikeCommentService } from './likeComment.service';
import { grpcPostClientOptions } from '../../grpc/grpc-client.options';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'POST_SERVICE',
        ...grpcPostClientOptions,
      },
    ]),
  ],
  controllers: [LikeCommentController],
  providers: [LikeCommentService],
})
export class LikeCommentModule {}
