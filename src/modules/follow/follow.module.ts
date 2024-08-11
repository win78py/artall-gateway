import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { grpcUserClientOptions } from '../../grpc/grpc-client.options';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        ...grpcUserClientOptions,
      },
    ]),
  ],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
