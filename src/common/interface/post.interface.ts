import { Observable } from 'rxjs';

export interface PostServiceClient {
  getAllPosts(request: GetAllPostsRequest): Observable<PostsResponse>;
  getRandomPosts(request: GetAllPostsRequest): Observable<PostsResponse>;
  getPostsDeleted(request: GetAllPostsRequest): Observable<PostsResponse>;
  getTotalPosts(request: GetTotalPostsRequest): Observable<TotalPostsResponse>;
  getPostId(request: GetPostIdRequest): Observable<PostInfoResponse>;
  createPost(request: CreatePostRequest): Observable<PostResponse>;
  checkPostExists(
    request: CheckPostExistsRequest,
  ): Observable<CheckPostExistsResponse>;
  updatePost(request: UpdatePostRequest): Observable<PostResponse>;
  deletePost(request: DeletePostRequest): Observable<DeletePostResponse>;
}

export interface GetAllPostsRequest {
  page?: number;
  take?: number;
  skip?: number;
  content?: string;
  userId?: string;
}

export interface GetTotalPostsRequest {
  period?: string;
}

export interface GetPostIdRequest {
  id: string;
  userId: string;
}

export interface CreatePostRequest {
  content: string;
  mediaPath: Buffer[];
  userId: string;
}

export interface CheckPostExistsRequest {
  id: string;
}

export interface CheckPostExistsResponse {
  exists: boolean;
}

export interface UpdatePostRequest {
  id: string;
  content?: string;
  mediaPath?: Buffer[];
  userId?: string;
}

export interface PostInfoResponse {
  id: string;
  content: string;
  mediaPath: string[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
  userId: string;
  userInfo: {
    id: string;
    username: string;
    profilePicture: string;
  };
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export interface PostResponse {
  id: string;
  content: string;
  mediaPath: string[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
  userId: string;
  userInfo: {
    id: string;
    username: string;
    profilePicture: string;
  };
}

export interface TotalPostsResponse {
  total: number;
  oldCount: number;
  currentCount: number;
  percentagePostChange: number;
  joinCounts?: Record<number, number>;
}

export interface PageMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PostsResponse {
  data: PostInfoResponse[];
  meta: PageMeta;
  message: string;
}

export interface DeletePostRequest {
  id: string;
}

export interface DeletePostResponse {
  data: string;
  message: string;
}
