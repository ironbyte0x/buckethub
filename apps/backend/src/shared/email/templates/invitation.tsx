import { Button, Link, Section, Text } from '@react-email/components';
import { EmailLayout } from './email-layout';
import { bodyText, button, buttonContainer, footer, heading, link } from './shared-styles';

interface InvitationEmailProps {
  inviteUrl: string;
  invitedByName: string;
}

export const InvitationEmail = ({ inviteUrl, invitedByName }: InvitationEmailProps) => {
  return (
    <EmailLayout preview="You've been invited to join BucketHub">
      <Text style={heading}>You're invited!</Text>
      <Text style={bodyText}>
        {invitedByName} has invited you to join BucketHub. Click the button below to create your
        account:
      </Text>
      <Section style={buttonContainer}>
        <Button style={button} href={inviteUrl}>
          Accept Invitation
        </Button>
      </Section>
      <Text style={bodyText}>Or copy and paste this URL into your browser:</Text>
      <Link href={inviteUrl} style={link}>
        {inviteUrl}
      </Link>
      <Text style={footer}>This invitation will expire in 24 hours.</Text>
      <Text style={footer}>
        If you weren&apos;t expecting this invitation, you can safely ignore this email.
      </Text>
    </EmailLayout>
  );
};

// eslint-disable-next-line import/no-default-export
export default InvitationEmail;
