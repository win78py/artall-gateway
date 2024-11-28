// auth.service.ts
import {
  Inject,
  Injectable,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-google-oauth20';
import { UserInfoServiceClient } from '../../common/interface/userInfor.interface';
import { UserProfileServiceClient } from '../../common/interface/userProfile.interface';
import { lastValueFrom } from 'rxjs';
import { CreateUserWithProfileDto } from '../user_info/dto/create-user.dto';
import { profileVisibilityEnum, RoleEnum } from '../../common/enum/enum';
import { UserInfoService } from '../user_info/user_info.service';
import { UserProfileService } from '../user_profile/user_profile.service';
import * as crypto from 'crypto';
import { MailService } from 'modules/mail/mail.service';
import {
  SendMailRequest,
  SendMailResponse,
} from 'common/interface/mail.interface';
import { ConfigService } from '@nestjs/config';
import { GatewayExceptionFilter } from 'common/exceptions/gateway.exception';
@Injectable()
@UseFilters(GatewayExceptionFilter)
export class AuthService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userInfoServiceClient: UserInfoServiceClient,
    @Inject('USER_SERVICE')
    private readonly userProfileServiceClient: UserProfileServiceClient,
    private readonly userInfoService: UserInfoService,
    private readonly userProfileService: UserProfileService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // async signIn(username: string, pass: string): Promise<any> {
  //   console.log(`Attempting login with username: ${username}`);
  //   // Lấy tất cả thông tin user với username được cung cấp
  //   const allUsersResponse = await lastValueFrom(
  //     this.userInfoService.getAllUsers({ username }),
  //   );

  //   // Tìm kiếm user có username khớp
  //   const userInfo = allUsersResponse.data.find(
  //     (user) => user.username === username,
  //   );
  //   console.log(`userInfo found: ${JSON.stringify(userInfo)}`);

  //   // Kiểm tra nếu không tìm thấy user
  //   if (!userInfo) {
  //     throw new UnauthorizedException('User not found');
  //   }

  //   // Kiểm tra xem userProfile có tồn tại và so khớp mật khẩu
  //   const userProfile = userInfo.userProfile;
  //   if (!userProfile || userProfile.password !== pass) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
  //   console.log(`UserProfile found: ${JSON.stringify(userProfile)}`);

  //   const [storedHash, salt] = userProfile.password.split('.');
  //   if (!storedHash || !salt) {
  //     throw new UnauthorizedException('Invalid password format');
  //   }
  //   const inputHash = crypto
  //     .pbkdf2Sync(userProfile.password, salt, 10000, 64, 'sha512')
  //     .toString('hex');

  //   if (storedHash !== inputHash) {
  //     throw new UnauthorizedException('Invalid email or password');
  //   }
  //   console.log(`UserProfile found: ${JSON.stringify(inputHash)}`);

  //   // Tạo payload cho JWT token
  //   const payload = {
  //     sub: userInfo.id,
  //     username: userInfo.username,
  //     role: userProfile.role,
  //   };
  //   console.log(`Login successful for username: ${username}`);

  //   // Trả về JWT token
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };
  // }

  async signIn(username: string, pass: string): Promise<any> {
    console.log(`Attempting login with username: ${username}`);

    const allUsersResponse = await lastValueFrom(
      this.userInfoService.getAllUsers({ username }),
    );

    const userInfo = allUsersResponse.data.find(
      (user) => user.username === username,
    );
    console.log(`userInfo found: ${JSON.stringify(userInfo)}`);

    if (!userInfo) {
      throw new UnauthorizedException('User not found');
    }

    const userProfile = userInfo.userProfile;
    if (!userProfile) {
      throw new UnauthorizedException('User profile not found');
    }
    console.log(`UserProfile found: ${JSON.stringify(userProfile)}`);

    if (!userProfile.password.includes('.')) {
      if (userProfile.password !== pass) {
        throw new UnauthorizedException('Invalid credentials');
      }
    } else {
      const [storedHash, salt] = userProfile.password.split('.');

      if (!storedHash || !salt) {
        throw new UnauthorizedException('Invalid password format');
      }

      const inputHash = crypto
        .pbkdf2Sync(pass, salt, 10000, 64, 'sha512')
        .toString('hex');

      if (storedHash !== inputHash) {
        throw new UnauthorizedException('Invalid email or password');
      }
    }

    const payload = {
      sub: userInfo.id,
      username: userInfo.username,
      role: userProfile.role,
    };
    console.log(`Login successful for username: ${username}`);

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUserFromGoogle(profile: Profile) {
    const { emails, displayName } = profile;
    const gmail = emails[0].value;
    const username = gmail.split('@')[0];

    const userProfileResponse = await lastValueFrom(
      this.userProfileService.getUserProfileByEmail(gmail),
    );

    let user = userProfileResponse?.userProfile;

    if (!user) {
      const createUserDto: CreateUserWithProfileDto = {
        username: username,
        email: gmail,
        password: '123456',
        fullName: displayName,
        bio: '',
        role: RoleEnum.USER,
        phoneNumber: '',
        birthDate: new Date(),
        location: '',
        website: '',
        socialLinks: null,
        lastLogin: new Date(),
        profileVisibility: profileVisibilityEnum.PUBLIC,
        gender: null,
        isActive: true,
      };

      const newUserResponse = await lastValueFrom(
        this.userInfoService.createUserWithProfile(createUserDto),
      );

      user = {
        ...newUserResponse.userProfile,
        ...newUserResponse.userInfo,
      };
    }

    return user;
  }

  async validateUserFromToken(token: string): Promise<any> {
    try {
      const decodedToken = this.jwtService.verify(token);
      if (!decodedToken || !decodedToken.sub) {
        throw new UnauthorizedException('Invalid token');
      }

      const userInfoResponse = await lastValueFrom(
        this.userInfoServiceClient.getUserInfoId({ id: decodedToken.sub }),
      );
      const userInfo = userInfoResponse;

      if (!userInfo) {
        throw new UnauthorizedException('User not found');
      }

      return userInfo;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      throw error;
    }
  }

  hashPassword(password: string, salt: string): string {
    const hash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');
    return `${hash}.${salt}`;
  }

  async forgotPassword(username: string): Promise<void> {
    const allUsersResponse = await lastValueFrom(
      this.userInfoService.getAllUsers({ username }),
    );

    const userInfo = allUsersResponse.data.find(
      (user) => user.username === username,
    );

    if (!userInfo) {
      throw new UnauthorizedException('User not found');
    }

    const email = userInfo.userProfile.email;
    const userProfileId = userInfo.userProfile.id;

    const payload = { email, userProfileId };
    console.log('Payload for reset password:', payload);

    const token = this.jwtService.sign(payload);

    const url = `${this.configService.get('RESET_PASSWORD_URL')}?token=${token}`;

    const text = `Hi, \nTo reset your password, click here: ${url}`;

    const data: SendMailRequest = {
      to: email,
      subject: 'Reset password',
      text: text,
    };
    console.log('Sending reset password email to:', data);

    this.mailService.sendResetPasswordLink(data).subscribe({
      next: (mailResponse: SendMailResponse) => {
        console.log('Email sent successfully', mailResponse);
      },
      error: (error) => {
        console.error('Error sending email: ', error.message);
      },
    });
  }
}
