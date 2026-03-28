import { BucketId, FileObject } from '@buckethub/rpc-contract';
import { useDownloadUrl } from '@/services/objects';
import { downloadFile } from '@/shared/utils';

export function useDownloadObject() {
  const { mutateAsync: getDownloadUrl } = useDownloadUrl();

  return async (object: FileObject, bucketId: BucketId) => {
    const { url } = await getDownloadUrl({
      bucketId,
      key: object.key || ''
    });

    downloadFile(url, object.name);
  };
}
