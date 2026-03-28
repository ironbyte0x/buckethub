import { useId } from 'react';
import { InfoIcon } from 'lucide-react';
import { Field, Icon, Text, TextInput, Tooltip } from '@buckethub/ui';
import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '../contexts';
import { FieldError } from '../field-error';

export interface TextInputFieldProps {
  type?: React.ComponentProps<'input'>['type'];
  label: string;
  optional?: boolean;
  info?: string;
  placeholder: string;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg';
}

export const TextInputField = ({
  label,
  optional,
  info,
  placeholder,
  variant,
  size
}: TextInputFieldProps) => {
  const id = useId();
  const field = useFieldContext<string>();
  const error = useStore(field.store, (state) => state.meta.errors.length > 0);

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

        {info && (
          <Tooltip>
            <Tooltip.Trigger css={{ marginLeft: '1' }}>
              <Icon as={InfoIcon} size="sm" color="neutral" css={{ marginBottom: '-0.5' }} />
            </Tooltip.Trigger>

            <Tooltip.Content
              css={{
                maxWidth: '60',
                textAlign: 'center'
              }}
            >
              {info}
            </Tooltip.Content>
          </Tooltip>
        )}
      </Field.Label>

      <TextInput
        id={id}
        name={field.name}
        placeholder={placeholder}
        error={error}
        variant={variant}
        size={size}
        value={field.state.value}
        // eslint-disable-next-line react/jsx-handler-names
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />

      <FieldError />
    </Field>
  );
};
