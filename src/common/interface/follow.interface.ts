import { Observable } from 'rxjs';

export interface FollowServiceClient {
  getAllFollow(request: GetAllFollowRequest): Observable<ManyFollowResponse>;
  getFollowId(request: GetFollowIdRequest): Observable<FollowResponse>;
  createFollow(request: CreateFollowRequest): Observable<FollowResponse>;
  checkFollowExists(
    request: CheckFollowExistsRequest,
  ): Observable<CheckFollowExistsResponse>;
  updateFollow(request: UpdateFollowRequest): Observable<FollowResponse>;
  deleteFollow(request: DeleteFollowRequest): Observable<DeleteFollowResponse>;
}

export interface GetAllFollowRequest {
  page?: number;
  take?: number;
  skip?: number;
  follower?: string;
  following?: string;
}

export interface GetFollowIdRequest {
  id: string;
}

export interface CreateFollowRequest {
  followerId: string;
  followingId: string;
}

export interface CheckFollowExistsRequest {
  id: string;
}

export interface CheckFollowExistsResponse {
  exists: boolean;
}

export interface UpdateFollowRequest {
  id: string;
  followerId?: string;
  followingId?: string;
}

export interface FollowerFollowingResponse {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
  follower: {
    username: string;
    profilePicture: string;
  };
  following: {
    username: string;
    profilePicture: string;
  };
}

export interface FollowResponse {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
}

export interface ManyFollowResponse {
  data: FollowerFollowingResponse[];
  meta: PageMeta;
  message: string;
}

export interface DeleteFollowRequest {
  id: string;
}

export interface DeleteFollowResponse {
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
