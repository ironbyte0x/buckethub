import { useMemo } from 'react';
import { BucketId, FileObject } from '@buckethub/rpc-contract';
import { usePreviewUrl } from '@/services/objects';
import { AudioPreview } from './previews/audio';
import { ImagePreview } from './previews/image';
import { PdfPreview } from './previews/pdf';
import { TextPreview } from './previews/text';
import { UnsupportedPreview } from './previews/unsupported';
import { VideoPreview } from './previews/video';

const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const videoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'application/mp4'];
const audioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
const textTypes = [
  'text/plain',
  'application/json',
  'application/xml',
  'text/html',
  'text/css',
  'text/javascript',
  'application/javascript'
];

export const PreviewContent: React.FunctionComponent<{
  bucketId: BucketId;
  object: FileObject;
}> = ({ bucketId, object }) => {
  const { data } = usePreviewUrl({
    bucketId,
    key: object.key || ''
  });

  const previewType = useMemo(() => {
    const contentType = data.contentType || '';

    if (imageTypes.includes(contentType)) {
      return 'image';
    }

    if (videoTypes.includes(contentType)) {
      return 'video';
    }

    if (audioTypes.includes(contentType)) {
      return 'audio';
    }

    if (contentType === 'application/pdf') {
      return 'pdf';
    }

    if (textTypes.includes(contentType) || contentType.startsWith('text/')) {
      return 'text';
    }

    return 'unsupported';
  }, [data.contentType]);

  if (previewType === 'image') {
    return <ImagePreview url={data.url} alt={object.name} />;
  }

  if (previewType === 'video') {
    return <VideoPreview url={data.url} title={object.name} />;
  }

  if (previewType === 'audio') {
    return <AudioPreview url={data.url} title={object.name} />;
  }

  if (previewType === 'pdf') {
    return <PdfPreview url={data.url} title={object.name} />;
  }

  if (previewType === 'text') {
    return <TextPreview url={data.url} />;
  }

  return <UnsupportedPreview contentType={data.contentType} />;
};
