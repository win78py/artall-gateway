import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { LikeCommentService } from './likeComment.service';
import { Observable } from 'rxjs';
import {
  GetAllLikesCommentRequest,
  LikeCommentResponse,
  LikesCommentResponse,
  ToggleLikeCommentResponse,
} from '../../common/interface/likeComment.interface';
import { CreateLikeCommentDto } from './dto/create-likeComment.dto';

@Controller('like-comment')
export class LikeCommentController {
  constructor(private readonly likeCommentService: LikeCommentService) {}

  @Get()
  getAllLikesComment(@Query() query): Observable<LikesCommentResponse> {
    const params: GetAllLikesCommentRequest = {
      page: query.page || 1,
      take: query.take || 10,
      skip: query.skip || 0,
      comment: query.comment || '',
    };
    return this.likeCommentService.getAllLikesComment(params);
  }

  @Get(':id')
  getLikeCommentById(@Param('id') id: string): Observable<LikeCommentResponse> {
    return this.likeCommentService.getLikeCommentById(id);
  }

  @Post()
  createLikeComment(
    @Body() body: CreateLikeCommentDto,
  ): Observable<LikeCommentResponse> {
    return this.likeCommentService.createLikeComment(body);
  }

  @Post('toggle')
  toggleLikeComment(
    @Body() body: CreateLikeCommentDto,
  ): Observable<ToggleLikeCommentResponse> {
    return this.likeCommentService.toggleLikeComment(body);
  }
}
