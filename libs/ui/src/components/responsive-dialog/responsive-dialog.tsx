import { createContext, useContext, useEffect } from 'react';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useMediaQuery } from '../../hooks/use-media-query';
import { Dialog } from '../dialog';
import { Drawer } from '../drawer';

/* eslint-disable @typescript-eslint/no-explicit-any -- ComponentMap unifies Dialog and Drawer sub-component types */
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

const DIALOG_COMPONENTS: ComponentMap = {
  Trigger: Dialog.Trigger,
  Content: Dialog.Content,
  Header: Dialog.Header,
  Title: Dialog.Title,
  Description: Dialog.Description,
  CloseTrigger: Dialog.CloseTrigger,
  Close: Dialog.Close,
  Body: Dialog.Body,
  Footer: Dialog.Footer,
  IconContainer: Dialog.IconContainer
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
  IconContainer: Dialog.IconContainer
};

const ResponsiveDialogContext = createContext<ComponentMap>(DIALOG_COMPONENTS);

interface RootProps {
  children?: React.ReactNode | ((props: { payload: unknown }) => React.ReactNode);
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  dismissible?: boolean;
  handle?: React.ComponentProps<typeof Dialog>['handle'];
  onOpenChange?: (open: boolean) => void;
}

const Root: React.FunctionComponent<RootProps> = ({
  children,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  modal,
  dismissible = true,
  handle
}) => {
  const isMobile = useMediaQuery('(max-width: 1023px)');

  const [isOpen, setIsOpen] = useControllableState({
    prop: controlledOpen,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange
  });

  useEffect(() => {
    if (dismissible || !isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [dismissible, isOpen]);

  const rootProps = {
    handle,
    open: isOpen,
    modal,
    disablePointerDismissal: !dismissible,
    onOpenChange: setIsOpen
  };

  if (isMobile) {
    return (
      <ResponsiveDialogContext value={DRAWER_COMPONENTS}>
        <Drawer position="bottom" {...rootProps}>
          {children}
        </Drawer>
      </ResponsiveDialogContext>
    );
  }

  return (
    <ResponsiveDialogContext value={DIALOG_COMPONENTS}>
      <Dialog {...rootProps}>{children}</Dialog>
    </ResponsiveDialogContext>
  );
};

const Trigger: React.FunctionComponent<React.ComponentProps<typeof Dialog.Trigger>> = (props) => {
  const components = useContext(ResponsiveDialogContext);

  return <components.Trigger {...props} />;
};

const Content: React.FunctionComponent<React.ComponentProps<typeof Dialog.Content>> = (props) => {
  const components = useContext(ResponsiveDialogContext);

  return <components.Content {...props} />;
};

const Header: React.FunctionComponent<React.ComponentProps<typeof Dialog.Header>> = (props) => {
  const components = useContext(ResponsiveDialogContext);

  return <components.Header {...props} />;
};

const Title: React.FunctionComponent<React.ComponentProps<typeof Dialog.Title>> = (props) => {
  const components = useContext(ResponsiveDialogContext);

  return <components.Title {...props} />;
};

const Description: React.FunctionComponent<React.ComponentProps<typeof Dialog.Description>> = (
  props
) => {
  const components = useContext(ResponsiveDialogContext);

  return <components.Description {...props} />;
};

const CloseTrigger: React.FunctionComponent<React.ComponentProps<typeof Dialog.CloseTrigger>> = (
  props
) => {
  const components = useContext(ResponsiveDialogContext);

  return <components.CloseTrigger {...props} />;
};

const Close: React.FunctionComponent<React.ComponentProps<typeof Dialog.Close>> = (props) => {
  const components = useContext(ResponsiveDialogContext);

  return <components.Close {...props} />;
};

const Body: React.FunctionComponent<React.ComponentProps<typeof Dialog.Body>> = (props) => {
  const components = useContext(ResponsiveDialogContext);

  return <components.Body data-slot="drawer-body" {...props} />;
};

const Footer: React.FunctionComponent<React.ComponentProps<typeof Dialog.Footer>> = (props) => {
  const components = useContext(ResponsiveDialogContext);

  return <components.Footer data-slot="drawer-footer" {...props} />;
};

const IconContainer: React.FunctionComponent<React.ComponentProps<typeof Dialog.IconContainer>> = (
  props
) => {
  const components = useContext(ResponsiveDialogContext);

  return <components.IconContainer {...props} />;
};

Root.displayName = 'ResponsiveDialog';
Trigger.displayName = 'ResponsiveDialog.Trigger';
Content.displayName = 'ResponsiveDialog.Content';
Header.displayName = 'ResponsiveDialog.Header';
Title.displayName = 'ResponsiveDialog.Title';
Description.displayName = 'ResponsiveDialog.Description';
CloseTrigger.displayName = 'ResponsiveDialog.CloseTrigger';
Close.displayName = 'ResponsiveDialog.Close';
Body.displayName = 'ResponsiveDialog.Body';
Footer.displayName = 'ResponsiveDialog.Footer';
IconContainer.displayName = 'ResponsiveDialog.IconContainer';

type ResponsiveDialogComponent = React.FunctionComponent<RootProps> & {
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
  createHandle: typeof Dialog.createHandle;
};

export const ResponsiveDialog: ResponsiveDialogComponent = Object.assign(Root, {
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
  createHandle: Dialog.createHandle
});
