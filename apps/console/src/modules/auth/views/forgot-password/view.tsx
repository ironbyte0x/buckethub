import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Flex } from '@buckethub/styled-system/jsx';
import { Alert, Button, Icon, Text } from '@buckethub/ui';
import { Link } from '@tanstack/react-router';
import LogoIcon from '@/assets/logo.svg?react';
import { useRequestPasswordReset } from '@/services/auth';
import { useAppForm } from '@/shared/form';
import { ErrorAlert } from '@/shared/form/error-alert';
import { Layout } from '../../layout';
import { forgotPasswordSchema } from './schema';

export const ForgotPasswordView: React.FunctionComponent = () => {
  const [emailSent, setEmailSent] = useState(false);
  const { mutateAsync: requestReset, error } = useRequestPasswordReset();

  const form = useAppForm({
    defaultValues: {
      email: ''
    },
    validators: {
      onSubmit: forgotPasswordSchema
    },
    onSubmit: async ({ value }) => {
      await requestReset(value, {
        onSuccess: () => {
          setEmailSent(true);
        }
      });
    }
  });

  return (
    <Layout>
      <Layout.Header>
        <Layout.Icon>
          <LogoIcon style={{ width: '28px', height: '28px' }} />
        </Layout.Icon>

        <Text variant="title-large" css={{ fontWeight: '600' }}>
          {emailSent ? 'Check your email' : 'Forgot password?'}
        </Text>

        <Text variant="body-large" color="muted" css={{ marginTop: '1' }}>
          {emailSent
            ? "We've sent you a link to reset your password."
            : "Enter your email and we'll send you a reset link."}
        </Text>
      </Layout.Header>

      {emailSent ? (
        <Flex css={{ flexDirection: 'column', gap: '4' }}>
          <Alert variant="success">
            <Alert.Icon>
              <Icon as={CheckCircle} size="md" />
            </Alert.Icon>

            <Alert.Content>
              <Alert.Title>Email sent</Alert.Title>
              <Alert.Description>
                If an account exists with that email, you'll receive a password reset link shortly.
              </Alert.Description>
            </Alert.Content>
          </Alert>

          <Text as={Link} to="/sign-in" variant="body-medium" css={{ textAlign: 'center' }}>
            Back to sign in
          </Text>
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
              title="Request failed"
              description={error?.message || 'Something went wrong'}
            />

            <form.AppField name="email">
              {(field) => (
                <field.TextInput
                  label="Email"
                  placeholder="Enter your email"
                  variant="secondary"
                  size="lg"
                />
              )}
            </form.AppField>

            <form.Subscribe selector={(formState) => formState.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send reset link'}
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
