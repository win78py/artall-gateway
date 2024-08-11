import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { UserProfileController } from './user_profile.controller';
import { UserProfileService } from './user_profile.service';
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
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
