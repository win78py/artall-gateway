import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, map, Observable } from 'rxjs';
import {
  CreateLikeRequest,
  GetAllLikesRequest,
  GetLikeIdRequest,
  LikeResponse,
  LikeServiceClient,
  LikesResponse,
  ToggleLikeResponse,
} from 'src/common/interface/like.interface';
import { UseFilters } from '@nestjs/common';
import { GatewayExceptionFilter } from '../../common/exceptions/gateway.exception';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
@UseFilters(GatewayExceptionFilter)
export class LikeService {
  private readonly logger = new Logger(LikeService.name);
  private likeServiceClient: LikeServiceClient;
  constructor(@Inject('POST_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.likeServiceClient =
      this.client.getService<LikeServiceClient>('PostService');
  }

  getAllLikes(params: GetAllLikesRequest): Observable<LikesResponse> {
    return this.likeServiceClient.getAllLikes(params);
  }

  getLikeById(id: string): Observable<LikeResponse> {
    const request: GetLikeIdRequest = { id };
    return this.likeServiceClient.getLikeId(request);
  }

  createLike(dto: CreateLikeDto): Observable<LikeResponse> {
    const request: CreateLikeRequest = {
      postId: dto.postId,
      userId: dto.userId,
    };

    return this.likeServiceClient.createLike(request).pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          throw new RpcException(error.message);
        }
        throw new RpcException('Internal server error');
      }),
    );
  }

  toggleLike(dto: CreateLikeDto): Observable<ToggleLikeResponse> {
    const request: CreateLikeRequest = {
      postId: dto.postId,
      userId: dto.userId,
    };

    return this.likeServiceClient.toggleLike(request).pipe(
      map((response) => ({
        data: response.data,
        message: response.message,
      })),
      catchError((error) => {
        if (error instanceof HttpException) {
          throw new RpcException(error.message);
        }
        throw new RpcException('Internal server error');
      }),
    );
  }
}
