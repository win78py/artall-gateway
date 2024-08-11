import { PageOptionsDto } from '../../../common/dtos/pageOption';

export class GetLikeParams extends PageOptionsDto {
  postId: string;
  userId: string;
}
