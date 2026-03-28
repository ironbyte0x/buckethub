import { useId, useMemo } from 'react';
import { FileUpIcon, FolderUpIcon, UploadIcon } from 'lucide-react';
import { BucketId } from '@buckethub/rpc-contract';
import { Button, Icon, Menu } from '@buckethub/ui';
import { useParams } from '@tanstack/react-router';
import { getKeyPrefix } from '@/shared/lib';
import { useUploader } from '../../features/upload';

interface UploadButtonProps {
  variant?: React.ComponentProps<typeof Button>['variant'];
  size?: React.ComponentProps<typeof Button>['size'];
}

export const UploadButton: React.FunctionComponent<UploadButtonProps> = (props) => {
  const fileInputId = useId();
  const folderInputId = useId();

  const { bucketId, key } = useParams({
    from: '/main-layout/buckets/$bucketId/{-$key}'
  });
  const { uploadFiles } = useUploader();

  const prefix = useMemo(() => getKeyPrefix(key), [key]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }

    const files = Array.from(event.target.files).map((file) => ({
      bucketId: bucketId as BucketId,
      prefix,
      file,
      name: file.name,
      path: ''
    }));

    uploadFiles(files);

    event.target.value = '';
  };

  const onFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }

    const files = Array.from(event.target.files).map((file) => {
      const pathParts = file.webkitRelativePath.split('/');

      pathParts.pop();

      const path = pathParts.length > 0 ? pathParts.join('/') + '/' : '';

      return {
        bucketId: bucketId as BucketId,
        prefix,
        file,
        name: file.name,
        path
      };
    });

    uploadFiles(files);

    event.target.value = '';
  };

  return (
    <>
      <Menu>
        <Menu.Trigger
          render={
            <Button {...props}>
              <Icon as={UploadIcon} size="sm" />
              Upload
            </Button>
          }
        />

        <Menu.Content css={{ minWidth: 'unset' }} align="center">
          <Menu.Item render={<label htmlFor={fileInputId} />}>
            <Icon as={FileUpIcon} />
            Upload file
          </Menu.Item>

          <Menu.Item render={<label htmlFor={folderInputId} />}>
            <Icon as={FolderUpIcon} />
            Upload folder
          </Menu.Item>
        </Menu.Content>
      </Menu>

      <input
        id={fileInputId}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={onFileChange}
      />

      <input
        id={folderInputId}
        type="file"
        multiple
        // @ts-expect-error - webkitdirectory is a non-standard attribute
        webkitdirectory=""
        directory=""
        style={{ display: 'none' }}
        onChange={onFolderChange}
      />
    </>
  );
};
