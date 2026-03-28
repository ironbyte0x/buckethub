import { useRef } from 'react';
import {
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  FileTextIcon,
  Loader2Icon,
  MoveIcon,
  PencilIcon,
  Share2Icon,
  Trash2Icon
} from 'lucide-react';
import { MenuRoot } from '@base-ui/react/menu';
import { UseRenderComponentProps } from '@base-ui/react/use-render';
import { BucketId, FileObject } from '@buckethub/rpc-contract';
import { Icon, Menu } from '@buckethub/ui';
import { Link } from '@tanstack/react-router';
import { usePreloadPreview } from '@/services/objects';
import { CopyObjectDialog } from '../../features/copy-object';
import { useDeleteObject } from '../../features/delete-object';
import { useDownloadObject } from '../../features/download-object';
import { MoveObjectDialog } from '../../features/move-object';
import { PreviewObjectDialog } from '../../features/preview-object';
import { RenameObjectDialog } from '../../features/rename-object';
import { ShareObjectDialog } from '../../features/share-object';

interface FileRowActionsProps extends UseRenderComponentProps<'button'> {
  bucketId: BucketId;
  object: FileObject;
}

export const FileRowActions: React.FunctionComponent<FileRowActionsProps> = ({
  bucketId,
  object,
  render
}) => {
  const deleteObject = useDeleteObject();
  const downloadObject = useDownloadObject();
  const { preload, isLoading } = usePreloadPreview();
  const menuActionsRef = useRef<MenuRoot.Actions>(null);

  return (
    <Menu actionsRef={menuActionsRef}>
      <Menu.Trigger render={render} />

      <Menu.Content align="end">
        <Menu.Item
          closeOnClick={false}
          disabled={isLoading}
          onClick={async () => {
            await preload({ bucketId, key: object.key || '' });
            menuActionsRef.current?.close();
            PreviewObjectDialog.handle.openWithPayload({ bucketId, object });
          }}
        >
          <Icon
            as={isLoading ? Loader2Icon : EyeIcon}
            size="md"
            css={isLoading ? { animation: 'spin 1s linear infinite' } : undefined}
          />
          Preview
        </Menu.Item>

        <Menu.Item onClick={() => downloadObject(object, bucketId)}>
          <Icon as={DownloadIcon} size="md" />
          Download
        </Menu.Item>

        <ShareObjectDialog.Trigger
          payload={{
            bucketId,
            object
          }}
          nativeButton={false}
          render={
            <Menu.Item>
              <Icon as={Share2Icon} size="md" />
              Share
            </Menu.Item>
          }
        />

        <Menu.Separator />

        <CopyObjectDialog.Trigger
          payload={{
            bucketId,
            object
          }}
          nativeButton={false}
          render={
            <Menu.Item>
              <Icon as={CopyIcon} size="sm" />
              Copy
            </Menu.Item>
          }
        />

        <MoveObjectDialog.Trigger
          payload={{
            bucketId,
            object
          }}
          nativeButton={false}
          render={
            <Menu.Item>
              <Icon as={MoveIcon} size="sm" />
              Move
            </Menu.Item>
          }
        />

        <RenameObjectDialog.Trigger
          payload={{
            bucketId,
            object
          }}
          nativeButton={false}
          render={
            <Menu.Item>
              <Icon as={PencilIcon} size="sm" />
              Rename
            </Menu.Item>
          }
        />

        <Menu.Separator />

        <Link
          to="/buckets/$bucketId/{-$key}"
          params={{
            bucketId: bucketId.toString(),
            key: object.key
          }}
        >
          <Menu.Item>
            <Icon as={FileTextIcon} size="md" />
            Details
          </Menu.Item>
        </Link>

        <Menu.Separator />

        <Menu.Item variant="destructive" onClick={() => deleteObject(object, bucketId)}>
          <Icon as={Trash2Icon} size="md" />
          Delete
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
};
