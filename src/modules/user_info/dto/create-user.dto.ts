import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  GenderEnum,
  profileVisibilityEnum,
  RoleEnum,
} from 'src/common/enum/enum';

export class CreateUserWithProfileDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  fullName: string;

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
}
