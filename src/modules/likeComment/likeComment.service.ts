import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, map, Observable } from 'rxjs';
import {
  CreateLikeCommentRequest,
  GetAllLikesCommentRequest,
  GetLikeCommentIdRequest,
  LikeCommentResponse,
  LikesCommentResponse,
  LikeCommentServiceClient,
  ToggleLikeCommentResponse,
} from '../../common/interface/likeComment.interface';
import { UseFilters } from '@nestjs/common';
import { GatewayExceptionFilter } from '../../common/exceptions/gateway.exception';
import { CreateLikeCommentDto } from './dto/create-likeComment.dto';

@Injectable()
@UseFilters(GatewayExceptionFilter)
export class LikeCommentService {
  private readonly logger = new Logger(LikeCommentService.name);
  private likeCommentServiceClient: LikeCommentServiceClient;
  constructor(@Inject('POST_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.likeCommentServiceClient =
      this.client.getService<LikeCommentServiceClient>('PostService');
  }

  getAllLikesComment(
    params: GetAllLikesCommentRequest,
  ): Observable<LikesCommentResponse> {
    return this.likeCommentServiceClient.getAllLikesComment(params);
  }

  getLikeCommentById(id: string): Observable<LikeCommentResponse> {
    const request: GetLikeCommentIdRequest = { id };
    return this.likeCommentServiceClient.getLikeCommentId(request);
  }

  createLikeComment(
    dto: CreateLikeCommentDto,
  ): Observable<LikeCommentResponse> {
    const request: CreateLikeCommentRequest = {
      commentId: dto.commentId,
      userId: dto.userId,
    };

    return this.likeCommentServiceClient.createLikeComment(request).pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          throw new RpcException(error.message);
        }
        throw new RpcException('Internal server error');
      }),
    );
  }

  toggleLikeComment(
    dto: CreateLikeCommentDto,
  ): Observable<ToggleLikeCommentResponse> {
    const request: CreateLikeCommentRequest = {
      commentId: dto.commentId,
      userId: dto.userId,
    };

    return this.likeCommentServiceClient.toggleLikeComment(request).pipe(
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
