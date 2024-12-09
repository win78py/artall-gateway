import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import { DonateService } from './donate.service';
import { Observable } from 'rxjs';
import {
  DonationsResponse,
  DonationResponse,
  GetDonationsRequest,
} from '../../common/interface/donation.interface';
import { AuthGuard } from '../auth/utils/auth.guard';
import { RoleEnum } from 'common/enum/enum';
import { RolesGuard } from '../auth/utils/role.middleware';
import { PageOptionsDto } from 'common/dtos/pageOption';

@Controller('donation')
export class DonateController {
  constructor(private readonly donateService: DonateService) {}

  @Get()
  @UseGuards(AuthGuard, new RolesGuard([RoleEnum.USER, RoleEnum.ADMIN]))
  getDonations(
    @Query() query: PageOptionsDto,
    @Req() request: any,
  ): Observable<DonationsResponse> {
    const params: GetDonationsRequest = {
      page: query.page || 1,
      take: query.take || 10,
      skip: query.skip || 0,
      postId: query.postId || '',
    };

    return this.donateService.getDonations(params, request);
  }

  @Post('/payment')
  createPayment(@Body() body: any): Observable<DonationResponse> {
    return this.donateService.createPayment(body);
  }
}
