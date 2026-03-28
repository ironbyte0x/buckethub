import type { ComponentProps } from '@buckethub/styled-system/types';
import { StyledTextInput } from './text-input.styled';

export type TextInputProps = ComponentProps<typeof StyledTextInput>;

export const TextInput: React.FunctionComponent<TextInputProps> = (props) => {
  return <StyledTextInput aria-invalid={props.error} {...props} />;
};

TextInput.displayName = 'TextInput';
