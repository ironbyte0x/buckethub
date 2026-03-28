import * as nodemailer from 'nodemailer';
import { Email, EmailService } from './email.service';

interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from?: string;
}

export class SMTPEmailService implements EmailService {
  private transporter: nodemailer.Transporter;
  private from: string;

  constructor(config: SMTPConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass
      }
    });

    this.from = config.from || config.user;
  }

  public async send({ to, subject, text, html }: Email): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject,
      text,
      html
    });
  }
}
