import { XIcon } from 'lucide-react';
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import {
  StyledAlertDialogBackdrop,
  StyledAlertDialogBody,
  StyledAlertDialogClose,
  StyledAlertDialogDescription,
  StyledAlertDialogFooter,
  StyledAlertDialogHeader,
  StyledAlertDialogPopup,
  StyledAlertDialogTitle,
  StyledAlertDialogTrigger,
  StyledIconContainer
} from './alert-dialog.styled';

const Root: React.FunctionComponent<React.ComponentProps<typeof AlertDialogPrimitive.Root>> = ({
  children,
  ...props
}) => {
  return <AlertDialogPrimitive.Root {...props}>{children}</AlertDialogPrimitive.Root>;
};

const Trigger: React.FunctionComponent<React.ComponentProps<typeof StyledAlertDialogTrigger>> =
  StyledAlertDialogTrigger;

const Content: React.FunctionComponent<React.ComponentProps<typeof StyledAlertDialogPopup>> = ({
  children,
  ...props
}) => {
  return (
    <AlertDialogPrimitive.Portal>
      <StyledAlertDialogBackdrop />
      <StyledAlertDialogPopup {...props}>{children}</StyledAlertDialogPopup>
    </AlertDialogPrimitive.Portal>
  );
};

const Header: React.FunctionComponent<React.ComponentProps<typeof StyledAlertDialogHeader>> = ({
  children,
  ...props
}) => {
  return <StyledAlertDialogHeader {...props}>{children}</StyledAlertDialogHeader>;
};

const IconContainer: React.FunctionComponent<React.ComponentProps<typeof StyledIconContainer>> = ({
  children,
  ...props
}) => {
  return (
    <StyledIconContainer data-slot="icon-container" {...props}>
      {children}
    </StyledIconContainer>
  );
};

const Title: React.FunctionComponent<React.ComponentProps<typeof StyledAlertDialogTitle>> =
  StyledAlertDialogTitle;

const Description: React.FunctionComponent<
  React.ComponentProps<typeof StyledAlertDialogDescription>
> = StyledAlertDialogDescription;

const CloseTrigger: React.FunctionComponent<React.ComponentProps<typeof StyledAlertDialogClose>> =
  StyledAlertDialogClose;

const Close: React.FunctionComponent<
  Omit<React.ComponentProps<typeof CloseTrigger>, 'children'>
> = () => {
  return (
    <CloseTrigger
      render={(props) => (
        <IconButton
          variant="ghost"
          size="xs"
          css={{ marginTop: '-1.5', marginRight: '-1.5' }}
          {...props}
        >
          <Icon as={XIcon} size="sm" />
        </IconButton>
      )}
    />
  );
};

const Body: React.FunctionComponent<React.ComponentProps<typeof StyledAlertDialogBody>> =
  StyledAlertDialogBody;

const Footer: React.FunctionComponent<React.ComponentProps<typeof StyledAlertDialogFooter>> =
  StyledAlertDialogFooter;

Root.displayName = 'AlertDialog';
Trigger.displayName = 'AlertDialog.Trigger';
Content.displayName = 'AlertDialog.Content';
Header.displayName = 'AlertDialog.Header';
Title.displayName = 'AlertDialog.Title';
Description.displayName = 'AlertDialog.Description';
Close.displayName = 'AlertDialog.Close';
Body.displayName = 'AlertDialog.Body';
Footer.displayName = 'AlertDialog.Footer';

type AlertDialogComponent = React.FunctionComponent<
  React.ComponentProps<typeof AlertDialogPrimitive.Root>
> & {
  Trigger: typeof Trigger;
  Content: typeof Content;
  Header: typeof Header;
  IconContainer: typeof IconContainer;
  Title: typeof Title;
  Description: typeof Description;
  CloseTrigger: typeof CloseTrigger;
  Close: typeof Close;
  Body: typeof Body;
  Footer: typeof Footer;
};

export const AlertDialog: AlertDialogComponent = Object.assign(Root, {
  Trigger,
  Content,
  Header,
  IconContainer,
  Title,
  Description,
  CloseTrigger,
  Close,
  Body,
  Footer
});
