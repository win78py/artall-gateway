export interface SendMailRequest {
  to: string;
  subject: string;
  template: string;
}

export interface SendMailResponse {
  message: string;
}
