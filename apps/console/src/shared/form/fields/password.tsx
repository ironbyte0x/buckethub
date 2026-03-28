import { useId, useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Field, Icon, InputGroup, Text } from '@buckethub/ui';
import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '../contexts';
import { FieldError } from '../field-error';

export interface PasswordInputFieldProps {
  label: string;
  optional?: boolean;
  placeholder: string;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg';
}

export const PasswordInputField = ({
  label,
  optional,
  placeholder,
  variant,
  size
}: PasswordInputFieldProps) => {
  const id = useId();
  const field = useFieldContext();
  const error = useStore(field.store, (state) => state.meta.errors.length > 0);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Field>
      <Field.Label htmlFor={id}>
        {label}

        {optional && (
          <Text variant="body-large" color="muted">
            {' '}
            (optional)
          </Text>
        )}
      </Field.Label>

      <InputGroup variant={variant} size={size}>
        <InputGroup.Input
          id={id}
          name={field.name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          error={error}
          // eslint-disable-next-line react/jsx-handler-names
          onBlur={field.handleBlur}
          onChange={(event) => field.handleChange(event.target.value)}
        />

        <InputGroup.Addon align="inline-end">
          <InputGroup.Button onClick={togglePasswordVisibility}>
            <Icon as={showPassword ? EyeOffIcon : EyeIcon} size="sm" />
          </InputGroup.Button>
        </InputGroup.Addon>
      </InputGroup>

      <FieldError />
    </Field>
  );
};
