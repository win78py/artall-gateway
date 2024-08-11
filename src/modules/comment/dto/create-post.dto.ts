import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
