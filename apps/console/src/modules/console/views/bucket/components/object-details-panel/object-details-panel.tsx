import { Suspense } from 'react';
import { DownloadIcon, EyeIcon, MoreHorizontalIcon, Share2Icon } from 'lucide-react';
import { Button, DescriptionList, Drawer, Icon, useMediaQuery } from '@buckethub/ui';
import { useNavigate } from '@tanstack/react-router';
import { useObject, usePreloadPreview } from '@/services/objects';
import { getIsFileKey, getKeyPrefix } from '@/shared/lib';
import { formatBytes, relativeTime } from '@/shared/utils';
import { SidePanel } from '../../../../layout/side-panel';
import { useDownloadObject } from '../../features/download-object';
import { PreviewObjectDialog } from '../../features/preview-object';
import { ShareObjectDialog } from '../../features/share-object';
import { useNavigationData } from '../../use-navigation-data';
import { NestedActionDrawer, ObjectActions, useNestedActionDrawer } from './actions';
import { ErrorBoundary } from './error-boundary';
import { ObjectDetailsPanelLoadingFallback } from './loading';

type Variant = 'side-panel' | 'drawer';

const ObjectDetailsPanelContent: React.FunctionComponent<{
  objectKey: string;
  variant: Variant;
}> = ({ objectKey, variant }) => {
  const { bucketId } = useNavigationData();

  const { data: object } = useObject({
    bucketId,
    key: objectKey
  });

  const downloadObject = useDownloadObject();
  const nestedDrawer = useNestedActionDrawer();
  const { preload, isLoading } = usePreloadPreview();

  const ContentWrapper = variant === 'drawer' ? Drawer.Body : SidePanel.Content;
  const ActionsWrapper = variant === 'drawer' ? Drawer.Footer : SidePanel.Group;

  if (!object) {
    return (
      <ContentWrapper>
        <DescriptionList>
          <DescriptionList.Item>
            <DescriptionList.Term>Error</DescriptionList.Term>
            <DescriptionList.Description>Object not found</DescriptionList.Description>
          </DescriptionList.Item>
        </DescriptionList>
      </ContentWrapper>
    );
  }

  return (
    <>
      <ContentWrapper>
        <DescriptionList>
          <DescriptionList.Item>
            <DescriptionList.Term>Name</DescriptionList.Term>
            <DescriptionList.Description>{object.name}</DescriptionList.Description>
          </DescriptionList.Item>

          {object.size !== undefined && (
            <DescriptionList.Item>
              <DescriptionList.Term>Size</DescriptionList.Term>
              <DescriptionList.Description>{formatBytes(object.size)}</DescriptionList.Description>
            </DescriptionList.Item>
          )}

          {object.lastModified && (
            <DescriptionList.Item>
              <DescriptionList.Term>Last Modified</DescriptionList.Term>
              <DescriptionList.Description>
                {relativeTime(object.lastModified)}
              </DescriptionList.Description>
            </DescriptionList.Item>
          )}

          {object.contentType && (
            <DescriptionList.Item>
              <DescriptionList.Term>Content Type</DescriptionList.Term>
              <DescriptionList.Description>{object.contentType}</DescriptionList.Description>
            </DescriptionList.Item>
          )}

          {object.storageClass && (
            <DescriptionList.Item>
              <DescriptionList.Term>Storage Class</DescriptionList.Term>
              <DescriptionList.Description>{object.storageClass}</DescriptionList.Description>
            </DescriptionList.Item>
          )}

          {object.eTag && (
            <DescriptionList.Item>
              <DescriptionList.Term>ETag</DescriptionList.Term>
              <DescriptionList.Description>
                {object.eTag.replace(/"/g, '')}
              </DescriptionList.Description>
            </DescriptionList.Item>
          )}
        </DescriptionList>
      </ContentWrapper>

      <ActionsWrapper css={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5' }}>
        <Button
          variant="primary"
          size="sm"
          css={{ gridColumn: 'span 2' }}
          loading={isLoading}
          onClick={async () => {
            await preload({ bucketId, key: object.key || '' });

            if (nestedDrawer) {
              nestedDrawer.open('preview', { bucketId, object });
            } else {
              PreviewObjectDialog.handle.openWithPayload({ bucketId, object });
            }
          }}
        >
          <Icon as={EyeIcon} size="md" />
          Preview
        </Button>

        {nestedDrawer ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => nestedDrawer.open('share', { bucketId, object })}
          >
            <Icon as={Share2Icon} size="md" />
            Share
          </Button>
        ) : (
          <ShareObjectDialog.Trigger
            payload={{
              bucketId,
              object
            }}
            render={
              <Button variant="secondary" size="sm">
                <Icon as={Share2Icon} size="md" />
                Share
              </Button>
            }
          />
        )}

        <Button variant="secondary" size="sm" onClick={() => downloadObject(object, bucketId)}>
          <Icon as={DownloadIcon} size="md" />
          Download
        </Button>

        <ObjectActions
          bucketId={bucketId}
          object={object}
          render={
            <Button variant="secondary" size="sm" css={{ gridColumn: 'span 2' }}>
              <Icon as={MoreHorizontalIcon} size="md" />
              More
            </Button>
          }
        />
      </ActionsWrapper>
    </>
  );
};

export const ObjectDetailsPanel: React.FunctionComponent = () => {
  const { key } = useNavigationData();

  const navigate = useNavigate({
    from: '/buckets/$bucketId/{-$key}'
  });

  const isFile = getIsFileKey(key);
  const folderPath = getKeyPrefix(key);
  const isMobile = useMediaQuery('(max-width: 1023px)');

  const onClose = () => {
    navigate({
      params: (old) => ({
        ...old,
        key: folderPath
      })
    });
  };

  if (isMobile) {
    return (
      <Drawer
        open={!!isFile}
        position="bottom"
        onOpenChange={(open) => {
          if (!open) {
            onClose();
          }
        }}
      >
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Object Details</Drawer.Title>
            <Drawer.Close />
          </Drawer.Header>

          <NestedActionDrawer>
            <ErrorBoundary key={key} wrapper={Drawer.Body}>
              <Suspense fallback={<ObjectDetailsPanelLoadingFallback variant="drawer" />}>
                {isFile && key && <ObjectDetailsPanelContent objectKey={key} variant="drawer" />}
              </Suspense>
            </ErrorBoundary>
          </NestedActionDrawer>
        </Drawer.Content>
      </Drawer>
    );
  }

  return (
    <SidePanel open={!!isFile} onOpenChange={onClose}>
      <SidePanel.Panel>
        <SidePanel.Header>
          <SidePanel.Title>Object Details</SidePanel.Title>
          <SidePanel.Close />
        </SidePanel.Header>

        <ErrorBoundary key={key} wrapper={SidePanel.Content}>
          <Suspense fallback={<ObjectDetailsPanelLoadingFallback variant="side-panel" />}>
            {isFile && key && <ObjectDetailsPanelContent objectKey={key} variant="side-panel" />}
          </Suspense>
        </ErrorBoundary>
      </SidePanel.Panel>
    </SidePanel>
  );
};
