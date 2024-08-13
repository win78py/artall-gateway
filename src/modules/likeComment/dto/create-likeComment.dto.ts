import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateLikeCommentDto {
  @IsNotEmpty()
  @IsUUID()
  commentId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
