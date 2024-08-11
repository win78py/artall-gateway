import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { Observable } from 'rxjs';
import {
  DeleteLikeResponse,
  GetAllLikeRequest,
  LikeResponse,
  ManyLikeResponse,
} from '../../common/interface/like.interface';
import { CreateLikeDto } from './dto/create-like.dto';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Get()
  getAllLike(@Query() query): Observable<ManyLikeResponse> {
    const params: GetAllLikeRequest = {
      page: query.page || 1,
      take: query.take || 10,
      search: query.search || '',
    };
    return this.likeService.getAllLike(params);
  }

  @Get(':id')
  getLikeById(@Param('id') id: string): Observable<LikeResponse> {
    return this.likeService.getLikeById(id);
  }

  @Post()
  createLike(@Body() body: CreateLikeDto): Observable<LikeResponse> {
    return this.likeService.createLike(body);
  }

  @Delete(':id')
  deleteLike(@Param('id') id: string): Observable<DeleteLikeResponse> {
    return this.likeService.deleteLike(id);
  }
}
