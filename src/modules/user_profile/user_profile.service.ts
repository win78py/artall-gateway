import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, map, Observable, switchMap } from 'rxjs';
import {
  CheckUserProfileExistsRequest,
  CheckUserProfileExistsResponse,
  CreateUserProfileRequest,
  DeleteUserProfileResponse,
  GetAllUsersProfileRequest,
  GetUserProfileByEmailRequest,
  GetUserProfileByEmailResponse,
  GetUserProfileIdRequest,
  UpdateUserProfileRequest,
  UserDemographicsResponse,
  UserProfileResponse,
  UserProfileServiceClient,
  UsersProfileResponse,
} from '../../common/interface/userProfile.interface';
import { UseFilters } from '@nestjs/common';
import { GatewayExceptionFilter } from '../../common/exceptions/gateway.exception';
import { validate as uuidValidate } from 'uuid';
import { CreateUserProfileDto } from './dto/create-user_profile.dto';
import { UpdateUserProfileDto } from './dto/update-user_profile.dto';
import { formatISO } from 'date-fns';
import * as crypto from 'crypto';

@Injectable()
@UseFilters(GatewayExceptionFilter)
export class UserProfileService {
  private userProfileServiceClient: UserProfileServiceClient;
  private readonly logger = new Logger(UserProfileService.name);
  constructor(@Inject('USER_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userProfileServiceClient =
      this.client.getService<UserProfileServiceClient>('UserService');
  }

  getAllUsersProfile(
    params: GetAllUsersProfileRequest,
  ): Observable<UsersProfileResponse> {
    return this.userProfileServiceClient.getAllUsersProfile(params);
  }

  getUserDemographics(
    params: GetAllUsersProfileRequest,
  ): Observable<UserDemographicsResponse> {
    return this.userProfileServiceClient.getUserDemographics(params);
  }

  getUserProfileById(id: string): Observable<UserProfileResponse> {
    const request: GetUserProfileIdRequest = { id };
    return this.userProfileServiceClient.getUserProfileId(request);
  }

  getUserProfileByEmail(
    email: string,
  ): Observable<GetUserProfileByEmailResponse> {
    const request: GetUserProfileByEmailRequest = { email };
    return this.userProfileServiceClient.getUserProfileEmail(request);
  }

  createUserProfile(
    dto: CreateUserProfileDto,
  ): Observable<UserProfileResponse> {
    const request: CreateUserProfileRequest = {
      password: dto.password,
      fullName: dto.fullName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      bio: dto.bio,
      role: dto.role,
      birthDate: dto.birthDate ? formatISO(new Date(dto.birthDate)) : null,
      location: dto.location,
      website: dto.website,
      socialLinks: dto.socialLinks,
      lastLogin: dto.lastLogin ? formatISO(new Date(dto.lastLogin)) : null,
      profileVisibility: dto.profileVisibility,
      gender: dto.gender,
      isActive: dto.isActive,
      userInfoId: dto.userInfoId,
    };

    return this.userProfileServiceClient.createUserProfile(request).pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          throw new RpcException(error.message);
        }
        throw new RpcException('Internal server error');
      }),
    );
  }

  updateUserProfile(
    id: string,
    dto: UpdateUserProfileDto,
  ): Observable<UserProfileResponse> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const checkRequest: CheckUserProfileExistsRequest = { id };

    return this.userProfileServiceClient
      .checkUserProfileExists(checkRequest)
      .pipe(
        switchMap((response: CheckUserProfileExistsResponse) => {
          if (!response.exists) {
            throw new NotFoundException(`UserProfile with ID ${id} not found`);
          }

          const updateRequest: UpdateUserProfileRequest = { id };

          // if (dto.password && dto.password.trim() !== '') {
          //   updateRequest.password = dto.password;
          // }
          if (dto.password && dto.password.trim() !== '') {
            const salt = crypto.randomBytes(16).toString('hex');
            const hashedPassword = this.hashPassword(dto.password, salt);
            updateRequest.password = `${hashedPassword}.${salt}`; // Store hash and salt together
          }
          if (dto.fullName && dto.fullName.trim() !== '') {
            updateRequest.fullName = dto.fullName;
          }
          if (dto.email && dto.email.trim() !== '') {
            updateRequest.email = dto.email;
          }
          if (dto.phoneNumber && dto.phoneNumber.trim() !== '') {
            updateRequest.phoneNumber = dto.phoneNumber;
          }
          if (dto.bio && dto.bio.trim() !== '') {
            updateRequest.bio = dto.bio;
          }
          if (dto.role && dto.role.trim() !== '') {
            updateRequest.role = dto.role;
          }
          if (dto.birthDate && dto.birthDate.toString().trim() !== '') {
            updateRequest.birthDate = formatISO(new Date(dto.birthDate));
          }
          if (dto.location && dto.location.trim() !== '') {
            updateRequest.location = dto.location;
          }
          if (dto.website && dto.website.trim() !== '') {
            updateRequest.website = dto.website;
          }
          if (dto.socialLinks && dto.socialLinks.trim() !== '') {
            updateRequest.socialLinks = dto.socialLinks;
          }
          if (dto.lastLogin && dto.lastLogin.toString().trim() !== '') {
            updateRequest.lastLogin = formatISO(new Date(dto.lastLogin));
          }
          if (dto.profileVisibility && dto.profileVisibility.trim() !== '') {
            updateRequest.profileVisibility = dto.profileVisibility;
          }
          if (dto.gender && dto.gender.trim() !== '') {
            updateRequest.gender = dto.gender;
          }
          if (dto.isActive !== undefined) {
            updateRequest.isActive = dto.isActive;
          }
          if (dto.userInfoId !== undefined && dto.userInfoId.trim() !== '') {
            updateRequest.userInfoId = dto.userInfoId;
          }

          return this.userProfileServiceClient
            .updateUserProfile(updateRequest)
            .pipe(
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
  private hashPassword(password: string, salt: string): string {
    return crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');
  }

  deleteUserProfile(id: string): Observable<DeleteUserProfileResponse> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const checkRequest = { id };

    return this.userProfileServiceClient
      .checkUserProfileExists(checkRequest)
      .pipe(
        switchMap((response: CheckUserProfileExistsResponse) => {
          if (!response.exists) {
            throw new NotFoundException(`UserProfile with ID ${id} not found`);
          }

          const deleteRequest = { id };

          return this.userProfileServiceClient
            .deleteUserProfile(deleteRequest)
            .pipe(
              map(() => ({
                data: null,
                message: 'User Profile deletion successful',
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
