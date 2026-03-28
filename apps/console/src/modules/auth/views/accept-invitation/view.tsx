import { useMemo } from 'react';
import { HardDrive } from 'lucide-react';
import { Flex } from '@buckethub/styled-system/jsx';
import { Button, Text } from '@buckethub/ui';
import { useNavigate } from '@tanstack/react-router';
import LogoIcon from '@/assets/logo.svg?react';
import { useAcceptInvitation, useGetInvitationByToken } from '@/services/invitations';
import { useAppForm } from '@/shared/form';
import { ErrorAlert } from '@/shared/form/error-alert';
import { Layout } from '../../layout';
import { acceptInvitationSchema } from './schema';

export const AcceptInvitationView: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const token = useMemo(
    () => new URLSearchParams(window.location.hash.substring(1)).get('token'),
    []
  );

  const { data: invitation, isLoading } = useGetInvitationByToken(token || '');
  const { mutateAsync: acceptInvitation, error } = useAcceptInvitation();

  const form = useAppForm({
    defaultValues: {
      name: '',
      password: '',
      confirmPassword: ''
    },
    validators: {
      onSubmit: acceptInvitationSchema
    },
    onSubmit: async ({ value }) => {
      await acceptInvitation(
        {
          token: token || '',
          name: value.name,
          password: value.password
        },
        {
          onSuccess: () => {
            navigate({ to: '/sign-in' });
          }
        }
      );
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <Text>Loading...</Text>
      </Layout>
    );
  }

  if (!invitation) {
    return (
      <Layout>
        <Layout.Header>
          <Layout.Icon>
            <LogoIcon style={{ width: '28px', height: '28px' }} />
          </Layout.Icon>

          <Text variant="title-large" css={{ fontWeight: '600' }}>
            Invalid Invitation
          </Text>

          <Text variant="body-large" color="muted" css={{ marginTop: '1' }}>
            This invitation link is invalid or has expired.
          </Text>
        </Layout.Header>

        <Button
          variant="primary"
          size="lg"
          css={{ width: '100%', justifyContent: 'center' }}
          onClick={() => navigate({ to: '/sign-in' })}
        >
          Go to Sign In
        </Button>
      </Layout>
    );
  }

  return (
    <Layout>
      <Layout.Header>
        <Layout.Icon>
          <HardDrive size={28} />
        </Layout.Icon>

        <Text variant="title-large" css={{ fontWeight: '600' }}>
          Accept Invitation
        </Text>

        <Text variant="body-large" color="muted" css={{ marginTop: '1' }}>
          Create your account for {invitation.email}
        </Text>
      </Layout.Header>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <Flex css={{ flexDirection: 'column', gap: '4' }}>
          <ErrorAlert
            show={!!error}
            title="Failed to create account"
            description={error?.message || 'An error occurred'}
          />

          <form.AppField name="name">
            {(field) => (
              <field.TextInput
                label="Name"
                placeholder="Enter your name"
                variant="secondary"
                size="lg"
              />
            )}
          </form.AppField>

          <form.AppField name="password">
            {(field) => (
              <field.PasswordInput
                label="Password"
                placeholder="Enter password"
                variant="secondary"
                size="lg"
              />
            )}
          </form.AppField>

          <form.AppField name="confirmPassword">
            {(field) => (
              <field.PasswordInput
                label="Confirm Password"
                placeholder="Confirm password"
                variant="secondary"
                size="lg"
              />
            )}
          </form.AppField>

          <form.Subscribe selector={(formState) => formState.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
                Create Account
              </Button>
            )}
          </form.Subscribe>
        </Flex>
      </form>
    </Layout>
  );
};
