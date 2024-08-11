import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { grpcPostClientOptions } from '../../grpc/grpc-client.options';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'POST_SERVICE',
        ...grpcPostClientOptions,
      },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
