import { Observable } from 'rxjs';

export interface LikeCommentServiceClient {
  getAllLikesComment(
    request: GetAllLikesCommentRequest,
  ): Observable<LikesCommentResponse>;
  getLikeCommentId(
    request: GetLikeCommentIdRequest,
  ): Observable<LikeCommentResponse>;
  createLikeComment(
    request: CreateLikeCommentRequest,
  ): Observable<LikeCommentResponse>;
  checkLikeCommentExists(
    request: CheckLikeCommentExistsRequest,
  ): Observable<CheckLikeCommentExistsResponse>;
  updateLikeComment(
    request: UpdateLikeCommentRequest,
  ): Observable<LikeCommentResponse>;
  deleteLikeComment(
    request: DeleteLikeCommentRequest,
  ): Observable<DeleteLikeCommentResponse>;
}

export interface GetAllLikesCommentRequest {
  page?: number;
  take?: number;
  search?: string;
}

export interface GetLikeCommentIdRequest {
  id: string;
}

export interface CreateLikeCommentRequest {
  commentId: string;
  userId: string;
}

export interface CheckLikeCommentExistsRequest {
  id: string;
}

export interface CheckLikeCommentExistsResponse {
  exists: boolean;
}

export interface UpdateLikeCommentRequest {
  id: string;
  commentId?: string;
  userId?: string;
}

export interface LikeCommentResponse {
  id: string;
  commentId: string;
  userId: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
}

export interface LikesCommentResponse {
  data: LikeCommentResponse[];
  meta: PageMeta;
  message: string;
}

export interface DeleteLikeCommentRequest {
  id: string;
}

export interface DeleteLikeCommentResponse {
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
