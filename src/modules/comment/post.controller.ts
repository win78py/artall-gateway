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
import { PostService } from './post.service';
import { Observable } from 'rxjs';
import {
  DeletePostResponse,
  GetAllPostsRequest,
  PostsResponse,
  PostResponse,
} from '../../common/interface/post.interface';
import { Multer } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAllPosts(@Query() query): Observable<PostsResponse> {
    const params: GetAllPostsRequest = {
      page: query.page || 1,
      take: query.take || 10,
      search: query.search || '',
    };
    return this.postService.getAllPosts(params);
  }

  @Get(':id')
  getPostById(@Param('id') id: string): Observable<PostResponse> {
    return this.postService.getPostById(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('mediaPath'))
  createPost(
    @Body() body: CreatePostDto,
    @UploadedFiles() mediaPath: Array<Multer.File> = [],
  ): Observable<PostResponse> {
    return this.postService.createPost(body, mediaPath);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('mediaPath'))
  updatePost(
    @Param('id') id: string,
    @Body() body: UpdatePostDto,
    @UploadedFiles() mediaPath: Array<Multer.File>,
  ): Observable<PostResponse> {
    return this.postService.updatePost(id, body, mediaPath);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string): Observable<DeletePostResponse> {
    return this.postService.deletePost(id);
  }
}
