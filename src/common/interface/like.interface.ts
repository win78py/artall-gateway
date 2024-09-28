import { Observable } from 'rxjs';

export interface LikeServiceClient {
  getAllLikes(request: GetAllLikesRequest): Observable<LikesResponse>;
  getLikeId(request: GetLikeIdRequest): Observable<LikeResponse>;
  createLike(request: CreateLikeRequest): Observable<LikeResponse>;
  checkLikeExists(
    request: CheckLikeExistsRequest,
  ): Observable<CheckLikeExistsResponse>;
  toggleLike(request: CreateLikeRequest): Observable<ToggleLikeResponse>;
}

export interface GetAllLikesRequest {
  page?: number;
  take?: number;
  skip?: number;
  post?: string;
}

export interface GetLikeIdRequest {
  id: string;
}

export interface CreateLikeRequest {
  postId: string;
  userId: string;
}

export interface CheckLikeExistsRequest {
  id: string;
}

export interface CheckLikeExistsResponse {
  exists: boolean;
}

export interface LikeResponse {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
}

export interface LikesResponse {
  data: LikeResponse[];
  meta: PageMeta;
  message: string;
}

export interface ToggleLikeResponse {
  data: LikeResponse | null;
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
