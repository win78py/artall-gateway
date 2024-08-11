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
  CheckBlockExistsResponse,
  CreateBlockRequest,
  DeleteBlockResponse,
  GetAllBlockListRequest,
  GetBlockIdRequest,
  BlockResponse,
  BlockServiceClient,
  ManyBlockResponse,
} from 'src/common/interface/block.interface';
import { UseFilters } from '@nestjs/common';
import { GatewayExceptionFilter } from '../../common/exceptions/gateway.exception';
import { validate as uuidValidate } from 'uuid';
import { CreateBlockDto } from './dto/create-block.dto';

@Injectable()
@UseFilters(GatewayExceptionFilter)
export class BlockService {
  private blockServiceClient: BlockServiceClient;
  private readonly logger = new Logger(BlockService.name);
  constructor(@Inject('USER_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.blockServiceClient =
      this.client.getService<BlockServiceClient>('UserService');
  }

  getAllBlockList(
    params: GetAllBlockListRequest,
  ): Observable<ManyBlockResponse> {
    return this.blockServiceClient.getAllBlockList(params);
  }

  getBlockById(id: string): Observable<BlockResponse> {
    const request: GetBlockIdRequest = { id };
    return this.blockServiceClient.getBlockId(request);
  }

  createBlock(dto: CreateBlockDto): Observable<BlockResponse> {
    const request: CreateBlockRequest = {
      blockerId: dto.blockerId,
      blockedId: dto.blockedId,
    };

    return this.blockServiceClient.createBlock(request).pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          throw new RpcException(error.message);
        }
        throw new RpcException('Internal server error');
      }),
    );
  }

  deleteBlock(id: string): Observable<DeleteBlockResponse> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const checkRequest = { id };

    return this.blockServiceClient.checkBlockExists(checkRequest).pipe(
      switchMap((response: CheckBlockExistsResponse) => {
        if (!response.exists) {
          throw new NotFoundException(`Block with ID ${id} not found`);
        }

        const deleteRequest = { id };

        return this.blockServiceClient.deleteBlock(deleteRequest).pipe(
          map(() => ({
            data: null,
            message: 'Block deletion successful',
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
