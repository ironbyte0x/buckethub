import { XIcon } from 'lucide-react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import {
  StyledDialogBackdrop,
  StyledDialogBody,
  StyledDialogClose,
  StyledDialogDescription,
  StyledDialogFooter,
  StyledDialogHeader,
  StyledDialogPopup,
  StyledDialogTitle,
  StyledDialogTrigger,
  StyledIconContainer
} from './dialog.styled';

const Root: React.FunctionComponent<React.ComponentProps<typeof DialogPrimitive.Root>> = ({
  children,
  ...props
}) => {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
};

const Trigger: React.FunctionComponent<React.ComponentProps<typeof StyledDialogTrigger>> =
  StyledDialogTrigger;

const Content: React.FunctionComponent<React.ComponentProps<typeof StyledDialogPopup>> = ({
  children,
  ...props
}) => {
  return (
    <DialogPrimitive.Portal>
      <StyledDialogBackdrop />

      <DialogPrimitive.Viewport>
        <StyledDialogPopup {...props}>{children}</StyledDialogPopup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
};

const Header: React.FunctionComponent<React.ComponentProps<typeof StyledDialogHeader>> = ({
  children,
  ...props
}) => {
  return <StyledDialogHeader {...props}>{children}</StyledDialogHeader>;
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

const Title: React.FunctionComponent<React.ComponentProps<typeof StyledDialogTitle>> =
  StyledDialogTitle;

const Description: React.FunctionComponent<React.ComponentProps<typeof StyledDialogDescription>> =
  StyledDialogDescription;

const CloseTrigger: React.FunctionComponent<React.ComponentProps<typeof StyledDialogClose>> =
  StyledDialogClose;

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
          <Icon as={XIcon} size="sm" color="base" />
        </IconButton>
      )}
    />
  );
};

const Body: React.FunctionComponent<React.ComponentProps<typeof StyledDialogBody>> =
  StyledDialogBody;

const Footer: React.FunctionComponent<React.ComponentProps<typeof StyledDialogFooter>> =
  StyledDialogFooter;

Root.displayName = 'Dialog';
Trigger.displayName = 'Dialog.Trigger';
Content.displayName = 'Dialog.Content';
Header.displayName = 'Dialog.Header';
Title.displayName = 'Dialog.Title';
Description.displayName = 'Dialog.Description';
Close.displayName = 'Dialog.Close';
Body.displayName = 'Dialog.Body';
Footer.displayName = 'Dialog.Footer';

type DialogComponent = React.FunctionComponent<
  React.ComponentProps<typeof DialogPrimitive.Root>
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
  createHandle: typeof DialogPrimitive.createHandle;
};

export const Dialog: DialogComponent = Object.assign(Root, {
  Trigger,
  Content,
  Header,
  IconContainer,
  Title,
  Description,
  CloseTrigger,
  Close,
  Body,
  Footer,
  createHandle: DialogPrimitive.createHandle
});
