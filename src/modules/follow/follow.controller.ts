import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { Observable } from 'rxjs';
import {
  DeleteFollowResponse,
  GetAllFollowRequest,
  FollowResponse,
  ManyFollowResponse,
} from '../../common/interface/follow.interface';
import { CreateFollowDto } from './dto/create-follow.dto';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get()
  getAllFollow(@Query() query): Observable<ManyFollowResponse> {
    const params: GetAllFollowRequest = {
      page: query.page || 1,
      take: query.take || 10,
      follower: query.follower || '',
      following: query.following || '',
    };
    return this.followService.getAllFollow(params);
  }

  @Get(':id')
  getFollowById(@Param('id') id: string): Observable<FollowResponse> {
    return this.followService.getFollowById(id);
  }

  @Post()
  createFollow(@Body() body: CreateFollowDto): Observable<FollowResponse> {
    return this.followService.createFollow(body);
  }

  @Delete(':id')
  deleteFollow(@Param('id') id: string): Observable<DeleteFollowResponse> {
    return this.followService.deleteFollow(id);
  }
}
