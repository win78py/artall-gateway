import { PageOptionsDto } from '../../../common/dtos/pageOption';

export class GetUserInfoParams extends PageOptionsDto {
  username: string;
  profilePicture: string;
}
