import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { UserInfoService } from './user_info.service';
import { Observable } from 'rxjs';
import {
  DeleteUserInfoResponse,
  GetAllUsersInfoRequest,
  GetTotalUsersInfoRequest,
  SuggestedUsersResponse,
  TotalUsersResponse,
  UserInfoResponse,
  UserInfoWithProfileResponse,
  UserResponse,
  UsersInfoResponse,
  UsersResponse,
} from '../../common/interface/userInfor.interface';
import { Multer } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserInfoDto } from './dto/update-userInfo.dto';
import { CreateUserInfoDto } from './dto/create-user_info.dto';
import { CreateUserWithProfileDto } from './dto/create-user.dto';
import { PageOptionsDto } from 'common/dtos/pageOption';

@Controller('user-info')
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) {}

  @Get('user')
  getAllUsers(@Query() query: PageOptionsDto): Observable<UsersResponse> {
    const params: GetAllUsersInfoRequest = {
      page: query.page || 1,
      take: query.take || 10,
      skip: query.skip || 0,
      username: query.username || '',
    };
    return this.userInfoService.getAllUsers(params);
  }

  @Get('user/deleted')
  getAllUsersDeleted(
    @Query() query: PageOptionsDto,
  ): Observable<UsersResponse> {
    const params: GetAllUsersInfoRequest = {
      page: query.page || 1,
      take: query.take || 10,
      skip: query.skip || 0,
      username: query.username || '',
    };
    return this.userInfoService.getAllUsersDeleted(params);
  }

  @Get('suggested')
  getSuggestedUsers(@Query() query): Observable<SuggestedUsersResponse> {
    const params: GetAllUsersInfoRequest = {
      page: query.page || 1,
      take: query.take || 5,
      skip: query.skip || 0,
    };
    return this.userInfoService.getSuggestedUsers(params);
  }

  @Get('total')
  getTotalUsersInfo(
    @Query() query: PageOptionsDto,
  ): Observable<TotalUsersResponse> {
    const params: GetTotalUsersInfoRequest = {
      period: query.period || '',
    };
    return this.userInfoService.getTotalUsersInfo(params);
  }

  @Get('user/:id')
  getUserById(@Param('id') id: string): Observable<UserResponse> {
    return this.userInfoService.getUserById(id);
  }

  @Get()
  getAllUsersInfo(@Query() query): Observable<UsersInfoResponse> {
    const params: GetAllUsersInfoRequest = {
      page: query.page || 1,
      take: query.take || 10,
      skip: query.skip || 0,
      username: query.username || '',
      fullName: query.fullName || '',
    };
    return this.userInfoService.getAllUsersInfo(params);
  }

  @Get(':id')
  getUserInfoById(@Param('id') id: string): Observable<UserResponse> {
    return this.userInfoService.getUserInfoById(id);
  }

  @Post()
  createUserInfo(
    @Body() body: CreateUserInfoDto,
  ): Observable<UserInfoResponse> {
    return this.userInfoService.createUserInfo(body);
  }

  @Post('register')
  createUserWithProfile(
    @Body() body: CreateUserWithProfileDto,
  ): Observable<UserInfoWithProfileResponse> {
    return this.userInfoService.createUserWithProfile(body);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('profilePicture'))
  updateUserInfo(
    @Param('id') id: string,
    @Body() body: UpdateUserInfoDto,
    @UploadedFile() profilePicture: Multer.File,
  ): Observable<UserInfoResponse> {
    return this.userInfoService.updateUserInfo(id, body, profilePicture);
  }

  @Delete(':id')
  deleteUserInfo(@Param('id') id: string): Observable<DeleteUserInfoResponse> {
    return this.userInfoService.deleteUserInfo(id);
  }
}
