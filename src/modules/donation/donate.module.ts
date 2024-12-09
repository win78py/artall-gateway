import { Module } from '@nestjs/common';
import { DonateController } from './donate.controller';
import { DonateService } from './donate.service';
import { grpcPostClientOptions } from 'grpc/grpc-client.options';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'POST_SERVICE',
        ...grpcPostClientOptions,
      },
    ]),
  ],
  controllers: [DonateController],
  providers: [DonateService],
})
export class DonationModule {}
