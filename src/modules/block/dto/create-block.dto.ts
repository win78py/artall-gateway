import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBlockDto {
  @IsNotEmpty()
  @IsUUID()
  blockerId: string;

  @IsNotEmpty()
  @IsUUID()
  blockedId: string;
}
