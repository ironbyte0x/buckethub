import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { Icon } from '../icon';
import {
  StyledComboboxBackdrop,
  StyledComboboxChip,
  StyledComboboxChipRemove,
  StyledComboboxChips,
  StyledComboboxClear,
  StyledComboboxEmpty,
  StyledComboboxGroup,
  StyledComboboxGroupLabel,
  StyledComboboxIcon,
  StyledComboboxInput,
  StyledComboboxInputGroup,
  StyledComboboxItem,
  StyledComboboxItemIndicator,
  StyledComboboxItemText,
  StyledComboboxLabel,
  StyledComboboxList,
  StyledComboboxPopup,
  StyledComboboxPortal,
  StyledComboboxPositioner,
  StyledComboboxSeparator,
  StyledComboboxTriggerContainer,
  StyledComboboxValue,
  StyledTrigger
} from './combobox.styled';

const Root = ComboboxPrimitive.Root;

const Trigger: React.FunctionComponent<React.ComponentProps<typeof ComboboxPrimitive.Trigger>> = ({
  children,
  ...props
}) => {
  return <StyledTrigger {...props}>{children}</StyledTrigger>;
};

interface TriggerContainerProps extends React.ComponentProps<
  typeof StyledComboboxTriggerContainer
> {
  error?: boolean;
}

const TriggerContainer: React.FunctionComponent<TriggerContainerProps> = ({
  error,
  children,
  ...props
}) => {
  return (
    <StyledComboboxTriggerContainer
      aria-invalid={error}
      {...props}
      variant={error ? 'error' : 'default'}
    >
      {children}
      <StyledComboboxIcon>
        <Icon as={ChevronDownIcon} size="sm" />
      </StyledComboboxIcon>
    </StyledComboboxTriggerContainer>
  );
};

type ValueProps = React.ComponentProps<typeof StyledComboboxValue>;

const Value: React.FunctionComponent<ValueProps> = ({ children, ...props }) => {
  return <StyledComboboxValue {...props}>{children}</StyledComboboxValue>;
};

const IconComponent: React.FunctionComponent<React.ComponentProps<typeof StyledComboboxIcon>> =
  StyledComboboxIcon;

const Input: React.FunctionComponent<React.ComponentProps<typeof StyledComboboxInput>> =
  StyledComboboxInput;

const Clear: React.FunctionComponent<React.ComponentProps<typeof StyledComboboxClear>> =
  StyledComboboxClear;

const Chips: React.FunctionComponent<React.ComponentProps<typeof StyledComboboxChips>> = (
  props
) => <StyledComboboxChips data-slot="combobox-chips" {...props} />;

const Chip: React.FunctionComponent<React.ComponentProps<typeof StyledComboboxChip>> =
  StyledComboboxChip;

const ChipRemove: React.FunctionComponent<React.ComponentProps<typeof StyledComboboxChipRemove>> =
  StyledComboboxChipRemove;

const Portal: React.FunctionComponent<React.ComponentProps<typeof StyledComboboxPortal>> =
  StyledComboboxPortal;

const Backdrop: React.FunctionComponent<React.ComponentProps<typeof StyledComboboxBackdrop>> =
  StyledComboboxBackdrop;

const Positioner: React.FunctionComponent<React.ComponentProps<typeof StyledComboboxPositioner>> =
  StyledComboboxPositioner;

const Popup: React.FunctionComponent<React.ComponentProps<typeof StyledComboboxPopup>> =
  StyledComboboxPopup;

const List: React.FunctionComponent<React.ComponentProps<typeof StyledComboboxList>> =
  StyledComboboxList;

interface ItemProps extends React.ComponentProps<typeof StyledComboboxItem> {
  showIndicator?: boolean;
}

const Item: React.FunctionComponent<ItemProps> = ({ showIndicator = true, children, ...props }) => {
  return (
    <StyledComboboxItem {...props}>
      {showIndicator && (
        <StyledComboboxItemIndicator>
          <Icon as={CheckIcon} size="sm" />
        </StyledComboboxItemIndicator>
      )}
      {typeof children === 'string' ? (
        <StyledComboboxItemText>{children}</StyledComboboxItemText>
      ) : (
        children
      )}
    </StyledComboboxItem>
  );
};

const ItemText: React.FunctionComponent<React.ComponentProps<typeof StyledComboboxItemText>> =
  StyledComboboxItemText;

const ItemIndicator: React.FunctionComponent<
  React.ComponentProps<typeof StyledComboboxItemIndicator>
> = StyledComboboxItemIndicator;

const Empty: React.FunctionComponent<React.ComponentProps<typeof ComboboxPrimitive.Empty>> = ({
  children,
  ...props
}) => {
  return (
    <ComboboxPrimitive.Empty {...props}>
      <StyledComboboxEmpty>{children}</StyledComboboxEmpty>
    </ComboboxPrimitive.Empty>
  );
};

const Group: React.FunctionComponent<React.ComponentProps<typeof StyledComboboxGroup>> =
  StyledComboboxGroup;

const GroupLabel: React.FunctionComponent<React.ComponentProps<typeof StyledComboboxGroupLabel>> =
  StyledComboboxGroupLabel;

const Separator: React.FunctionComponent<React.ComponentProps<typeof StyledComboboxSeparator>> =
  StyledComboboxSeparator;

const Label: React.FunctionComponent<React.ComponentProps<typeof StyledComboboxLabel>> =
  StyledComboboxLabel;

const InputGroup: React.FunctionComponent<React.ComponentProps<typeof StyledComboboxInputGroup>> =
  StyledComboboxInputGroup;

Trigger.displayName = 'Combobox.Trigger';
TriggerContainer.displayName = 'Combobox.SelectTrigger';
Value.displayName = 'Combobox.Value';
IconComponent.displayName = 'Combobox.Icon';
Input.displayName = 'Combobox.Input';
Clear.displayName = 'Combobox.Clear';
Chips.displayName = 'Combobox.Chips';
Chip.displayName = 'Combobox.Chip';
ChipRemove.displayName = 'Combobox.ChipRemove';
Portal.displayName = 'Combobox.Portal';
Backdrop.displayName = 'Combobox.Backdrop';
Positioner.displayName = 'Combobox.Positioner';
Popup.displayName = 'Combobox.Popup';
List.displayName = 'Combobox.List';
Item.displayName = 'Combobox.Item';
ItemText.displayName = 'Combobox.ItemText';
ItemIndicator.displayName = 'Combobox.ItemIndicator';
Empty.displayName = 'Combobox.Empty';
Group.displayName = 'Combobox.Group';
GroupLabel.displayName = 'Combobox.GroupLabel';
Separator.displayName = 'Combobox.Separator';
Label.displayName = 'Combobox.Label';
InputGroup.displayName = 'Combobox.InputGroup';

export const Combobox: typeof Root & {
  Trigger: typeof Trigger;
  TriggerContainer: typeof TriggerContainer;
  Value: typeof Value;
  Icon: typeof IconComponent;
  Input: typeof Input;
  Clear: typeof Clear;
  Chips: typeof Chips;
  Chip: typeof Chip;
  ChipRemove: typeof ChipRemove;
  Portal: typeof Portal;
  Backdrop: typeof Backdrop;
  Positioner: typeof Positioner;
  Popup: typeof Popup;
  List: typeof List;
  Item: typeof Item;
  ItemText: typeof ItemText;
  ItemIndicator: typeof ItemIndicator;
  Empty: typeof Empty;
  Group: typeof Group;
  GroupLabel: typeof GroupLabel;
  Separator: typeof Separator;
  Label: typeof Label;
  InputGroup: typeof InputGroup;
} = Object.assign(Root, {
  Trigger,
  TriggerContainer,
  Value,
  Icon: IconComponent,
  Input,
  Clear,
  Chips,
  Chip,
  ChipRemove,
  Portal,
  Backdrop,
  Positioner,
  Popup,
  List,
  Item,
  ItemText,
  ItemIndicator,
  Empty,
  Group,
  GroupLabel,
  Separator,
  Label,
  InputGroup
});
