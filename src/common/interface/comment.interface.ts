import { Observable } from 'rxjs';

export interface CommentServiceClient {
  getAllComments(request: GetAllCommentsRequest): Observable<CommentsResponse>;
  getCommentId(request: GetCommentIdRequest): Observable<CommentResponse>;
  createComment(request: CreateCommentRequest): Observable<CommentResponse>;
  checkCommentExists(
    request: CheckCommentExistsRequest,
  ): Observable<CheckCommentExistsResponse>;
  updateComment(request: UpdateCommentRequest): Observable<CommentResponse>;
  deleteComment(
    request: DeleteCommentRequest,
  ): Observable<DeleteCommentResponse>;
}

export interface GetAllCommentsRequest {
  page?: number;
  take?: number;
  search?: string;
}

export interface GetCommentIdRequest {
  id: string;
}

export interface CreateCommentRequest {
  content: string;
  mediaPath: Buffer[];
  postId: string;
  userId: string;
}

export interface CheckCommentExistsRequest {
  id: string;
}

export interface CheckCommentExistsResponse {
  exists: boolean;
}

export interface UpdateCommentRequest {
  id: string;
  content?: string;
  mediaPath?: Buffer[];
  postId?: string;
  userId?: string;
}

export interface CommentResponse {
  id: string;
  content: string;
  mediaPath: string[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
  postId: string;
  userId: string;
}

export interface PageMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CommentsResponse {
  data: CommentResponse[];
  meta: PageMeta;
  message: string;
}

export interface DeleteCommentRequest {
  id: string;
}

export interface DeleteCommentResponse {
  data: string;
  message: string;
}
