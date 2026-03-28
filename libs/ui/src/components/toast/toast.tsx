import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  XIcon
} from 'lucide-react';
import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { Icon } from '../icon';
import {
  StyledToastAction,
  StyledToastBody,
  StyledToastClose,
  StyledToastContent,
  StyledToastDescription,
  StyledToastIcon,
  StyledToastRoot,
  StyledToastTitle,
  StyledToastViewport
} from './toast.styled';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default';

const toastIcons: Record<Exclude<ToastType, 'default'>, typeof CheckCircle2Icon> = {
  success: CheckCircle2Icon,
  error: AlertCircleIcon,
  warning: AlertTriangleIcon,
  info: InfoIcon
};

const Provider: React.FunctionComponent<React.ComponentProps<typeof ToastPrimitive.Provider>> =
  ToastPrimitive.Provider;

interface ViewportProps extends Omit<React.ComponentProps<typeof StyledToastViewport>, 'children'> {
  children?: (toast: ToastPrimitive.Root.ToastObject) => React.ReactNode;
}

const Viewport: React.FunctionComponent<ViewportProps> = ({ children, ...props }) => {
  const { toasts } = ToastPrimitive.useToastManager();

  return (
    <ToastPrimitive.Portal>
      <StyledToastViewport {...props}>
        {toasts.map((toast) =>
          children ? (
            children(toast)
          ) : (
            <Root key={toast.id} toast={toast}>
              <Content type={(toast.type as ToastType) || 'default'}>
                {toast.title && <Title>{toast.title}</Title>}
                {toast.description && <Description>{toast.description}</Description>}
              </Content>

              <Close />
            </Root>
          )
        )}
      </StyledToastViewport>
    </ToastPrimitive.Portal>
  );
};

const Root: React.FunctionComponent<React.ComponentProps<typeof StyledToastRoot>> = StyledToastRoot;

interface ContentProps extends Omit<React.ComponentProps<typeof StyledToastContent>, 'variant'> {
  type?: ToastType;
}

const Content: React.FunctionComponent<ContentProps> = ({
  type = 'default',
  children,
  ...props
}) => {
  const IconComponent = type === 'default' ? null : toastIcons[type];

  return (
    <StyledToastContent variant={type} {...props}>
      {IconComponent && (
        <StyledToastIcon data-slot="toast-type-icon">
          <Icon as={IconComponent} size="sm" />
        </StyledToastIcon>
      )}

      <StyledToastBody>{children}</StyledToastBody>
    </StyledToastContent>
  );
};

const Title: React.FunctionComponent<React.ComponentProps<typeof StyledToastTitle>> =
  StyledToastTitle;

const Description: React.FunctionComponent<React.ComponentProps<typeof StyledToastDescription>> =
  StyledToastDescription;

const Close: React.FunctionComponent<React.ComponentProps<typeof StyledToastClose>> = (props) => {
  return (
    <StyledToastClose {...props}>
      <Icon as={XIcon} size="xs" />
    </StyledToastClose>
  );
};

const Action: React.FunctionComponent<React.ComponentProps<typeof StyledToastAction>> =
  StyledToastAction;

Provider.displayName = 'Toast.Provider';
Viewport.displayName = 'Toast.Viewport';
Root.displayName = 'Toast.Root';
Content.displayName = 'Toast.Content';
Title.displayName = 'Toast.Title';
Description.displayName = 'Toast.Description';
Close.displayName = 'Toast.Close';
Action.displayName = 'Toast.Action';

export const Toast = Object.assign(Provider, {
  Provider,
  Viewport,
  Root,
  Content,
  Title,
  Description,
  Close,
  Action,
  useToastManager: ToastPrimitive.useToastManager
});
