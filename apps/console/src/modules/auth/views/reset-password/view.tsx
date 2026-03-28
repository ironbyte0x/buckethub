import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Flex } from '@buckethub/styled-system/jsx';
import { Alert, Button, Icon, Text } from '@buckethub/ui';
import { Link, useSearch } from '@tanstack/react-router';
import LogoIcon from '@/assets/logo.svg?react';
import { useResetPassword } from '@/services/auth';
import { useAppForm } from '@/shared/form';
import { ErrorAlert } from '@/shared/form/error-alert';
import { Layout } from '../../layout';
import { resetPasswordSchema } from './schema';

export const ResetPasswordView: React.FunctionComponent = () => {
  const { token, error: urlError } = useSearch({
    from: '/auth/reset-password'
  });

  const [resetSuccess, setResetSuccess] = useState(false);
  const { mutateAsync: resetPassword, error } = useResetPassword();

  const form = useAppForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    },
    validators: {
      onSubmit: resetPasswordSchema
    },
    onSubmit: async ({ value }) => {
      if (!token) {
        return;
      }

      await resetPassword(
        { token, newPassword: value.newPassword },
        {
          onSuccess: () => {
            setResetSuccess(true);
          }
        }
      );
    }
  });

  const hasInvalidToken = urlError === 'INVALID_TOKEN' || !token;

  return (
    <Layout>
      <Layout.Header>
        <Layout.Icon>
          <LogoIcon style={{ width: '28px', height: '28px' }} />
        </Layout.Icon>

        <Text variant="title-large" css={{ fontWeight: '600' }}>
          {resetSuccess ? 'Password reset' : hasInvalidToken ? 'Invalid link' : 'Set new password'}
        </Text>

        <Text variant="body-large" color="muted" css={{ marginTop: '1' }}>
          {resetSuccess
            ? 'Your password has been successfully reset.'
            : hasInvalidToken
              ? 'This password reset link is invalid or has expired.'
              : 'Enter your new password below.'}
        </Text>
      </Layout.Header>

      {resetSuccess ? (
        <Flex css={{ flexDirection: 'column', gap: '4' }}>
          <Alert variant="success">
            <Alert.Icon>
              <Icon as={CheckCircle} size="md" />
            </Alert.Icon>

            <Alert.Content>
              <Alert.Title>Success</Alert.Title>
              <Alert.Description>You can now sign in with your new password.</Alert.Description>
            </Alert.Content>
          </Alert>

          <Button as={Link} to="/sign-in" variant="primary" size="lg">
            Sign in
          </Button>
        </Flex>
      ) : hasInvalidToken ? (
        <Flex css={{ flexDirection: 'column', gap: '4' }}>
          <Alert variant="error">
            <Alert.Icon>
              <Icon as={AlertCircle} size="md" />
            </Alert.Icon>

            <Alert.Content>
              <Alert.Title>Link expired</Alert.Title>

              <Alert.Description>Please request a new password reset link.</Alert.Description>
            </Alert.Content>
          </Alert>

          <Button as={Link} to="/forgot-password" variant="primary" size="lg">
            Request new link
          </Button>
        </Flex>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <Flex css={{ flexDirection: 'column', gap: '4' }}>
            <ErrorAlert
              show={!!error}
              title="Reset failed"
              description={error?.message || 'Something went wrong'}
            />

            <form.AppField name="newPassword">
              {(field) => (
                <field.PasswordInput
                  label="New password"
                  placeholder="••••••••"
                  variant="secondary"
                  size="lg"
                />
              )}
            </form.AppField>

            <form.AppField name="confirmPassword">
              {(field) => (
                <field.PasswordInput
                  label="Confirm password"
                  placeholder="••••••••"
                  variant="secondary"
                  size="lg"
                />
              )}
            </form.AppField>

            <form.Subscribe selector={(formState) => formState.isSubmitting}>
              {(isSubmitting) => (
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  css={{ width: '100%', justifyContent: 'center' }}
                >
                  {isSubmitting ? 'Resetting...' : 'Reset password'}
                </Button>
              )}
            </form.Subscribe>

            <Text as={Link} to="/sign-in" variant="body-medium" css={{ textAlign: 'center' }}>
              Back to sign in
            </Text>
          </Flex>
        </form>
      )}
    </Layout>
  );
};
