import { useId } from 'react';
import { Field, Text } from '@buckethub/ui';
import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '../../contexts';
import { FieldError } from '../../field-error';
import { ProviderEndpointInput } from './endpoint-input';

export interface ProviderEndpointFieldProps {
  optional?: boolean;
}

export const ProviderEndpointField: React.FunctionComponent<ProviderEndpointFieldProps> = ({
  optional
}) => {
  const id = useId();
  const field = useFieldContext<string>();
  const hasError = useStore(field.store, (state) => state.meta.errors.length > 0);

  return (
    <Field>
      <Field.Label htmlFor={id}>
        Endpoint
        {optional && (
          <Text variant="body-large" color="muted">
            {' '}
            (optional)
          </Text>
        )}
      </Field.Label>

      <ProviderEndpointInput
        id={id}
        ariaLabel="Endpoint"
        value={field.state.value}
        error={hasError}
        placeholder="https://s3.your-endpoint.com"
        onChange={(value) => field.handleChange(value)}
        // eslint-disable-next-line react/jsx-handler-names
        onBlur={field.handleBlur}
      />

      <FieldError />
    </Field>
  );
};
