import { useState } from 'react';
import { CheckCircleIcon } from 'lucide-react';
import * as v from 'valibot';
import { Flex } from '@buckethub/styled-system/jsx';
import { Button, Icon } from '@buckethub/ui';
import { useChangePassword } from '@/services/auth';
import { useAppForm } from '@/shared/form';
import { ErrorAlert } from '@/shared/form/error-alert';
import {
  StyledSection,
  StyledSectionDescription,
  StyledSectionHeader,
  StyledSectionTitle,
  StyledSecurityForm,
  StyledSuccessMessage
} from './security.styled';

const passwordSchema = v.pipe(
  v.object({
    currentPassword: v.pipe(v.string(), v.minLength(1, 'Current password is required')),
    newPassword: v.pipe(v.string(), v.minLength(8, 'Password must be at least 8 characters')),
    confirmPassword: v.pipe(v.string(), v.minLength(1, 'Please confirm your password'))
  }),
  v.forward(
    v.check((data) => data.newPassword === data.confirmPassword, 'Passwords do not match'),
    ['confirmPassword']
  )
);

export const SecurityView: React.FunctionComponent = () => {
  const { mutateAsync: changePassword, error } = useChangePassword();
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useAppForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validators: {
      onSubmit: passwordSchema
    },
    onSubmit: async ({ value }) => {
      setShowSuccess(false);

      await changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword
      });

      setShowSuccess(true);
      form.reset();
    }
  });

  return (
    <StyledSecurityForm
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <ErrorAlert
        show={!!error}
        title="Failed to change password"
        description={error?.message || 'An unexpected error occurred'}
      />

      {showSuccess && (
        <StyledSuccessMessage>
          <Icon as={CheckCircleIcon} size="sm" />
          Password changed successfully. Other sessions have been signed out.
        </StyledSuccessMessage>
      )}

      <StyledSection>
        <StyledSectionHeader>
          <StyledSectionTitle>Change password</StyledSectionTitle>
          <StyledSectionDescription>
            Update your password to keep your account secure.
          </StyledSectionDescription>
        </StyledSectionHeader>

        <form.AppField name="currentPassword">
          {(field) => (
            <field.TextInput
              type="password"
              label="Current password"
              placeholder="Enter your current password"
            />
          )}
        </form.AppField>

        <form.AppField name="newPassword">
          {(field) => (
            <field.TextInput
              type="password"
              label="New password"
              placeholder="Enter your new password"
            />
          )}
        </form.AppField>

        <form.AppField name="confirmPassword">
          {(field) => (
            <field.TextInput
              type="password"
              label="Confirm new password"
              placeholder="Confirm your new password"
            />
          )}
        </form.AppField>
      </StyledSection>

      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          isDirty: state.isDirty
        })}
      >
        {({ isSubmitting, isDirty }) => (
          <Flex css={{ justifyContent: 'flex-end', marginTop: '4' }}>
            <Button type="submit" variant="primary" disabled={!isDirty} loading={isSubmitting}>
              Change password
            </Button>
          </Flex>
        )}
      </form.Subscribe>
    </StyledSecurityForm>
  );
};
