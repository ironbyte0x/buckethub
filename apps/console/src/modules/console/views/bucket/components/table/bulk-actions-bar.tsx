import { DownloadIcon, Trash2Icon, XIcon } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { BucketId, Object } from '@buckethub/rpc-contract';
import { alert, Button, Icon, IconButton, Text, toast } from '@buckethub/ui';
import { ORPCError } from '@orpc/client';
import {
  useDeleteObject as useDeleteObjectMutation,
  useDownloadUrl,
  useObjectsImperative
} from '@/services/objects';
import { downloadFile } from '@/shared/utils';
import { useZipDownloader } from '../../features/download-zip';
import { StyledBulkActionsBar } from './bulk-actions-bar.styled';

interface ZipFile {
  key: string;
  name: string;
  zipPath: string;
}

interface BulkActionsBarProps {
  bucketId: BucketId;
  selectedObjects: Object[];
  onClearSelection: () => void;
}

export const BulkActionsBar: React.FunctionComponent<BulkActionsBarProps> = ({
  bucketId,
  selectedObjects,
  onClearSelection
}) => {
  const { mutateAsync: getDownloadUrl } = useDownloadUrl();
  const { mutateAsync: deleteObject } = useDeleteObjectMutation();
  const { downloadAndZip } = useZipDownloader();
  const getObjects = useObjectsImperative();

  const getAllFilesRecursively = async (prefix: string, basePath = ''): Promise<ZipFile[]> => {
    const pages = await getObjects({
      bucketId,
      prefix
    });
    const objects = pages.flat();
    const files: ZipFile[] = [];

    for (const object of objects) {
      if (object.type === 'file') {
        const fileName = object.name;
        const relativePath = object.key.replace(prefix, '');
        const zipPath = basePath ? `${basePath}${relativePath}` : fileName;

        files.push({
          key: object.key,
          name: fileName,
          zipPath
        });
      } else if (object.type === 'folder') {
        const subFolderRelativePath = object.key.replace(prefix, '');
        const newBasePath = basePath ? `${basePath}${subFolderRelativePath}` : `${object.name}/`;
        const subFiles = await getAllFilesRecursively(object.key, newBasePath);

        files.push(...subFiles);
      }
    }

    return files;
  };

  const onDownload = async () => {
    const allFiles: ZipFile[] = [];

    for (const object of selectedObjects) {
      if (object.type === 'file') {
        allFiles.push({
          key: object.key,
          name: object.name,
          zipPath: object.name
        });
      } else if (object.type === 'folder') {
        const folderFiles = await getAllFilesRecursively(object.key, `${object.name}/`);

        allFiles.push(...folderFiles);
      }
    }

    if (allFiles.length === 0) {
      return;
    }

    if (allFiles.length === 1) {
      const { url } = await getDownloadUrl({
        bucketId,
        key: allFiles[0].key
      });

      downloadFile(url, allFiles[0].name);

      return;
    }

    await downloadAndZip(
      bucketId,
      allFiles.map((file) => ({ key: file.key, zipPath: file.zipPath })),
      `download-${Date.now()}.zip`
    );
  };

  const onDelete = () => {
    const count = selectedObjects.length;

    alert({
      title: 'Delete Objects',
      description: (
        <>
          Are you sure you want to delete{' '}
          <Text color="base" variant="body-large-emphasized">
            {count} {count === 1 ? 'object' : 'objects'}
          </Text>
          ?
          <br />
          This action cannot be undone.
        </>
      ),
      actions: {
        confirm: {
          label: 'Delete',
          variant: 'destructive',
          onClick: async () => {
            for (const object of selectedObjects) {
              if (object.key) {
                try {
                  await deleteObject({
                    bucketId,
                    key: object.key
                  });
                } catch (error) {
                  if (error instanceof ORPCError) {
                    toast.error({
                      title: 'Error deleting object',
                      description: error.message
                    });
                  }
                }
              }
            }

            onClearSelection();
          }
        }
      }
    });
  };

  return (
    <AnimatePresence>
      {selectedObjects.length > 0 && (
        <StyledBulkActionsBar
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        >
          <Text
            variant="body-medium-emphasized"
            css={{
              marginRight: '1',
              whiteSpace: 'nowrap'
            }}
          >
            {selectedObjects.length} selected
          </Text>

          <Button variant="secondary" size="sm" onClick={onDownload}>
            <Icon as={DownloadIcon} size="sm" />
            Download
          </Button>

          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Icon as={Trash2Icon} size="sm" />
            Delete
          </Button>

          <IconButton
            variant="ghost"
            size="xs"
            css={{ marginRight: '-2' }}
            onClick={onClearSelection}
          >
            <Icon as={XIcon} size="sm" color="neutral" />
          </IconButton>
        </StyledBulkActionsBar>
      )}
    </AnimatePresence>
  );
};
