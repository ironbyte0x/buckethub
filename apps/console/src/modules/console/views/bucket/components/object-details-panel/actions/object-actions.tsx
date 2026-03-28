import { CopyIcon, MoveIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { UseRenderComponentProps } from '@base-ui/react/use-render';
import { BucketId, FileObject } from '@buckethub/rpc-contract';
import { Icon, Menu } from '@buckethub/ui';
import { CopyObjectDialog } from '../../../features/copy-object';
import { useDeleteObject } from '../../../features/delete-object';
import { MoveObjectDialog } from '../../../features/move-object';
import { RenameObjectDialog } from '../../../features/rename-object';
import { useNestedActionDrawer } from './nested-action-drawer';

interface ObjectActionsProps extends UseRenderComponentProps<'button'> {
  bucketId: BucketId;
  object: FileObject;
}

export const ObjectActions: React.FunctionComponent<ObjectActionsProps> = ({
  bucketId,
  object,
  render
}) => {
  const deleteObject = useDeleteObject();
  const nestedDrawer = useNestedActionDrawer();

  return (
    <Menu>
      <Menu.Trigger render={render} />

      <Menu.Content align="end" style={{ width: 'var(--anchor-width)' }}>
        {nestedDrawer ? (
          <Menu.Item onClick={() => nestedDrawer.open('copy', { bucketId, object })}>
            <Icon as={CopyIcon} size="sm" />
            Copy
          </Menu.Item>
        ) : (
          <CopyObjectDialog.Trigger
            payload={{ bucketId, object }}
            nativeButton={false}
            render={
              <Menu.Item>
                <Icon as={CopyIcon} size="sm" />
                Copy
              </Menu.Item>
            }
          />
        )}

        {nestedDrawer ? (
          <Menu.Item onClick={() => nestedDrawer.open('move', { bucketId, object })}>
            <Icon as={MoveIcon} size="sm" />
            Move
          </Menu.Item>
        ) : (
          <MoveObjectDialog.Trigger
            payload={{ bucketId, object }}
            nativeButton={false}
            render={
              <Menu.Item>
                <Icon as={MoveIcon} size="sm" />
                Move
              </Menu.Item>
            }
          />
        )}

        {nestedDrawer ? (
          <Menu.Item onClick={() => nestedDrawer.open('rename', { bucketId, object })}>
            <Icon as={PencilIcon} size="sm" />
            Rename
          </Menu.Item>
        ) : (
          <RenameObjectDialog.Trigger
            payload={{ bucketId, object }}
            nativeButton={false}
            render={
              <Menu.Item>
                <Icon as={PencilIcon} size="sm" />
                Rename
              </Menu.Item>
            }
          />
        )}

        <Menu.Separator />

        <Menu.Item variant="destructive" onClick={() => deleteObject(object, bucketId)}>
          <Icon as={Trash2Icon} size="md" />
          Delete
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
};
