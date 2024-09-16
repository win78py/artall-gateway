import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, map, Observable, switchMap } from 'rxjs';
import {
  CheckUserInfoExistsRequest,
  CheckUserInfoExistsResponse,
  CreateUserInfoRequest,
  DeleteUserInfoResponse,
  GetAllUsersInfoRequest,
  GetUserInfoIdRequest,
  UpdateUserInfoRequest,
  UserInfoResponse,
  UserInfoServiceClient,
  UserInfoWithProfileResponse,
  UserResponse,
  UsersInfoResponse,
  UsersResponse,
} from 'src/common/interface/userInfor.interface';
import { Multer } from 'multer';
import { UseFilters } from '@nestjs/common';
import { GatewayExceptionFilter } from '../../common/exceptions/gateway.exception';
import { UpdateUserInfoDto } from './dto/update-userInfo.dto';
import { validate as uuidValidate } from 'uuid';
import { CreateUserInfoDto } from './dto/create-user_info.dto';
import { CreateUserWithProfileDto } from './dto/create-user.dto';
import { formatISO } from 'date-fns';
import {
  CreateUserProfileRequest,
  UserProfileServiceClient,
} from 'src/common/interface/userProfile.interface';

@Injectable()
@UseFilters(GatewayExceptionFilter)
export class UserInfoService {
  private userInfoServiceClient: UserInfoServiceClient;
  private userProfileServiceClient: UserProfileServiceClient;

  constructor(@Inject('USER_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userInfoServiceClient =
      this.client.getService<UserInfoServiceClient>('UserService');
    this.userProfileServiceClient =
      this.client.getService<UserProfileServiceClient>('UserService');
  }

  //USER INFO --------------------------------------------------------------

  getAllUsers(params: GetAllUsersInfoRequest): Observable<UsersResponse> {
    return this.userInfoServiceClient.getAllUsers(params);
  }

  getAllUsersInfo(
    params: GetAllUsersInfoRequest,
  ): Observable<UsersInfoResponse> {
    return this.userInfoServiceClient.getAllUsersInfo(params);
  }

  getUserInfoById(id: string): Observable<UserResponse> {
    const request: GetUserInfoIdRequest = { id };
    return this.userInfoServiceClient.getUserInfoId(request);
  }

  createUserInfo(dto: CreateUserInfoDto): Observable<UserInfoResponse> {
    if (!dto.username) {
      throw new BadRequestException('Username is required');
    }

    const request: CreateUserInfoRequest = {
      username: dto.username,
      profilePicture:
        'https://res.cloudinary.com/dnjkwuc7p/image/upload/v1712043752/avatar/default_avatar.png',
    };

    return this.userInfoServiceClient.createUserInfo(request).pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          throw new RpcException(error.message);
        }
        throw new RpcException('Internal server error');
      }),
    );
  }

  createUserWithProfile(
    dto: CreateUserWithProfileDto,
  ): Observable<UserInfoWithProfileResponse> {
    const createUserInfoRequest: CreateUserInfoRequest = {
      username: dto.username,
      profilePicture:
        'https://res.cloudinary.com/dnjkwuc7p/image/upload/v1712043752/avatar/default_avatar.png',
    };

    return this.userInfoServiceClient
      .createUserInfo(createUserInfoRequest)
      .pipe(
        switchMap((userInfoResponse) => {
          const createUserProfileRequest: CreateUserProfileRequest = {
            password: dto.password,
            fullName: dto.fullName,
            email: dto.email,
            phoneNumber: dto.phoneNumber,
            bio: dto.bio,
            role: dto.role,
            birthDate: dto.birthDate
              ? formatISO(new Date(dto.birthDate))
              : null,
            location: dto.location,
            website: dto.website,
            socialLinks: dto.socialLinks,
            lastLogin: dto.lastLogin
              ? formatISO(new Date(dto.lastLogin))
              : null,
            profileVisibility: dto.profileVisibility,
            gender: dto.gender,
            isActive: dto.isActive,
            userInfoId: userInfoResponse.id,
          };

          return this.userProfileServiceClient
            .createUserProfile(createUserProfileRequest)
            .pipe(
              map((userProfileResponse) => {
                return {
                  userInfo: userInfoResponse, // Chứa thông tin userInfo
                  userProfile: userProfileResponse, // Chứa thông tin userProfile
                } as UserInfoWithProfileResponse;
              }),
            );
        }),
        catchError((error) => {
          if (error instanceof HttpException) {
            throw new RpcException(error.message);
          }
          throw new RpcException('Internal server error');
        }),
      );
  }

  updateUserInfo(
    id: string,
    dto: UpdateUserInfoDto,
    profilePicture: Multer.File,
  ): Observable<UserInfoResponse> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const checkRequest: CheckUserInfoExistsRequest = { id };

    return this.userInfoServiceClient.checkUserInfoExists(checkRequest).pipe(
      switchMap((response: CheckUserInfoExistsResponse) => {
        if (!response.exists) {
          throw new NotFoundException(`UserInfo with ID ${id} not found`);
        }

        const updateRequest: UpdateUserInfoRequest = { id };

        if (dto.username && dto.username.trim() !== '') {
          updateRequest.username = dto.username;
        }

        if (profilePicture) {
          updateRequest.profilePicture = profilePicture.buffer;
        }

        return this.userInfoServiceClient.updateUserInfo(updateRequest).pipe(
          catchError((error) => {
            if (error instanceof HttpException) {
              throw new RpcException(error.message);
            }
            throw new RpcException('Internal server error');
          }),
        );
      }),
    );
  }

  deleteUserInfo(id: string): Observable<DeleteUserInfoResponse> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const checkRequest = { id };

    return this.userInfoServiceClient.checkUserInfoExists(checkRequest).pipe(
      switchMap((response: CheckUserInfoExistsResponse) => {
        if (!response.exists) {
          throw new NotFoundException(`UserInfo with ID ${id} not found`);
        }

        const deleteRequest = { id };

        return this.userInfoServiceClient.deleteUserInfo(deleteRequest).pipe(
          map(() => ({
            data: null,
            message: 'User Info deletion successful',
          })),
          catchError((error) => {
            if (error instanceof HttpException) {
              throw new RpcException(error.message);
            }
            throw new RpcException('Internal server error');
          }),
        );
      }),
    );
  }
}
