import { Button, Link, Section, Text } from '@react-email/components';
import { EmailLayout } from './email-layout';
import { bodyText, button, buttonContainer, footer, heading, link } from './shared-styles';

interface ResetPasswordEmailProps {
  resetUrl: string;
  userEmail: string;
}

export const ResetPasswordEmail = ({ resetUrl, userEmail }: ResetPasswordEmailProps) => {
  return (
    <EmailLayout preview="Reset your BucketHub password">
      <Text style={heading}>Reset your password</Text>
      <Text style={bodyText}>
        You requested to reset your password for your BucketHub account ({userEmail}). Click the
        button below to set a new password:
      </Text>
      <Section style={buttonContainer}>
        <Button style={button} href={resetUrl}>
          Reset Password
        </Button>
      </Section>
      <Text style={bodyText}>Or copy and paste this URL into your browser:</Text>
      <Link href={resetUrl} style={link}>
        {resetUrl}
      </Link>
      <Text style={footer}>This link will expire in 1 hour.</Text>
      <Text style={footer}>If you didn&apos;t request this, you can safely ignore this email.</Text>
    </EmailLayout>
  );
};

// eslint-disable-next-line import/no-default-export
export default ResetPasswordEmail;
