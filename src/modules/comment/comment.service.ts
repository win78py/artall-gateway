import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, map, Observable, switchMap } from 'rxjs';
import {
  CommentServiceClient,
  CheckCommentExistsRequest,
  CheckCommentExistsResponse,
  CreateCommentRequest,
  DeleteCommentResponse,
  GetAllCommentsRequest,
  GetCommentIdRequest,
  UpdateCommentRequest,
  CommentResponse,
  CommentsResponse,
} from '../../common/interface/comment.interface';
import { Multer } from 'multer';
import { UseFilters } from '@nestjs/common';
import { GatewayExceptionFilter } from '../../common/exceptions/gateway.exception';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { validate as uuidValidate } from 'uuid';

@Injectable()
@UseFilters(GatewayExceptionFilter)
export class CommentService {
  private readonly logger = new Logger(CommentService.name);
  private commentServiceClient: CommentServiceClient;
  constructor(@Inject('POST_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.commentServiceClient =
      this.client.getService<CommentServiceClient>('PostService');
  }

  getAllComments(params: GetAllCommentsRequest): Observable<CommentsResponse> {
    return this.commentServiceClient.getAllComments(params);
  }

  getCommentById(id: string): Observable<CommentResponse> {
    const request: GetCommentIdRequest = { id };
    return this.commentServiceClient.getCommentId(request);
  }

  createComment(
    dto: CreateCommentDto,
    mediaPath: Array<Multer.File>,
  ): Observable<CommentResponse> {
    if (!dto.userId) {
      throw new BadRequestException('UserId is required');
    }

    const mediaPathBuffers = mediaPath
      ? mediaPath.map((file) => file.buffer)
      : [];

    const request: CreateCommentRequest = {
      content: dto.content,
      mediaPath: mediaPathBuffers,
      postId: dto.postId,
      userId: dto.userId,
    };

    return this.commentServiceClient.createComment(request).pipe(
      catchError((error) => {
        this.logger.error(
          `Error in create Comment: ${error.message}`,
          error.stack,
        );
        if (error instanceof HttpException) {
          throw new RpcException(error.message);
        }
        throw new RpcException('Internal server error');
      }),
    );
  }

  updateComment(
    id: string,
    dto: UpdateCommentDto,
    mediaPath: Array<Multer.File>,
  ): Observable<CommentResponse> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const checkRequest: CheckCommentExistsRequest = { id };

    return this.commentServiceClient.checkCommentExists(checkRequest).pipe(
      switchMap((response: CheckCommentExistsResponse) => {
        if (!response.exists) {
          throw new NotFoundException(`Comment with ID ${id} not found`);
        }

        const mediaPathBuffers =
          mediaPath && mediaPath.length > 0
            ? mediaPath.map((file) => file.buffer)
            : [];

        const updateRequest: UpdateCommentRequest = {
          id,
          mediaPath: mediaPathBuffers,
          postId: dto.postId,
          userId: dto.userId,
        };

        if (dto.content && dto.content.trim() !== '') {
          updateRequest.content = dto.content;
        }

        this.logger.log(
          `Update request payload: ${JSON.stringify({
            id: updateRequest.id,
            content: updateRequest.content,
            mediaPathCount: mediaPathBuffers.length,
            postId: updateRequest.postId,
            userId: updateRequest.userId,
          })}`,
        );

        return this.commentServiceClient.updateComment(updateRequest).pipe(
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

  deleteComment(id: string): Observable<DeleteCommentResponse> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const checkRequest = { id };

    return this.commentServiceClient.checkCommentExists(checkRequest).pipe(
      switchMap((response: CheckCommentExistsResponse) => {
        if (!response.exists) {
          throw new NotFoundException(`Comment with ID ${id} not found`);
        }

        const deleteRequest = { id };

        return this.commentServiceClient.deleteComment(deleteRequest).pipe(
          map(() => ({
            data: null,
            message: 'Comment Info deletion successful',
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
