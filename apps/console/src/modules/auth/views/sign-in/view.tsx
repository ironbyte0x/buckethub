import { Flex } from '@buckethub/styled-system/jsx';
import { Button, Checkbox, Text } from '@buckethub/ui';
import { Link, useNavigate } from '@tanstack/react-router';
import LogoIcon from '@/assets/logo.svg?react';
import { useSignInWithEmail } from '@/services/auth';
import { useAppForm } from '@/shared/form';
import { ErrorAlert } from '@/shared/form/error-alert';
import { Layout } from '../../layout';
import { signInSchema } from './schema';

export const SignInView: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { mutateAsync: signIn, error } = useSignInWithEmail();

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validators: {
      onSubmit: signInSchema
    },
    onSubmit: async ({ value }) => {
      await signIn(value, {
        onSuccess: () => {
          navigate({ to: '/' });
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

        <Text variant="title-extra-large" css={{ fontWeight: '600' }}>
          Sign in
        </Text>

        <Text variant="body-large" color="muted" css={{ marginTop: '1' }}>
          Welcome back! Please enter your details.
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
            title="Sign in failed"
            description={error?.message || 'Invalid email or password'}
          />

          <form.AppField name="email">
            {(field) => (
              <field.TextInput
                type="email"
                label="Email"
                placeholder="Enter your email"
                variant="secondary"
                size="lg"
              />
            )}
          </form.AppField>

          <form.AppField name="password">
            {(field) => (
              <field.PasswordInput
                label="Password"
                placeholder="••••••••"
                variant="secondary"
                size="lg"
              />
            )}
          </form.AppField>

          <Flex
            css={{
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBlock: '0.5'
            }}
          >
            <form.AppField name="rememberMe">
              {(field) => (
                <Text
                  as="label"
                  variant="body-medium"
                  color="muted"
                  css={{ display: 'flex', gap: '2', alignItems: 'center' }}
                >
                  <Checkbox
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.setValue(!!checked)}
                  />
                  Remember me
                </Text>
              )}
            </form.AppField>

            <Text as={Link} to="/forgot-password" variant="body-medium">
              Forgot password?
            </Text>
          </Flex>

          <form.Subscribe selector={(formState) => formState.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
                Sign in
              </Button>
            )}
          </form.Subscribe>
        </Flex>
      </form>
    </Layout>
  );
};
