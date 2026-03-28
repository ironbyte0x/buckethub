import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { FolderPlusIcon } from 'lucide-react';
import { BucketId } from '@buckethub/rpc-contract';
import { Flex } from '@buckethub/styled-system/jsx';
import { Button, Icon, SearchInput, Skeleton } from '@buckethub/ui';
import { useDebouncedCallback } from '@tanstack/react-pacer';
import { useNavigate } from '@tanstack/react-router';
import { useBucket, useBucketMetrics } from '@/services/buckets';
import { formatBytes, getFilesFromDropEvent } from '@/shared/utils';
import { PageHeader } from '../../components/page-header';
import { UploadButton } from '../../components/upload-button';
import { UploadPanel, useUploader } from '../../features/upload';
import { View } from '../../layout';
import { Breadcrumbs } from './components/breadcrumbs';
import { ObjectDetailsPanel } from './components/object-details-panel';
import { RefreshButton } from './components/refresh-button';
import { ObjectsTable } from './components/table/table';
import { CopyObjectDialog } from './features/copy-object';
import { DownloadZipPanel } from './features/download-zip';
import { MoveObjectDialog } from './features/move-object';
import { NewFolderDialog } from './features/new-folder';
import { PreviewObjectDialog } from './features/preview-object';
import { RenameObjectDialog } from './features/rename-object';
import { ShareObjectDialog } from './features/share-object';
import { useNavigationData } from './use-navigation-data';
import { StyledContainer } from './view.styled';

const BucketMetrics: React.FunctionComponent<{ bucketId: BucketId }> = ({ bucketId }) => {
  const { data: metrics } = useBucketMetrics({ id: bucketId });
  const formattedSize = useMemo(() => formatBytes(metrics.totalSize), [metrics.totalSize]);
  const qualifier = metrics.isComplete ? '' : '+';

  return (
    <>
      {formattedSize}
      {qualifier} • {metrics.totalObjects.toLocaleString()}
      {qualifier} objects
    </>
  );
};

export const BucketView: React.FunctionComponent = () => {
  const { bucketId, prefix, search } = useNavigationData();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate({
    from: '/buckets/$bucketId/{-$key}'
  });

  const { data: bucket } = useBucket({ id: bucketId });
  const { uploadFiles } = useUploader();
  const [isDragging, setIsDragging] = useState(false);

  const onSearchChange = useDebouncedCallback(
    (value: string) => {
      navigate({
        search: { search: value || undefined },
        replace: true
      });
    },
    {
      wait: 100
    }
  );

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  };

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const files = await getFilesFromDropEvent(event);

    if (files.length === 0) {
      return;
    }

    uploadFiles(
      files.map((file) => ({
        bucketId: bucketId,
        prefix,
        path: file.path,
        name: file.file.name,
        file: file.file
      }))
    );
  };

  useEffect(() => {
    if (!search && searchInputRef.current) {
      searchInputRef.current.value = '';
    }
  }, [search]);

  return (
    <View css={{ flexDirection: 'row', overflowY: 'auto' }}>
      <StyledContainer
        dragging={isDragging}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <PageHeader>
          <PageHeader.Info>
            <PageHeader.Info.Title>{bucket.name}</PageHeader.Info.Title>
            <PageHeader.Info.Subtitle as="div">
              <Suspense
                fallback={<Skeleton css={{ display: 'block', width: '180px', height: '5' }} />}
              >
                <BucketMetrics bucketId={bucketId} />
              </Suspense>
            </PageHeader.Info.Subtitle>
          </PageHeader.Info>
        </PageHeader>

        <Flex
          css={{
            flexWrap: 'wrap',
            gap: '2.5',
            paddingInline: 'var(--view-inline-padding)'
          }}
        >
          <SearchInput
            ref={searchInputRef}
            placeholder="Search objects..."
            defaultValue={search ?? ''}
            css={{
              height: '8',

              sm: {
                maxWidth: '280px'
              }
            }}
            onChange={onSearchChange}
          />

          <Flex css={{ flexWrap: 'wrap', gap: '2.5' }}>
            <NewFolderDialog>
              <NewFolderDialog.Trigger
                render={
                  <Button variant="secondary" size="sm">
                    <Icon as={FolderPlusIcon} size="sm" />
                    New folder
                  </Button>
                }
              />
            </NewFolderDialog>

            <UploadButton variant="secondary" size="sm" />
            <RefreshButton />
          </Flex>
        </Flex>

        <Breadcrumbs />
        <ObjectsTable />
      </StyledContainer>

      <ObjectDetailsPanel key={bucket.id} />

      <UploadPanel />
      <DownloadZipPanel />

      <PreviewObjectDialog />
      <CopyObjectDialog />
      <MoveObjectDialog />
      <RenameObjectDialog />
      <ShareObjectDialog />
    </View>
  );
};
