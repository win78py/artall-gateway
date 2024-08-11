import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
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
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
