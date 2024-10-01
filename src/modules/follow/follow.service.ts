import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, map, Observable, switchMap } from 'rxjs';
import {
  CheckFollowExistsResponse,
  CreateFollowRequest,
  DeleteFollowResponse,
  GetAllFollowRequest,
  GetFollowIdRequest,
  FollowResponse,
  FollowServiceClient,
  ManyFollowResponse,
} from '../../common/interface/follow.interface';
import { UseFilters } from '@nestjs/common';
import { GatewayExceptionFilter } from '../../common/exceptions/gateway.exception';
import { validate as uuidValidate } from 'uuid';
import { CreateFollowDto } from './dto/create-follow.dto';

@Injectable()
@UseFilters(GatewayExceptionFilter)
export class FollowService {
  private followServiceClient: FollowServiceClient;
  private readonly logger = new Logger(FollowService.name);
  constructor(@Inject('USER_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.followServiceClient =
      this.client.getService<FollowServiceClient>('UserService');
  }

  getAllFollow(params: GetAllFollowRequest): Observable<ManyFollowResponse> {
    return this.followServiceClient.getAllFollow(params);
  }

  getFollowById(id: string): Observable<FollowResponse> {
    const request: GetFollowIdRequest = { id };
    return this.followServiceClient.getFollowId(request);
  }

  createFollow(dto: CreateFollowDto): Observable<FollowResponse> {
    const request: CreateFollowRequest = {
      followerId: dto.followerId,
      followingId: dto.followingId,
    };

    return this.followServiceClient.createFollow(request).pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          throw new RpcException(error.message);
        }
        throw new RpcException('Internal server error');
      }),
    );
  }

  deleteFollow(id: string): Observable<DeleteFollowResponse> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const checkRequest = { id };

    return this.followServiceClient.checkFollowExists(checkRequest).pipe(
      switchMap((response: CheckFollowExistsResponse) => {
        if (!response.exists) {
          throw new NotFoundException(`Follow with ID ${id} not found`);
        }

        const deleteRequest = { id };

        return this.followServiceClient.deleteFollow(deleteRequest).pipe(
          map(() => ({
            data: null,
            message: 'Follow deletion successful',
          })),
          catchError((error) => {
            if (error instanceof HttpException) {
              throw new RpcException(error.message);
            }
            throw new RpcException('Internal server error');
          }),
        );
      }),
    );
  }
}
