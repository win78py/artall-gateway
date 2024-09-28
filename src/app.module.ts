import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserInfoModule } from './modules/user_info/user_info.module';
import { FollowModule } from './modules/follow/follow.module';
import { BlockModule } from './modules/block/block.module';
import { PostModule } from './modules/post/post.module';
import { ClientsModule } from '@nestjs/microservices';
import {
  grpcMailClientOptions,
  grpcPostClientOptions,
  grpcUserClientOptions,
} from './grpc/grpc-client.options';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserProfileModule } from './modules/user_profile/user_profile.module';
import { LikeModule } from './modules/like/like.module';
import { CommentModule } from './modules/comment/comment.module';
import { LikeCommentModule } from './modules/likeComment/likeComment.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserInfoModule,
    UserProfileModule,
    FollowModule,
    BlockModule,
    PostModule,
    LikeModule,
    CommentModule,
    LikeCommentModule,
    AuthModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        ...grpcUserClientOptions,
      },
      {
        name: 'POST_SERVICE',
        ...grpcPostClientOptions,
      },
      {
        name: 'MAIL_SERVICE',
        ...grpcMailClientOptions,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
