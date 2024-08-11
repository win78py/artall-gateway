import { Observable } from 'rxjs';

export interface UserInfoServiceClient {
  getAllUsersInfo(
    request: GetAllUsersInfoRequest,
  ): Observable<UsersInfoResponse>;
  getUserInfoId(request: GetUserInfoIdRequest): Observable<UserInfoResponse>;
  createUserInfo(request: CreateUserInfoRequest): Observable<UserInfoResponse>;
  checkUserInfoExists(
    request: CheckUserInfoExistsRequest,
  ): Observable<CheckUserInfoExistsResponse>;
  updateUserInfo(request: UpdateUserInfoRequest): Observable<UserInfoResponse>;
  deleteUserInfo(
    request: DeleteUserInfoRequest,
  ): Observable<DeleteUserInfoResponse>;
}

export interface GetAllUsersInfoRequest {
  page?: number;
  take?: number;
  search?: string;
}

export interface GetUserInfoIdRequest {
  id: string;
}

export interface CreateUserInfoRequest {
  username: string;
  profilePicture: string;
}

export interface CheckUserInfoExistsRequest {
  id: string;
}

export interface CheckUserInfoExistsResponse {
  exists: boolean;
}

export interface UpdateUserInfoRequest {
  id: string;
  username?: string;
  profilePicture?: Buffer;
}

export interface UserInfoResponse {
  id: string;
  username: string;
  profilePicture: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
}

export interface UsersInfoResponse {
  data: UserInfoResponse[];
  meta: PageMeta;
  message: string;
}

export interface DeleteUserInfoRequest {
  id: string;
}

export interface DeleteUserInfoResponse {
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
