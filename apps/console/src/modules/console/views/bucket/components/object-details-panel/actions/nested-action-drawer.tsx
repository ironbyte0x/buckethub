import { createContext, useContext, useState } from 'react';
import { BucketId, FileObject } from '@buckethub/rpc-contract';
import { ResponsiveDialog } from '@buckethub/ui';
import { CopyObjectDialog } from '../../../features/copy-object';
import { MoveObjectDialog } from '../../../features/move-object';
import { PreviewObjectDialog } from '../../../features/preview-object';
import { RenameObjectDialog } from '../../../features/rename-object';
import { ShareObjectDialog } from '../../../features/share-object';

type ActionType = 'copy' | 'move' | 'rename' | 'share' | 'preview';

interface ActionPayload {
  bucketId: BucketId;
  object: FileObject;
}

interface NestedActionDrawerContextValue {
  open: (type: ActionType, payload: ActionPayload) => void;
}

const NestedActionDrawerContext = createContext<NestedActionDrawerContextValue | null>(null);

export function useNestedActionDrawer() {
  return useContext(NestedActionDrawerContext);
}

interface State {
  type: ActionType;
  payload: ActionPayload;
}

export const NestedActionDrawer: React.FunctionComponent<{ children: React.ReactNode }> = ({
  children
}) => {
  const [state, setState] = useState<State | null>(null);

  const open = (type: ActionType, payload: ActionPayload) => {
    setState({ type, payload });
  };

  const close = () => {
    setState(null);
  };

  return (
    <NestedActionDrawerContext value={{ open }}>
      {children}

      <ResponsiveDialog open={!!state} onOpenChange={(open) => !open && close()}>
        {state?.type === 'copy' && (
          <CopyObjectDialog.Content payload={state.payload} onClose={close} />
        )}

        {state?.type === 'move' && (
          <MoveObjectDialog.Content payload={state.payload} onClose={close} />
        )}

        {state?.type === 'rename' && (
          <RenameObjectDialog.Content payload={state.payload} onClose={close} />
        )}

        {state?.type === 'share' && (
          <ShareObjectDialog.Content payload={state.payload} onClose={close} />
        )}

        {state?.type === 'preview' && (
          <PreviewObjectDialog.Content payload={state.payload} onClose={close} />
        )}
      </ResponsiveDialog>
    </NestedActionDrawerContext>
  );
};
