import { createContext, useContext } from 'react';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useMediaQuery } from '../../hooks/use-media-query';
import { AlertDialog } from '../alert-dialog';
import { Drawer } from '../drawer';

/* eslint-disable @typescript-eslint/no-explicit-any -- ComponentMap unifies AlertDialog and Drawer sub-component types */
interface ComponentMap {
  Trigger: React.FunctionComponent<any>;
  Content: React.FunctionComponent<any>;
  Header: React.FunctionComponent<any>;
  Title: React.FunctionComponent<any>;
  Description: React.FunctionComponent<any>;
  CloseTrigger: React.FunctionComponent<any>;
  Close: React.FunctionComponent<any>;
  Body: React.FunctionComponent<any>;
  Footer: React.FunctionComponent<any>;
  IconContainer: React.FunctionComponent<any>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const ALERT_DIALOG_COMPONENTS: ComponentMap = {
  Trigger: AlertDialog.Trigger,
  Content: AlertDialog.Content,
  Header: AlertDialog.Header,
  Title: AlertDialog.Title,
  Description: AlertDialog.Description,
  CloseTrigger: AlertDialog.CloseTrigger,
  Close: AlertDialog.Close,
  Body: AlertDialog.Body,
  Footer: AlertDialog.Footer,
  IconContainer: AlertDialog.IconContainer
};

const DRAWER_COMPONENTS: ComponentMap = {
  Trigger: Drawer.Trigger,
  Content: Drawer.Content,
  Header: Drawer.Header,
  Title: Drawer.Title,
  Description: Drawer.Description,
  CloseTrigger: Drawer.CloseTrigger,
  Close: Drawer.Close,
  Body: Drawer.Body,
  Footer: Drawer.Footer,
  IconContainer: AlertDialog.IconContainer
};

const ResponsiveAlertDialogContext = createContext<ComponentMap>(ALERT_DIALOG_COMPONENTS);

interface RootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Root: React.FunctionComponent<RootProps> = ({
  children,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  modal
}) => {
  const isMobile = useMediaQuery('(max-width: 1023px)');

  const [isOpen, setIsOpen] = useControllableState({
    prop: controlledOpen,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange
  });

  const rootProps = {
    open: isOpen,
    modal,
    onOpenChange: setIsOpen
  };

  if (isMobile) {
    return (
      <ResponsiveAlertDialogContext value={DRAWER_COMPONENTS}>
        <Drawer position="bottom" {...rootProps}>
          {children}
        </Drawer>
      </ResponsiveAlertDialogContext>
    );
  }

  return (
    <ResponsiveAlertDialogContext value={ALERT_DIALOG_COMPONENTS}>
      <AlertDialog {...rootProps}>{children}</AlertDialog>
    </ResponsiveAlertDialogContext>
  );
};

const Trigger: React.FunctionComponent<React.ComponentProps<typeof AlertDialog.Trigger>> = (
  props
) => {
  const components = useContext(ResponsiveAlertDialogContext);

  return <components.Trigger {...props} />;
};

const Content: React.FunctionComponent<React.ComponentProps<typeof AlertDialog.Content>> = (
  props
) => {
  const components = useContext(ResponsiveAlertDialogContext);

  return <components.Content {...props} />;
};

const Header: React.FunctionComponent<React.ComponentProps<typeof AlertDialog.Header>> = (
  props
) => {
  const components = useContext(ResponsiveAlertDialogContext);

  return <components.Header {...props} />;
};

const Title: React.FunctionComponent<React.ComponentProps<typeof AlertDialog.Title>> = (props) => {
  const components = useContext(ResponsiveAlertDialogContext);

  return <components.Title {...props} />;
};

const Description: React.FunctionComponent<React.ComponentProps<typeof AlertDialog.Description>> = (
  props
) => {
  const components = useContext(ResponsiveAlertDialogContext);

  return <components.Description {...props} />;
};

const CloseTrigger: React.FunctionComponent<
  React.ComponentProps<typeof AlertDialog.CloseTrigger>
> = (props) => {
  const components = useContext(ResponsiveAlertDialogContext);

  return <components.CloseTrigger {...props} />;
};

const Close: React.FunctionComponent<React.ComponentProps<typeof AlertDialog.Close>> = (props) => {
  const components = useContext(ResponsiveAlertDialogContext);

  return <components.Close {...props} />;
};

const Body: React.FunctionComponent<React.ComponentProps<typeof AlertDialog.Body>> = (props) => {
  const components = useContext(ResponsiveAlertDialogContext);

  return <components.Body data-slot="drawer-body" {...props} />;
};

const Footer: React.FunctionComponent<React.ComponentProps<typeof AlertDialog.Footer>> = (
  props
) => {
  const components = useContext(ResponsiveAlertDialogContext);

  return <components.Footer data-slot="drawer-footer" {...props} />;
};

const IconContainer: React.FunctionComponent<
  React.ComponentProps<typeof AlertDialog.IconContainer>
> = (props) => {
  const components = useContext(ResponsiveAlertDialogContext);

  return <components.IconContainer {...props} />;
};

Root.displayName = 'ResponsiveAlertDialog';
Trigger.displayName = 'ResponsiveAlertDialog.Trigger';
Content.displayName = 'ResponsiveAlertDialog.Content';
Header.displayName = 'ResponsiveAlertDialog.Header';
Title.displayName = 'ResponsiveAlertDialog.Title';
Description.displayName = 'ResponsiveAlertDialog.Description';
CloseTrigger.displayName = 'ResponsiveAlertDialog.CloseTrigger';
Close.displayName = 'ResponsiveAlertDialog.Close';
Body.displayName = 'ResponsiveAlertDialog.Body';
Footer.displayName = 'ResponsiveAlertDialog.Footer';
IconContainer.displayName = 'ResponsiveAlertDialog.IconContainer';

type ResponsiveAlertDialogComponent = React.FunctionComponent<RootProps> & {
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

export const ResponsiveAlertDialog: ResponsiveAlertDialogComponent = Object.assign(Root, {
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
