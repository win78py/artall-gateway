import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { LikeCommentService } from './likeComment.service';
import { Observable } from 'rxjs';
import {
  DeleteLikeCommentResponse,
  GetAllLikesCommentRequest,
  LikeCommentResponse,
  LikesCommentResponse,
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
      search: query.search || '',
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

  @Delete(':id')
  deleteLikeComment(
    @Param('id') id: string,
  ): Observable<DeleteLikeCommentResponse> {
    return this.likeCommentService.deleteLikeComment(id);
  }
}
