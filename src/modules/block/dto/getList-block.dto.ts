import { PageOptionsDto } from '../../../common/dtos/pageOption';

export class GetBlockParams extends PageOptionsDto {
  blockerId: string;
  blockedId: string;
}
