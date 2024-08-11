import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  UseInterceptors,
  Delete,
  UploadedFiles,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Observable } from 'rxjs';
import {
  DeleteCommentResponse,
  GetAllCommentsRequest,
  CommentsResponse,
  CommentResponse,
} from '../../common/interface/comment.interface';
import { Multer } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  getAllComments(@Query() query): Observable<CommentsResponse> {
    const params: GetAllCommentsRequest = {
      page: query.page || 1,
      take: query.take || 10,
      search: query.search || '',
    };
    return this.commentService.getAllComments(params);
  }

  @Get(':id')
  getCommentById(@Param('id') id: string): Observable<CommentResponse> {
    return this.commentService.getCommentById(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('mediaPath'))
  createComment(
    @Body() body: CreateCommentDto,
    @UploadedFiles() mediaPath: Array<Multer.File> = [],
  ): Observable<CommentResponse> {
    return this.commentService.createComment(body, mediaPath);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('mediaPath'))
  updateComment(
    @Param('id') id: string,
    @Body() body: UpdateCommentDto,
    @UploadedFiles() mediaPath: Array<Multer.File>,
  ): Observable<CommentResponse> {
    return this.commentService.updateComment(id, body, mediaPath);
  }

  @Delete(':id')
  deleteComment(@Param('id') id: string): Observable<DeleteCommentResponse> {
    return this.commentService.deleteComment(id);
  }
}
