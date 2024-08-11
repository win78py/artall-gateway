import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { grpcUserClientOptions } from '../../grpc/grpc-client.options';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        ...grpcUserClientOptions,
      },
    ]),
  ],
  controllers: [BlockController],
  providers: [BlockService],
})
export class BlockModule {}
