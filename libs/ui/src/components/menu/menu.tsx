import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { Icon } from '../icon';
import {
  StyledCheckboxItemText,
  StyledMenuBackdrop,
  StyledMenuCheckboxItem,
  StyledMenuCheckboxItemIndicator,
  StyledMenuGroup,
  StyledMenuGroupLabel,
  StyledMenuItem,
  StyledMenuItemIndicator,
  StyledMenuPopup,
  StyledMenuPortal,
  StyledMenuPositioner,
  StyledMenuRadioGroup,
  StyledMenuRadioItem,
  StyledMenuRadioItemIndicator,
  StyledMenuSeparator,
  StyledMenuShortcut,
  StyledMenuSubmenuTrigger,
  StyledMenuTrigger,
  StyledMenuViewport,
  StyledRadioItemText
} from './menu.styled';

const Root: React.FunctionComponent<React.ComponentProps<typeof MenuPrimitive.Root>> = ({
  children,
  ...props
}) => {
  return <MenuPrimitive.Root {...props}>{children}</MenuPrimitive.Root>;
};

const Trigger: React.FunctionComponent<React.ComponentProps<typeof StyledMenuTrigger>> =
  StyledMenuTrigger;

const Content: React.FunctionComponent<
  React.ComponentProps<typeof StyledMenuPopup> & {
    sideOffset?: number;
    alignOffset?: number;
    align?: 'start' | 'center' | 'end';
  }
> = ({ children, sideOffset = 4, alignOffset = 0, align = 'start', ...props }) => {
  return (
    <StyledMenuPortal>
      <StyledMenuBackdrop />
      <StyledMenuPositioner sideOffset={sideOffset} alignOffset={alignOffset} align={align}>
        <StyledMenuPopup {...props}>{children}</StyledMenuPopup>
      </StyledMenuPositioner>
    </StyledMenuPortal>
  );
};

const Item: React.FunctionComponent<React.ComponentProps<typeof StyledMenuItem>> = ({
  children,
  ...props
}) => {
  return <StyledMenuItem {...props}>{children}</StyledMenuItem>;
};

const Separator: React.FunctionComponent<React.ComponentProps<typeof StyledMenuSeparator>> =
  StyledMenuSeparator;

const Group: React.FunctionComponent<React.ComponentProps<typeof StyledMenuGroup>> =
  StyledMenuGroup;

const GroupLabel: React.FunctionComponent<React.ComponentProps<typeof StyledMenuGroupLabel>> =
  StyledMenuGroupLabel;

const CheckboxItem: React.FunctionComponent<
  React.ComponentProps<typeof StyledMenuCheckboxItem>
> = ({ children, ...props }) => {
  return (
    <StyledMenuCheckboxItem {...props}>
      <StyledMenuCheckboxItemIndicator>
        <Icon as={CheckIcon} size="sm" />
      </StyledMenuCheckboxItemIndicator>

      <StyledCheckboxItemText>{children}</StyledCheckboxItemText>
    </StyledMenuCheckboxItem>
  );
};

const RadioGroup: React.FunctionComponent<React.ComponentProps<typeof StyledMenuRadioGroup>> =
  StyledMenuRadioGroup;

const RadioItem: React.FunctionComponent<React.ComponentProps<typeof StyledMenuRadioItem>> = ({
  children,
  ...props
}) => {
  return (
    <StyledMenuRadioItem {...props}>
      <StyledMenuRadioItemIndicator>
        <Icon as={CheckIcon} size="sm" />
      </StyledMenuRadioItemIndicator>

      <StyledRadioItemText>{children}</StyledRadioItemText>
    </StyledMenuRadioItem>
  );
};

const SubmenuRoot: typeof MenuPrimitive.SubmenuRoot = ({ children, ...props }) => {
  return <MenuPrimitive.SubmenuRoot {...props}>{children}</MenuPrimitive.SubmenuRoot>;
};

const SubmenuTrigger: React.FunctionComponent<
  React.ComponentProps<typeof StyledMenuSubmenuTrigger>
> = ({ children, ...props }) => {
  return (
    <StyledMenuSubmenuTrigger {...props}>
      {children}
      <StyledMenuItemIndicator className="submenu-trigger-chevron">
        <Icon as={ChevronRightIcon} size="sm" />
      </StyledMenuItemIndicator>
    </StyledMenuSubmenuTrigger>
  );
};

const Shortcut: React.FunctionComponent<React.ComponentProps<typeof StyledMenuShortcut>> =
  StyledMenuShortcut;

const Viewport: React.FunctionComponent<React.ComponentProps<typeof StyledMenuViewport>> =
  StyledMenuViewport;

Root.displayName = 'Menu';
Trigger.displayName = 'Menu.Trigger';
Content.displayName = 'Menu.Content';
Item.displayName = 'Menu.Item';
Separator.displayName = 'Menu.Separator';
Group.displayName = 'Menu.Group';
GroupLabel.displayName = 'Menu.GroupLabel';
CheckboxItem.displayName = 'Menu.CheckboxItem';
RadioGroup.displayName = 'Menu.RadioGroup';
RadioItem.displayName = 'Menu.RadioItem';
SubmenuTrigger.displayName = 'Menu.SubmenuTrigger';
Shortcut.displayName = 'Menu.Shortcut';
Viewport.displayName = 'Menu.Viewport';

type MenuComponent = typeof Root & {
  Trigger: typeof Trigger;
  Content: typeof Content;
  Item: typeof Item;
  Separator: typeof Separator;
  Group: typeof Group;
  GroupLabel: typeof GroupLabel;
  CheckboxItem: typeof CheckboxItem;
  RadioGroup: typeof RadioGroup;
  RadioItem: typeof RadioItem;
  SubmenuRoot: typeof MenuPrimitive.SubmenuRoot;
  SubmenuTrigger: typeof SubmenuTrigger;
  Shortcut: typeof Shortcut;
  Viewport: typeof Viewport;
};

export const Menu: MenuComponent = Object.assign(Root, {
  Trigger,
  Content,
  Item,
  Separator,
  Group,
  GroupLabel,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  SubmenuRoot,
  SubmenuTrigger,
  Shortcut,
  Viewport
});
