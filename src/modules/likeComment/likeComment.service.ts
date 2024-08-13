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
  CheckLikeCommentExistsResponse,
  CreateLikeCommentRequest,
  DeleteLikeCommentResponse,
  GetAllLikesCommentRequest,
  GetLikeCommentIdRequest,
  LikeCommentResponse,
  LikesCommentResponse,
  LikeCommentServiceClient,
} from '../../common/interface/likeComment.interface';
import { UseFilters } from '@nestjs/common';
import { GatewayExceptionFilter } from '../../common/exceptions/gateway.exception';
import { validate as uuidValidate } from 'uuid';
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

  deleteLikeComment(id: string): Observable<DeleteLikeCommentResponse> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const checkRequest = { id };

    return this.likeCommentServiceClient
      .checkLikeCommentExists(checkRequest)
      .pipe(
        switchMap((response: CheckLikeCommentExistsResponse) => {
          if (!response.exists) {
            throw new NotFoundException(`Like with ID ${id} not found`);
          }

          const deleteRequest = { id };

          return this.likeCommentServiceClient
            .deleteLikeComment(deleteRequest)
            .pipe(
              map(() => ({
                data: null,
                message: 'Like Comment deletion successful',
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
