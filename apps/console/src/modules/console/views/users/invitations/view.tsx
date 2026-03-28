import { useState } from 'react';
import { MailPlus, Trash2 } from 'lucide-react';
import { Box, Flex, styled } from '@buckethub/styled-system/jsx';
import { Button, Icon, Text, TextInput } from '@buckethub/ui';
import { useListInvitations, useRevokeInvitation, useSendInvitation } from '@/services/invitations';
import { ErrorAlert } from '@/shared/form/error-alert';

const StyledInvitationList = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2',
    marginTop: '4'
  }
});

const StyledInvitationItem = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '3',
    backgroundColor: 'background-surface',
    borderRadius: 'md',
    border: '1px solid',
    borderColor: 'border-input'
  }
});

export const InvitationsView: React.FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const { data: invitations } = useListInvitations();
  const { mutate: sendInvitation, isPending: isSending, error } = useSendInvitation();
  const { mutate: revokeInvitation } = useRevokeInvitation();

  const onSendInvitation = () => {
    if (!email) {
      return;
    }

    sendInvitation(
      { email },
      {
        onSuccess: () => setEmail('')
      }
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt: Date) => new Date(expiresAt) < new Date();

  return (
    <Box>
      <Text variant="title-medium" css={{ display: 'block', marginBottom: '2' }}>
        Invite Users
      </Text>

      <Text variant="body-medium" color="muted" css={{ display: 'block', marginBottom: '4' }}>
        Send invitations to new users. Invitations expire after 24 hours.
      </Text>

      <Flex css={{ gap: '2', marginBottom: '4' }}>
        <TextInput
          placeholder="Enter email address"
          value={email}
          size="lg"
          css={{ flex: 1 }}
          onChange={(event) => setEmail(event.target.value)}
        />

        <Button variant="primary" loading={isSending} disabled={!email} onClick={onSendInvitation}>
          <Icon as={MailPlus} size="sm" />
          Send Invitation
        </Button>
      </Flex>

      <ErrorAlert
        show={!!error}
        title="Failed to send invitation"
        description={error?.message || 'An error occurred'}
        css={{ marginBottom: '4' }}
      />

      <Text variant="title-medium" css={{ display: 'block', marginTop: '6' }}>
        Pending Invitations
      </Text>

      <StyledInvitationList data-testid="invitation-list">
        {invitations.length === 0 ? (
          <Text variant="body-medium" color="muted">
            No pending invitations
          </Text>
        ) : (
          invitations.map((invitation) => (
            <StyledInvitationItem
              key={invitation.id}
              data-testid={`invitation-item-${invitation.email}`}
            >
              <Flex css={{ flexDirection: 'column', gap: '1' }}>
                <Text variant="body-medium" data-testid={`invitation-email-${invitation.email}`}>
                  {invitation.email}
                </Text>

                <Text variant="body-small-emphasized" color="muted">
                  Sent {formatDate(invitation.createdAt)}
                  {isExpired(invitation.expiresAt)
                    ? ' (Expired)'
                    : ` - Expires ${formatDate(invitation.expiresAt)}`}
                </Text>
              </Flex>

              <Button
                variant="secondary"
                size="sm"
                data-testid={`revoke-invitation-${invitation.email}`}
                onClick={() => revokeInvitation({ id: invitation.id })}
              >
                <Icon as={Trash2} size="sm" />
                Revoke
              </Button>
            </StyledInvitationItem>
          ))
        )}
      </StyledInvitationList>
    </Box>
  );
};
