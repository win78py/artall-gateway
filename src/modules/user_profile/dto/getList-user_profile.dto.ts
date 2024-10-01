import { GenderEnum, profileVisibilityEnum } from '../../../common/enum/enum';
import { PageOptionsDto } from '../../../common/dtos/pageOption';

export class GetUserProfileParams extends PageOptionsDto {
  password: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  role: string;
  birthDate: Date;
  location: string;
  website: string;
  socialLinks: any;
  lastLogin: Date;
  status: string;
  profileVisibility: profileVisibilityEnum;
  gender: GenderEnum;
  isActive: boolean;
  userInfoId: string;
}
