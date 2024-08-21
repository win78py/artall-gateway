import { Observable } from 'rxjs';

export interface UserProfileServiceClient {
  getAllUsersProfile(
    request: GetAllUsersProfileRequest,
  ): Observable<UsersProfileResponse>;
  getUserProfileId(
    request: GetUserProfileIdRequest,
  ): Observable<UserProfileResponse>;
  createUserProfile(
    request: CreateUserProfileRequest,
  ): Observable<UserProfileResponse>;
  checkUserProfileExists(
    request: CheckUserProfileExistsRequest,
  ): Observable<CheckUserProfileExistsResponse>;
  updateUserProfile(
    request: UpdateUserProfileRequest,
  ): Observable<UserProfileResponse>;
  deleteUserProfile(
    request: DeleteUserProfileRequest,
  ): Observable<DeleteUserProfileResponse>;
}

export interface GetAllUsersProfileRequest {
  page?: number;
  take?: number;
  fullName?: string;
  userInfoId?: string;
}

export interface GetUserProfileIdRequest {
  id: string;
}

export interface CreateUserProfileRequest {
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
  userInfoId: string;
}

export interface CheckUserProfileExistsRequest {
  id: string;
}

export interface CheckUserProfileExistsResponse {
  exists: boolean;
}

export interface UpdateUserProfileRequest {
  id: string;
  password?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  role?: string;
  birthDate?: string;
  location?: string;
  website?: string;
  socialLinks?: string;
  lastLogin?: string;
  profileVisibility?: string;
  gender?: string;
  isActive?: boolean;
  userInfoId?: string;
}

export interface UserProfileResponse {
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
  userInfoId: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
}

export interface UsersProfileResponse {
  data: UserProfileResponse[];
  meta: PageMeta;
  message: string;
}

export interface DeleteUserProfileRequest {
  id: string;
}

export interface DeleteUserProfileResponse {
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
