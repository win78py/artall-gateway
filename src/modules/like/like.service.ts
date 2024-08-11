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
  CheckLikeExistsResponse,
  CreateLikeRequest,
  DeleteLikeResponse,
  GetAllLikeRequest,
  GetLikeIdRequest,
  LikeResponse,
  LikeServiceClient,
  ManyLikeResponse,
} from 'src/common/interface/like.interface';
import { UseFilters } from '@nestjs/common';
import { GatewayExceptionFilter } from '../../common/exceptions/gateway.exception';
import { validate as uuidValidate } from 'uuid';
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

  getAllLike(params: GetAllLikeRequest): Observable<ManyLikeResponse> {
    return this.likeServiceClient.getAllLike(params);
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

  deleteLike(id: string): Observable<DeleteLikeResponse> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const checkRequest = { id };

    return this.likeServiceClient.checkLikeExists(checkRequest).pipe(
      switchMap((response: CheckLikeExistsResponse) => {
        if (!response.exists) {
          throw new NotFoundException(`Like with ID ${id} not found`);
        }

        const deleteRequest = { id };

        return this.likeServiceClient.deleteLike(deleteRequest).pipe(
          map(() => ({
            data: null,
            message: 'Like deletion successful',
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
