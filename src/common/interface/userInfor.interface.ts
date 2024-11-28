import { Observable } from 'rxjs';
import { UserProfileResponse } from './userProfile.interface';

export interface UserInfoServiceClient {
  getAllUsers(request: GetAllUsersInfoRequest): Observable<UsersResponse>;
  getAllUsersDeleted(
    request: GetAllUsersInfoRequest,
  ): Observable<UsersResponse>;
  getAllUsersInfo(
    request: GetAllUsersInfoRequest,
  ): Observable<UsersInfoResponse>;
  getSuggestedUsers(
    request: GetAllUsersInfoRequest,
  ): Observable<SuggestedUsersResponse>;
  getTotalUsersInfo(
    request: GetTotalUsersInfoRequest,
  ): Observable<TotalUsersResponse>;
  getUserId(request: GetUserIdRequest): Observable<UserResponse>;
  getUserInfoId(request: GetUserInfoIdRequest): Observable<UserResponse>;
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
  skip?: number;
  username?: string;
  fullName?: string;
}

export interface GetTotalUsersInfoRequest {
  period?: string;
}

export interface GetUserIdRequest {
  id: string;
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

export interface UserInfoWithProfileResponse {
  userInfo: UserInfoResponse;
  userProfile: UserProfileResponse;
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

export interface SuggestedUserResponse {
  id: string;
  username: string;
  profilePicture: string;
  followerCount: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
}

export interface UserResponse {
  id: string;
  username: string;
  profilePicture: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
  userProfile?: {
    id: string;
    password: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    bio: string;
    role: string;
    birthDate: string;
    location: string;
    website: string;
    socialLinks: string;
    lastLogin: string;
    profileVisibility: string;
    gender: string;
    isActive: boolean;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedAt: string;
    deletedBy: string;
  };
  postCount?: number;
  followerCount?: number;
  followingCount?: number;
}

export interface TotalUsersResponse {
  total: number;
  oldCount: number;
  currentCount: number;
  percentageUserChange: number;
  joinCounts?: Record<number, number>;
}

export interface UsersResponse {
  data: UserResponse[];
  meta: PageMeta;
  message: string;
}

export interface UsersInfoResponse {
  data: UserInfoResponse[];
  meta: PageMeta;
  message: string;
}

export interface SuggestedUsersResponse {
  data: SuggestedUserResponse[];
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
