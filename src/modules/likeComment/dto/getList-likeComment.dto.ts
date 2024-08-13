import { PageOptionsDto } from '../../../common/dtos/pageOption';

export class GetLikeParams extends PageOptionsDto {
  commentId: string;
  userId: string;
}
