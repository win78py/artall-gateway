import { Observable } from 'rxjs';

export interface PostServiceClient {
  getAllPosts(request: GetAllPostsRequest): Observable<PostsResponse>;
  getPostId(request: GetPostIdRequest): Observable<PostResponse>;
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
  search?: string;
}

export interface GetPostIdRequest {
  id: string;
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
  data: PostResponse[];
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
