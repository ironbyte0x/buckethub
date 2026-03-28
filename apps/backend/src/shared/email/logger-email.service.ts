import { Email, EmailService } from './email.service';

export class LoggerEmailService implements EmailService {
  public async send({ to, subject, text, html }: Email): Promise<void> {
    console.log('========================================');
    console.log('EMAIL');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${text}`);

    if (html) {
      console.log(`HTML:\n${html.substring(0, 200)}...`);
    }

    console.log('========================================');
  }
}
