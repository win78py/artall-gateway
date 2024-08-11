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
  UsersInfoResponse,
} from '../../common/interface/useInfor.interface';
import { Multer } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserInfoDto } from './dto/update-userInfo.dto';
import { CreateUserInfoDto } from './dto/create-user_info.dto';

@Controller('user-info')
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) {}

  @Get()
  getAllUsersInfo(@Query() query): Observable<UsersInfoResponse> {
    const params: GetAllUsersInfoRequest = {
      page: query.page || 1,
      take: query.take || 10,
      search: query.search || '',
    };
    return this.userInfoService.getAllUsersInfo(params);
  }

  @Get(':id')
  getUserInfoById(@Param('id') id: string): Observable<UserInfoResponse> {
    return this.userInfoService.getUserInfoById(id);
  }

  @Post()
  createUserInfo(
    @Body() body: CreateUserInfoDto,
  ): Observable<UserInfoResponse> {
    return this.userInfoService.createUserInfo(body);
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
