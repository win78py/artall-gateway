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

@Controller('user-info')
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) {}

  @Get('user')
  getAllUsers(@Query() query): Observable<UsersResponse> {
    const params: GetAllUsersInfoRequest = {
      page: query.page || 1,
      take: query.take || 10,
      username: query.username || '',
    };
    return this.userInfoService.getAllUsers(params);
  }

  @Get()
  getAllUsersInfo(@Query() query): Observable<UsersInfoResponse> {
    const params: GetAllUsersInfoRequest = {
      page: query.page || 1,
      take: query.take || 10,
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

  @Post('create-with-profile')
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
