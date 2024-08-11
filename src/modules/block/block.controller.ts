import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  DeleteBlockResponse,
  GetAllBlockListRequest,
  BlockResponse,
  ManyBlockResponse,
} from '../../common/interface/block.interface';
import { CreateBlockDto } from './dto/create-block.dto';
import { BlockService } from './block.service';

@Controller('block-list')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Get()
  getAllBlockList(@Query() query): Observable<ManyBlockResponse> {
    const params: GetAllBlockListRequest = {
      page: query.page || 1,
      take: query.take || 10,
      search: query.search || '',
    };
    return this.blockService.getAllBlockList(params);
  }

  @Get(':id')
  getBlockById(@Param('id') id: string): Observable<BlockResponse> {
    return this.blockService.getBlockById(id);
  }

  @Post()
  createBlock(@Body() body: CreateBlockDto): Observable<BlockResponse> {
    return this.blockService.createBlock(body);
  }

  @Delete(':id')
  deleteBlock(@Param('id') id: string): Observable<DeleteBlockResponse> {
    return this.blockService.deleteBlock(id);
  }
}
