import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { FileIcon, FolderIcon } from 'lucide-react';
import { Box, Flex } from '@buckethub/styled-system/jsx';
import { Button, Checkbox, Icon, ScrollArea, State, Table } from '@buckethub/ui';
import { useNavigate } from '@tanstack/react-router';
import { useVirtualizer } from '@tanstack/react-virtual';
import BucketIcon from '@/assets/icons/bucket.svg?react';
import { UploadButton } from '@/modules/console/components/upload-button';
import { useObjects } from '@/services/objects';
import { useNavigationData } from '../../use-navigation-data';
import { BulkActionsBar } from './bulk-actions-bar';
import { DateTooltip } from './date-tooltip';
import { FileRow } from './file-row';
import { FolderRow } from './folder-row';
import { TableLoadingFallback } from './loading';

export const ObjectsTable: React.FunctionComponent = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <ScrollArea css={{ width: '100%', flex: '1' }}>
        <ScrollArea.Viewport ref={scrollRef}>
          <ScrollArea.Content
            css={{
              '&[data-has-overflow-x]': {
                paddingBottom: 'var(--scrollbar-size)'
              }
            }}
          >
            <Suspense fallback={<TableLoadingFallback />}>
              <ObjectsTableContent scrollRef={scrollRef} />
            </Suspense>
          </ScrollArea.Content>

          <ScrollArea.GradientPart position="top" css={{ top: '10' }} />
          <ScrollArea.GradientPart position="right" />
          <ScrollArea.GradientPart position="bottom" />
          <ScrollArea.GradientPart position="left" />
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar orientation="vertical" css={{ paddingTop: '11' }}>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>

        <ScrollArea.Scrollbar orientation="horizontal">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea>

      <DateTooltip />
    </>
  );
};

interface ObjectsTableContentProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

const ObjectsTableContent: React.FunctionComponent<ObjectsTableContentProps> = ({ scrollRef }) => {
  const { bucketId, search, prefix } = useNavigationData();
  const { data: objects, isFetching } = useObjects({ bucketId, prefix });

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set());

  const fuse = useMemo(
    () =>
      new Fuse(objects, {
        keys: ['name'],
        threshold: 0.3
      }),
    [objects]
  );

  const filteredObjects = useMemo(
    () => (search ? fuse.search(search).map((result) => result.item) : objects),
    [fuse, objects, search]
  );

  const allSelected =
    filteredObjects.length > 0 &&
    filteredObjects.every((object) => object.key && selectedKeys.has(object.key));

  const someSelected =
    filteredObjects.some((object) => object.key && selectedKeys.has(object.key)) && !allSelected;

  const selectedObjects = useMemo(
    () => filteredObjects.filter((object) => object.key && selectedKeys.has(object.key)),
    [filteredObjects, selectedKeys]
  );

  const toggleSelection = useCallback((key: string) => {
    setSelectedKeys((previous) => {
      const next = new Set(previous);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelectedKeys(new Set());
    } else {
      const allKeys = filteredObjects.map((object) => object.key).filter(Boolean) as string[];

      setSelectedKeys(new Set(allKeys));
    }
  }, [allSelected, filteredObjects]);

  const clearSelection = useCallback(() => {
    setSelectedKeys(new Set());
  }, []);

  const virtualizer = useVirtualizer({
    count: filteredObjects.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 44,
    overscan: 10
  });

  useEffect(() => {
    setSelectedKeys(new Set());
  }, [bucketId, prefix]);

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <Table css={{ tableLayout: 'fixed', minWidth: '900px' }}>
      <Table.Header
        css={{ position: 'sticky', top: '-1px', zIndex: 1, backgroundColor: 'background-base' }}
      >
        <Table.Row>
          <Table.Head css={{ width: '50px' }}>
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={toggleAll}
            />
          </Table.Head>

          <Table.Head>Object</Table.Head>
          <Table.Head css={{ width: '200px' }}>Type</Table.Head>
          {/* <Table.Head css={{ width: '120px' }}>Storage class</Table.Head> */}
          <Table.Head css={{ width: '140px' }}>Size</Table.Head>
          <Table.Head css={{ width: '220px' }}>Modified</Table.Head>
          <Table.Head css={{ width: '60px' }}>
            <Box css={{ srOnly: true }}>Actions</Box>
          </Table.Head>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {filteredObjects.length ? (
          <>
            {virtualItems.length > 0 && <tr style={{ height: virtualItems[0].start }} />}

            {virtualItems.map((virtualRow) => {
              const object = filteredObjects[virtualRow.index];

              if (object.type === 'folder') {
                return (
                  <FolderRow
                    key={object.key}
                    bucketId={bucketId}
                    object={object}
                    selected={!!object.key && selectedKeys.has(object.key)}
                    onSelectionChange={toggleSelection}
                  />
                );
              }

              return (
                <FileRow
                  key={object.key}
                  bucketId={bucketId}
                  object={object}
                  selected={!!object.key && selectedKeys.has(object.key)}
                  onSelectionChange={toggleSelection}
                />
              );
            })}

            {virtualItems.length > 0 && (
              <tr
                style={{
                  height: virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
                }}
              />
            )}
          </>
        ) : isFetching ? (
          <TableLoadingFallback />
        ) : (
          <Flex
            css={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '80%',
              padding: '6'
            }}
          >
            {search?.length ? (
              <SearchEmptyState search={search} />
            ) : prefix ? (
              <FolderEmptyState />
            ) : (
              <EmptyBucketState />
            )}
          </Flex>
        )}
      </Table.Body>

      <BulkActionsBar
        bucketId={bucketId}
        selectedObjects={selectedObjects}
        onClearSelection={clearSelection}
      />
    </Table>
  );
};

interface SearchEmptyStateProps {
  search: string;
}

const SearchEmptyState: React.FunctionComponent<SearchEmptyStateProps> = ({ search }) => {
  const navigate = useNavigate();

  return (
    <State css={{ margin: 'auto' }}>
      <State.Header>
        <State.Media variant="icon">
          <Icon as={FileIcon} size="xl" />
        </State.Media>

        <State.Title>No objects found</State.Title>

        <State.Description>
          Your search “{search}” did not match any objects. Please try again.
        </State.Description>
      </State.Header>

      <State.Content>
        <State.Actions>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              navigate({
                from: '/buckets/$bucketId/{-$key}',
                params: (parameters) => parameters,
                replace: true
              });
            }}
          >
            Clear search
          </Button>
        </State.Actions>
      </State.Content>
    </State>
  );
};

const FolderEmptyState: React.FunctionComponent = () => {
  return (
    <State css={{ margin: 'auto' }}>
      <State.Header>
        <State.Media variant="icon">
          <Icon as={FolderIcon} size="xl" />
        </State.Media>

        <State.Title>This folder is empty</State.Title>

        <State.Description>Upload files or create folders to get started.</State.Description>
      </State.Header>

      <State.Content>
        <State.Actions>
          <UploadButton variant="primary" size="sm" />
        </State.Actions>
      </State.Content>
    </State>
  );
};

const EmptyBucketState: React.FunctionComponent = () => {
  return (
    <State css={{ margin: 'auto' }}>
      <State.Header>
        <State.Media variant="icon">
          <Icon as={BucketIcon} size="xl" />
        </State.Media>

        <State.Title>This bucket is empty</State.Title>

        <State.Description>
          This bucket doesn’t contain any objects yet. Start by uploading files or creating folders
          to organize your data.
        </State.Description>
      </State.Header>

      <State.Content>
        <State.Actions>
          <UploadButton variant="primary" size="sm" />
        </State.Actions>
      </State.Content>
    </State>
  );
};
