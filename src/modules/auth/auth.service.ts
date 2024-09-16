// auth.service.ts
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-google-oauth20';
import { UserInfoServiceClient } from 'src/common/interface/userInfor.interface';
import { UserProfileServiceClient } from 'src/common/interface/userProfile.interface';
import { lastValueFrom } from 'rxjs';
import { CreateUserWithProfileDto } from '../user_info/dto/create-user.dto';
import { profileVisibilityEnum, RoleEnum } from 'src/common/enum/enum';
import { UserInfoService } from '../user_info/user_info.service';
import { UserProfileService } from '../user_profile/user_profile.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userInfoServiceClient: UserInfoServiceClient,
    @Inject('USER_SERVICE')
    private readonly userProfileServiceClient: UserProfileServiceClient,
    private readonly userInfoService: UserInfoService,
    private readonly userProfileService: UserProfileService,

    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    console.log(`Attempting login with username: ${username}`);
    // Lấy tất cả thông tin user với username được cung cấp
    const allUsersResponse = await lastValueFrom(
      this.userInfoService.getAllUsers({ username }),
    );
    console.log(`Received user data: ${JSON.stringify(allUsersResponse.data)}`);

    // Tìm kiếm user có username khớp
    const userInfo = allUsersResponse.data.find(
      (user) => user.username === username,
    );
    console.log(`Found userInfo: ${JSON.stringify(userInfo)}`);

    // Kiểm tra nếu không tìm thấy user
    if (!userInfo) {
      throw new UnauthorizedException('User not found');
    }

    // Kiểm tra xem userProfile có tồn tại và so khớp mật khẩu
    const userProfile = userInfo.userProfile;
    if (!userProfile || userProfile.password !== pass) {
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log(`UserProfile found: ${JSON.stringify(userProfile)}`);

    // Tạo payload cho JWT token
    const payload = {
      sub: userInfo.id,
      username: userInfo.username,
      role: userProfile.role,
    };
    console.log(`Login successful for username: ${username}`);

    // Trả về JWT token
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUserFromGoogle(profile: Profile) {
    const { emails, displayName } = profile;
    const gmail = emails[0].value;

    // Sử dụng hàm getUserProfileByEmail từ userProfileService để tìm user theo email
    const userProfileResponse = await lastValueFrom(
      this.userProfileService.getUserProfileByEmail(gmail),
    );

    let user = userProfileResponse?.userProfile;

    if (!user) {
      // Nếu người dùng không tồn tại, tạo mới userInfo và userProfile qua hàm createUserWithProfile
      const createUserDto: CreateUserWithProfileDto = {
        username: displayName,
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

      // Get user info from token
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
}
