export interface Email {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface EmailService {
  send(email: Email): Promise<void>;
}
