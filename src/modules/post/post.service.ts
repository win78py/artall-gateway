import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, map, Observable, switchMap } from 'rxjs';
import {
  PostServiceClient,
  CheckPostExistsRequest,
  CheckPostExistsResponse,
  CreatePostRequest,
  DeletePostResponse,
  GetAllPostsRequest,
  GetPostIdRequest,
  UpdatePostRequest,
  PostResponse,
  PostsResponse,
  GetTotalPostsRequest,
  TotalPostsResponse,
} from '../../common/interface/post.interface';
import { Multer } from 'multer';
import { UseFilters } from '@nestjs/common';
import { GatewayExceptionFilter } from '../../common/exceptions/gateway.exception';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { validate as uuidValidate } from 'uuid';

import { JwtStrategy } from 'modules/auth/utils/jwt.stratery';

@Injectable()
@UseFilters(GatewayExceptionFilter)
export class PostService {
  private readonly logger = new Logger(PostService.name);
  private postServiceClient: PostServiceClient;

  constructor(@Inject('POST_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.postServiceClient =
      this.client.getService<PostServiceClient>('PostService');
  }

  getAllPosts(params: GetAllPostsRequest, request): Observable<PostsResponse> {
    const token = request.headers.authorization.split(' ')[1];

    const userId = JwtStrategy.getUserIdFromToken(token);

    if (!userId) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return this.postServiceClient.getAllPosts(params);
  }

  getRandomPosts(params: GetAllPostsRequest): Observable<PostsResponse> {
    return this.postServiceClient.getRandomPosts(params);
  }

  getPostsDeleted(
    params: GetAllPostsRequest,
    request,
  ): Observable<PostsResponse> {
    const token = request.headers.authorization.split(' ')[1];

    const userId = JwtStrategy.getUserIdFromToken(token);

    if (!userId) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return this.postServiceClient.getPostsDeleted(params);
  }

  getTotalPosts(params: GetTotalPostsRequest): Observable<TotalPostsResponse> {
    return this.postServiceClient.getTotalPosts(params);
  }

  getPostById(request: GetPostIdRequest): Observable<PostResponse> {
    return this.postServiceClient.getPostId(request);
  }

  createPost(
    dto: CreatePostDto,
    mediaPath: Array<Multer.File>,
  ): Observable<PostResponse> {
    if (!dto.userId) {
      throw new BadRequestException('UserId is required');
    }

    const mediaPathBuffers = mediaPath
      ? mediaPath.map((file) => file.buffer)
      : [];

    const request: CreatePostRequest = {
      content: dto.content,
      mediaPath: mediaPathBuffers,
      userId: dto.userId,
    };

    return this.postServiceClient.createPost(request).pipe(
      catchError((error) => {
        this.logger.error(`Error in createPost: ${error.message}`, error.stack);
        if (error instanceof HttpException) {
          throw new RpcException(error.message);
        }
        throw new RpcException('Internal server error');
      }),
    );
  }

  updatePost(
    id: string,
    dto: UpdatePostDto,
    mediaPath: Array<Multer.File>,
  ): Observable<PostResponse> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const checkRequest: CheckPostExistsRequest = { id };

    return this.postServiceClient.checkPostExists(checkRequest).pipe(
      switchMap((response: CheckPostExistsResponse) => {
        if (!response.exists) {
          throw new NotFoundException(`Post with ID ${id} not found`);
        }

        const mediaPathBuffers =
          mediaPath && mediaPath.length > 0
            ? mediaPath.map((file) => file.buffer)
            : [];

        const updateRequest: UpdatePostRequest = {
          id,
          mediaPath: mediaPathBuffers,
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
            userId: updateRequest.userId,
          })}`,
        );

        return this.postServiceClient.updatePost(updateRequest).pipe(
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

  deletePost(id: string): Observable<DeletePostResponse> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const checkRequest = { id };

    return this.postServiceClient.checkPostExists(checkRequest).pipe(
      switchMap((response: CheckPostExistsResponse) => {
        if (!response.exists) {
          throw new NotFoundException(`Post with ID ${id} not found`);
        }

        const deleteRequest = { id };

        return this.postServiceClient.deletePost(deleteRequest).pipe(
          map(() => ({
            data: null,
            message: 'Post Info deletion successful',
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
