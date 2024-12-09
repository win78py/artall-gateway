import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, Observable } from 'rxjs';
import {
  DonationServiceClient,
  CreateDonationRequest,
  GetDonationsRequest,
  DonationResponse,
  DonationsResponse,
} from '../../common/interface/donation.interface';
import { UseFilters } from '@nestjs/common';
import { GatewayExceptionFilter } from '../../common/exceptions/gateway.exception';

import { JwtStrategy } from 'modules/auth/utils/jwt.stratery';

@Injectable()
@UseFilters(GatewayExceptionFilter)
export class DonateService {
  private readonly logger = new Logger(DonateService.name);
  private donationServiceClient: DonationServiceClient;

  constructor(@Inject('POST_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.donationServiceClient =
      this.client.getService<DonationServiceClient>('PostService');
  }

  getDonations(
    params: GetDonationsRequest,
    request,
  ): Observable<DonationsResponse> {
    const token = request.headers.authorization.split(' ')[1];

    const userId = JwtStrategy.getUserIdFromToken(token);

    if (!userId) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return this.donationServiceClient.getDonations(params);
  }

  createPayment(body): Observable<DonationResponse> {
    if (!body.userId) {
      throw new BadRequestException('UserId is required');
    }

    const request: CreateDonationRequest = {
      userId: body.userId,
      postId: body.postId,
      amount: body.amount,
    };
    console.log('request', request);

    return this.donationServiceClient.createDonation(request).pipe(
      catchError((error) => {
        this.logger.error(`Error in createPost: ${error.message}`, error.stack);
        if (error instanceof HttpException) {
          throw new RpcException(error.message);
        }
        throw new RpcException('Internal server error');
      }),
    );
  }
}
