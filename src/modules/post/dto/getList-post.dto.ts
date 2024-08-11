import { PageOptionsDto } from '../../../common/dtos/pageOption';

export class GetPostParams extends PageOptionsDto {
  content: string;
  mediaPath: string;
  userId: string;
}
