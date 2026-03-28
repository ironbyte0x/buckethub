import { useRef } from 'react';
import * as v from 'valibot';
import { Flex } from '@buckethub/styled-system/jsx';
import { Avatar, Button, Text, toast } from '@buckethub/ui';
import { useAuth } from '@/services/auth';
import { useUpdateProfile } from '@/services/profile';
import { useAppForm } from '@/shared/form';
import { ErrorAlert } from '@/shared/form/error-alert';
import {
  StyledAvatarActions,
  StyledAvatarSection,
  StyledProfileForm,
  StyledSection,
  StyledSectionDescription,
  StyledSectionHeader,
  StyledSectionTitle
} from './profile.styled';

const profileSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
  email: v.pipe(v.string(), v.email('Invalid email address')),
  image: v.nullable(v.string())
});

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const ProfileView: React.FunctionComponent = () => {
  const { user } = useAuth();
  const { mutateAsync: updateProfile, error } = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    throw new Error('User not found');
  }

  const form = useAppForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      image: user.image
    },
    validators: {
      onSubmit: profileSchema
    },
    onSubmit: async ({ value }) => {
      const result = await updateProfile(value);

      if (value.email && value.email.toLowerCase() !== result.email.toLowerCase()) {
        toast.info({
          title: 'Verification email sent',
          description: `A verification email has been sent to ${value.email}. Please check your inbox to confirm the change.`
        });
      }
    }
  });

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const base64 = await fileToBase64(file);

    form.setFieldValue('image', base64);
    event.target.value = '';
  };

  const onRemoveAvatar = () => {
    form.setFieldValue('image', null);
  };

  return (
    <StyledProfileForm
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <ErrorAlert
        show={!!error}
        title="Failed to update profile"
        description={error?.message || 'An unexpected error occurred'}
      />

      <StyledSection>
        <StyledSectionHeader>
          <StyledSectionTitle>Profile information</StyledSectionTitle>
          <StyledSectionDescription>Update your personal details.</StyledSectionDescription>
        </StyledSectionHeader>

        <form.Subscribe
          selector={(state) => ({
            name: state.values.name,
            image: state.values.image
          })}
        >
          {({ name, image }) => (
            <StyledAvatarSection>
              <Avatar size="2xl" css={{ border: 'base' }}>
                {image ? (
                  <Avatar.Image src={image} alt={name} />
                ) : (
                  <Text variant="body-large-emphasized" css={{ textTransform: 'uppercase' }}>
                    {getInitials(name || user.name)}
                  </Text>
                )}
              </Avatar>

              <StyledAvatarActions>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload image
                </Button>

                {image && (
                  <Button type="button" variant="ghost" size="sm" onClick={onRemoveAvatar}>
                    Remove
                  </Button>
                )}
              </StyledAvatarActions>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={onFileChange}
              />
            </StyledAvatarSection>
          )}
        </form.Subscribe>

        <form.AppField name="name">
          {(field) => <field.TextInput label="Name" placeholder="Enter your name" />}
        </form.AppField>

        <form.AppField name="email">
          {(field) => <field.TextInput type="email" label="Email" placeholder="Enter your email" />}
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
              Save changes
            </Button>
          </Flex>
        )}
      </form.Subscribe>
    </StyledProfileForm>
  );
};
