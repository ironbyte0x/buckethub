import { Button, Link, Section, Text } from '@react-email/components';
import { EmailLayout } from './email-layout';
import { bodyText, button, buttonContainer, footer, heading, link } from './shared-styles';

interface VerifyEmailProps {
  verificationUrl: string;
  userEmail: string;
}

export const VerifyEmail = ({ verificationUrl, userEmail }: VerifyEmailProps) => {
  return (
    <EmailLayout preview="Verify your new email address">
      <Text style={heading}>Verify your email address</Text>
      <Text style={bodyText}>
        You requested to change your BucketHub email address to {userEmail}. Click the button below
        to verify this email address:
      </Text>
      <Section style={buttonContainer}>
        <Button style={button} href={verificationUrl}>
          Verify Email
        </Button>
      </Section>
      <Text style={bodyText}>Or copy and paste this URL into your browser:</Text>
      <Link href={verificationUrl} style={link}>
        {verificationUrl}
      </Link>
      <Text style={footer}>This link will expire in 1 hour.</Text>
      <Text style={footer}>If you didn&apos;t request this, you can safely ignore this email.</Text>
    </EmailLayout>
  );
};

// eslint-disable-next-line import/no-default-export
export default VerifyEmail;
