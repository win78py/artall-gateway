import { join } from 'path';
import { ClientOptions, Transport } from '@nestjs/microservices';

export const grpcUserClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'users',
    protoPath: join(__dirname, '../grpc/users.proto'),
    loader: {
      includeDirs: [join(__dirname, '../grpc/users.proto')],
      keepCase: true,
      defaults: true,
    },
    url: 'localhost:50051',
    maxReceiveMessageLength: 20 * 1024 * 1024,
    maxSendMessageLength: 20 * 1024 * 1024,
  },
};

export const grpcPostClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'posts',
    protoPath: join(__dirname, '../grpc/posts.proto'),
    loader: {
      includeDirs: [join(__dirname, '../grpc/posts.proto')],
      keepCase: true,
      defaults: true,
    },
    url: 'localhost:50052',
    maxReceiveMessageLength: 20 * 1024 * 1024,
    maxSendMessageLength: 20 * 1024 * 1024,
  },
};

export const grpcMailClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'mail',
    protoPath: join(__dirname, '../grpc/mail.proto'),
    loader: {
      includeDirs: [join(__dirname, '../grpc/mail.proto')],
      keepCase: true,
      defaults: true,
    },
    url: 'localhost:50053',
    maxReceiveMessageLength: 20 * 1024 * 1024,
    maxSendMessageLength: 20 * 1024 * 1024,
  },
};
