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
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Observable } from 'rxjs';
import {
  DeletePostResponse,
  GetAllPostsRequest,
  PostsResponse,
  PostResponse,
  GetPostIdRequest,
  TotalPostsResponse,
  GetTotalPostsRequest,
} from '../../common/interface/post.interface';
import { Multer } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PageOptionsDto } from 'common/dtos/pageOption';
import { AuthGuard } from '../auth/utils/auth.guard';
import { RoleEnum } from 'common/enum/enum';
import { RolesGuard } from '../auth/utils/role.middleware';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @UseGuards(AuthGuard, new RolesGuard([RoleEnum.USER, RoleEnum.ADMIN]))
  getAllPosts(
    @Query() query: PageOptionsDto,
    @Req() request: any,
  ): Observable<PostsResponse> {
    const userId = request.user?.sub;
    const params: GetAllPostsRequest = {
      page: query.page || 1,
      take: query.take || 10,
      skip: query.skip || 0,
      content: query.content || '',
      userId: userId,
    };

    return this.postService.getAllPosts(params, request);
  }

  @Get('random-posts')
  getRandomPosts(@Query() query: PageOptionsDto): Observable<PostsResponse> {
    const params: GetAllPostsRequest = {
      page: query.page || 1,
      take: query.take || 10,
      skip: query.skip || 0,
      content: query.content || '',
    };
    return this.postService.getRandomPosts(params);
  }

  @Get('deleted')
  @UseGuards(AuthGuard, new RolesGuard([RoleEnum.USER, RoleEnum.ADMIN]))
  getPostsDeleted(
    @Query() query: PageOptionsDto,
    @Req() request: any,
  ): Observable<PostsResponse> {
    const userId = request.user?.sub;
    const params: GetAllPostsRequest = {
      page: query.page || 1,
      take: query.take || 10,
      skip: query.skip || 0,
      content: query.content || '',
      userId: userId,
    };
    return this.postService.getPostsDeleted(params, request);
  }

  @Get('total')
  getTotalUsersInfo(
    @Query() query: PageOptionsDto,
  ): Observable<TotalPostsResponse> {
    const params: GetTotalPostsRequest = {
      period: query.period || 'year',
    };
    console.log('params: ', params);
    return this.postService.getTotalPosts(params);
  }

  @Get(':id')
  @UseGuards(AuthGuard, new RolesGuard([RoleEnum.USER, RoleEnum.ADMIN]))
  getPostById(
    @Param('id') id: string,
    @Req() request: any,
  ): Observable<PostResponse> {
    const userId = request.user?.sub;
    const param: GetPostIdRequest = { id, userId };
    return this.postService.getPostById(param);
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
