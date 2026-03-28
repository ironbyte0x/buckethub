import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from './contexts';
import { PasswordInputField } from './fields/password';
import { ProviderEndpointField } from './fields/provider-endpoint/endpoint-field';
import { SelectField } from './fields/select';
import { TextInputField } from './fields/text';

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextInput: TextInputField,
    PasswordInput: PasswordInputField,
    Select: SelectField,
    ProviderEndpoint: ProviderEndpointField
  },
  formComponents: {},
  fieldContext,
  formContext
});
