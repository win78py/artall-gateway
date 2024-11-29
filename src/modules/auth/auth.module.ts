// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {
  grpcMailClientOptions,
  grpcUserClientOptions,
} from '../../grpc/grpc-client.options';
import { ClientsModule } from '@nestjs/microservices';
import { GoogleStrategy } from './utils/google.strategy';
import { UserInfoService } from '../user_info/user_info.service';
import { UserProfileService } from '../user_profile/user_profile.service';
import { jwtConstants } from './utils/constants';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    PassportModule,
    MailModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        ...grpcUserClientOptions,
      },
      {
        name: 'MAIL_SERVICE',
        ...grpcMailClientOptions,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    MailService,
    GoogleStrategy,
    UserInfoService,
    UserProfileService,
  ],
  exports: [AuthService, JwtModule, MailService],
})
export class AuthModule {}
