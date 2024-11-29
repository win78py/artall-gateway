import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { UserInfoController } from './user_info.controller';
import { UserInfoService } from './user_info.service';
import { grpcUserClientOptions } from '../../grpc/grpc-client.options';
import { AuthModule } from 'modules/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        ...grpcUserClientOptions,
      },
    ]),
  ],
  controllers: [UserInfoController],
  providers: [UserInfoService],
})
export class UserInfoModule {}
