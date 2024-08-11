import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  GenderEnum,
  RoleEnum,
  profileVisibilityEnum,
} from 'src/common/enum/enum';

export class CreateUserProfileDto {
  @IsNotEmpty()
  password: string;

  fullName: string;

  @IsNotEmpty()
  email: string;

  phoneNumber: string;

  bio: string;

  role: RoleEnum;

  birthDate: Date;

  location: string;

  website: string;

  socialLinks: string;

  profileVisibility: profileVisibilityEnum;

  gender: GenderEnum;

  lastLogin: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsString()
  @IsNotEmpty()
  userInfoId: string;
}
