import { Observable } from 'rxjs';

export interface DonationServiceClient {
  getDonations(request: GetDonationsRequest): Observable<DonationsResponse>;
  createDonation(request: CreateDonationRequest): Observable<DonationResponse>;
}

export interface GetDonationsRequest {
  page?: number;
  take?: number;
  skip?: number;
  postId?: string;
}

export interface CreateDonationRequest {
  userId: string;
  postId: string;
  amount: number;
}

export interface DonationResponse {
  return_code: number;
  return_message: string;
  sub_return_code: number;
  sub_return_message: string;
  zp_trans_token: string;
  order_url: string;
  order_token: string;
  app_trans_id: string;
}

export interface Donation1Response {
  id: string;
  postId: string;
  userId: string;
  username: string;
  amount: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
}

export interface DonationsResponse {
  data: Donation1Response[];
  meta: PageMeta;
  message: string;
}

export interface PageMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
