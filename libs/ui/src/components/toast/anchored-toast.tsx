import { Toast } from '@base-ui/react/toast';
import { StyledRoot } from './anchored-toast.styled';

export const AnchoredToasts = () => {
  const { toasts } = Toast.useToastManager();

  return (
    <Toast.Portal>
      <Toast.Viewport>
        {toasts.map((toast) => (
          <Toast.Positioner key={toast.id} toast={toast} style={{ zIndex: 2000 }}>
            <StyledRoot toast={toast}>
              <Toast.Content>
                <Toast.Description />
              </Toast.Content>
            </StyledRoot>
          </Toast.Positioner>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
};
