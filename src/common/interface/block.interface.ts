import { Observable } from 'rxjs';

export interface BlockServiceClient {
  getAllBlockList(
    request: GetAllBlockListRequest,
  ): Observable<ManyBlockResponse>;
  getBlockId(request: GetBlockIdRequest): Observable<BlockResponse>;
  createBlock(request: CreateBlockRequest): Observable<BlockResponse>;
  checkBlockExists(
    request: CheckBlockExistsRequest,
  ): Observable<CheckBlockExistsResponse>;
  updateBlock(request: UpdateBlockRequest): Observable<BlockResponse>;
  deleteBlock(request: DeleteBlockRequest): Observable<DeleteBlockResponse>;
}

export interface GetAllBlockListRequest {
  page?: number;
  take?: number;
  skip?: number;
  blocker?: string;
  blocked?: string;
}

export interface GetBlockIdRequest {
  id: string;
}

export interface CreateBlockRequest {
  blockerId: string;
  blockedId: string;
}

export interface CheckBlockExistsRequest {
  id: string;
}

export interface CheckBlockExistsResponse {
  exists: boolean;
}

export interface UpdateBlockRequest {
  id: string;
  blockerId?: string;
  blockedId?: string;
}

export interface BlockerBlockedResponse {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
  blocker: {
    username: string;
    profilePicture: string;
  };
  blocked: {
    username: string;
    profilePicture: string;
  };
}

export interface BlockResponse {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
}

export interface ManyBlockResponse {
  data: BlockerBlockedResponse[];
  meta: PageMeta;
  message: string;
}

export interface DeleteBlockRequest {
  id: string;
}

export interface DeleteBlockResponse {
  data: string | null;
  message: string;
}

export interface PageMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
