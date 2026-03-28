import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { Icon } from '../icon';
import {
  StyledSelectBackdrop,
  StyledSelectGroup,
  StyledSelectGroupLabel,
  StyledSelectIcon,
  StyledSelectItem,
  StyledSelectItemIndicator,
  StyledSelectItemText,
  StyledSelectLabel,
  StyledSelectList,
  StyledSelectPopup,
  StyledSelectPortal,
  StyledSelectPositioner,
  StyledSelectScrollDownArrow,
  StyledSelectScrollUpArrow,
  StyledSelectSeparator,
  StyledSelectTrigger,
  StyledSelectValue
} from './select.styled';

const Root: typeof SelectPrimitive.Root = ({ children, ...props }) => {
  return <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>;
};

interface TriggerProps extends React.ComponentProps<typeof StyledSelectTrigger> {
  error?: boolean;
}

const Trigger: React.FunctionComponent<TriggerProps> = ({ error, children, ...props }) => {
  return (
    <StyledSelectTrigger aria-invalid={error} {...props} variant={error ? 'error' : 'default'}>
      {children}
      <StyledSelectIcon>
        <Icon as={ChevronDownIcon} size="sm" />
      </StyledSelectIcon>
    </StyledSelectTrigger>
  );
};

const Value = StyledSelectValue;

const Content: React.FunctionComponent<React.ComponentProps<typeof StyledSelectPopup>> = ({
  children,
  ...props
}) => {
  return (
    <StyledSelectPortal>
      <StyledSelectBackdrop />
      <StyledSelectPositioner alignItemWithTrigger={false} sideOffset={4}>
        <StyledSelectPopup {...props}>
          <StyledSelectList>{children}</StyledSelectList>
        </StyledSelectPopup>
      </StyledSelectPositioner>
    </StyledSelectPortal>
  );
};

const Item: React.FunctionComponent<React.ComponentProps<typeof StyledSelectItem>> = ({
  children,
  ...props
}) => {
  return (
    <StyledSelectItem {...props}>
      <StyledSelectItemText>{children}</StyledSelectItemText>
      <StyledSelectItemIndicator>
        <Icon as={CheckIcon} size="sm" />
      </StyledSelectItemIndicator>
    </StyledSelectItem>
  );
};

const Group: React.FunctionComponent<React.ComponentProps<typeof StyledSelectGroup>> =
  StyledSelectGroup;

const GroupLabel: React.FunctionComponent<React.ComponentProps<typeof StyledSelectGroupLabel>> =
  StyledSelectGroupLabel;

const Separator: React.FunctionComponent<React.ComponentProps<typeof StyledSelectSeparator>> =
  StyledSelectSeparator;

const ScrollUpArrow: React.FunctionComponent<
  React.ComponentProps<typeof StyledSelectScrollUpArrow>
> = ({ children, ...props }) => {
  return (
    <StyledSelectScrollUpArrow {...props}>
      {children || <Icon as={ChevronDownIcon} size="sm" css={{ transform: 'rotate(180deg)' }} />}
    </StyledSelectScrollUpArrow>
  );
};

const ScrollDownArrow: React.FunctionComponent<
  React.ComponentProps<typeof StyledSelectScrollDownArrow>
> = ({ children, ...props }) => {
  return (
    <StyledSelectScrollDownArrow {...props}>
      {children || <Icon as={ChevronDownIcon} size="sm" />}
    </StyledSelectScrollDownArrow>
  );
};

const Label: React.FunctionComponent<React.ComponentProps<typeof StyledSelectLabel>> =
  StyledSelectLabel;

Trigger.displayName = 'Select.Trigger';
Value.displayName = 'Select.Value';
Content.displayName = 'Select.Content';
Item.displayName = 'Select.Item';
Group.displayName = 'Select.Group';
GroupLabel.displayName = 'Select.GroupLabel';
Separator.displayName = 'Select.Separator';
ScrollUpArrow.displayName = 'Select.ScrollUpArrow';
ScrollDownArrow.displayName = 'Select.ScrollDownArrow';
Label.displayName = 'Select.Label';

export const Select: typeof SelectPrimitive.Root & {
  Trigger: typeof Trigger;
  Value: typeof Value;
  Content: typeof Content;
  Item: typeof Item;
  ItemText: typeof SelectPrimitive.ItemText;
  Group: typeof Group;
  GroupLabel: typeof GroupLabel;
  Separator: typeof Separator;
  ScrollUpArrow: typeof ScrollUpArrow;
  ScrollDownArrow: typeof ScrollDownArrow;
  Label: typeof Label;
} = Object.assign(Root, {
  Trigger,
  Value,
  Content,
  Item,
  ItemText: SelectPrimitive.ItemText,
  Group,
  GroupLabel,
  Separator,
  ScrollUpArrow,
  ScrollDownArrow,
  Label
});
