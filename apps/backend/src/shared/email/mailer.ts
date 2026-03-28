import { render } from '@react-email/render';
import { EmailService } from './email.service';
import { InvitationEmail, ResetPasswordEmail, VerifyEmail } from './templates';

export class Mailer {
  constructor(private emailService: EmailService) {}

  public async sendResetPasswordEmail(parameters: { to: string; resetUrl: string }): Promise<void> {
    const html = await render(
      ResetPasswordEmail({
        resetUrl: parameters.resetUrl,
        userEmail: parameters.to
      })
    );

    const text = `Hello,

You requested to reset your password for your BucketHub account (${parameters.to}).
Click the link below to set a new password:

${parameters.resetUrl}

This link will expire in 1 hour.

If you didn't request this, you can safely ignore this email.

Best,
BucketHub`;

    await this.emailService.send({
      to: parameters.to,
      subject: 'Reset your BucketHub password',
      text,
      html
    });
  }

  public async sendInvitationEmail(parameters: {
    to: string;
    inviteUrl: string;
    invitedByName: string;
  }): Promise<void> {
    const html = await render(
      InvitationEmail({
        inviteUrl: parameters.inviteUrl,
        invitedByName: parameters.invitedByName
      })
    );

    const text = `Hello,

${parameters.invitedByName} has invited you to join BucketHub.
Click the link below to create your account:

${parameters.inviteUrl}

This invitation will expire in 24 hours.

If you weren't expecting this invitation, you can safely ignore this email.

Best,
BucketHub`;

    await this.emailService.send({
      to: parameters.to,
      subject: "You've been invited to join BucketHub",
      text,
      html
    });
  }

  public async sendEmailVerificationEmail(parameters: {
    to: string;
    verificationUrl: string;
  }): Promise<void> {
    const html = await render(
      VerifyEmail({
        verificationUrl: parameters.verificationUrl,
        userEmail: parameters.to
      })
    );

    const text = `Hello,

You requested to change your BucketHub email address to ${parameters.to}.
Click the link below to verify this email address:

${parameters.verificationUrl}

This link will expire in 1 hour.

If you didn't request this, you can safely ignore this email.

Best,
BucketHub`;

    await this.emailService.send({
      to: parameters.to,
      subject: 'Verify your new email address',
      text,
      html
    });
  }
}
