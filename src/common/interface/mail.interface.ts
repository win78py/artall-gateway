import { Observable } from 'rxjs';
export interface MailServiceClient {
  sendResetPasswordLink(request: SendMailRequest): Observable<SendMailResponse>;
}

export interface SendMailRequest {
  to: string;
  subject: string;
  text: string;
}

export interface SendMailResponse {
  message: string;
}
