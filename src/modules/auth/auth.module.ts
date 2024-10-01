import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { grpcUserClientOptions } from '../../grpc/grpc-client.options';
import { ClientsModule } from '@nestjs/microservices';
import { GoogleStrategy } from './utils/google.strategy';
import { UserInfoService } from '../user_info/user_info.service';
import { UserProfileService } from '../user_profile/user_profile.service';

@Module({
  imports: [
    PassportModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        ...grpcUserClientOptions,
      },
    ]),
    JwtModule.register({
      secret: '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',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, UserInfoService, UserProfileService],
})
export class AuthModule {}
