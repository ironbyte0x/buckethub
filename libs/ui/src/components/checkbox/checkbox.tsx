import { CheckIcon, MinusIcon } from 'lucide-react';
import { Icon } from '../icon';
import { StyledCheckboxIndicator, StyledCheckboxRoot } from './checkbox.styled';

const Root: React.FunctionComponent<React.ComponentProps<typeof StyledCheckboxRoot>> = ({
  children,
  indeterminate,
  ...props
}) => {
  return (
    <StyledCheckboxRoot indeterminate={indeterminate} {...props}>
      <StyledCheckboxIndicator>
        {indeterminate ? (
          <Icon as={MinusIcon} size="xs" strokeWidth="2.5" />
        ) : (
          <Icon as={CheckIcon} size="xs" strokeWidth="2.5" />
        )}
      </StyledCheckboxIndicator>
    </StyledCheckboxRoot>
  );
};

Root.displayName = 'Checkbox';

export const Checkbox: typeof Root = Root;
