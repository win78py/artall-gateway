import { PageOptionsDto } from '../../../common/dtos/pageOption';

export class GetFollowParams extends PageOptionsDto {
  followerId: string;
  followingId: string;
}
