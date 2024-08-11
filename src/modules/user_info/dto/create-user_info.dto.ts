import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserInfoDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
