import { Suspense, useState } from 'react';
import {
  BucketId,
  BucketTagMapping,
  BucketTagMappingId,
  ConnectionId,
  ConnectionTagMapping,
  ConnectionTagMappingId,
  Tag,
  TagId
} from '@buckethub/rpc-contract';
import { Flex } from '@buckethub/styled-system/jsx';
import { Skeleton } from '@buckethub/ui';
import { CreateTagDialog } from '@/modules/console/features/create-tag';
import { useCollections } from '@/services/collections';
import {
  generateBucketTagMappingId,
  generateConnectionTagMappingId,
  useBucketTags,
  useConnectionTags,
  useTags
} from '@/services/tags';
import { TagsInput } from './tags-input';

export type TagManagerProps =
  | { type: 'bucket'; bucketId: BucketId }
  | { type: 'connection'; connectionId: ConnectionId };

type TagWithMappingId = Tag & { mappingId: BucketTagMappingId | ConnectionTagMappingId };

interface TagManagerContentProps {
  props: TagManagerProps;
  contextTags: TagWithMappingId[];
}

const TagManagerContent: React.FunctionComponent<TagManagerContentProps> = ({
  props,
  contextTags
}) => {
  const { bucketTagsCollection, connectionTagsCollection } = useCollections();
  const { data: allTags } = useTags();

  const [createTagDialogState, setCreateTagDialogState] = useState<{
    open: boolean;
    defaultValue: string;
  }>({
    open: false,
    defaultValue: ''
  });

  async function addTag(tagId: TagId) {
    if (props.type === 'bucket') {
      const transaction = bucketTagsCollection.insert({
        id: generateBucketTagMappingId(),
        bucketId: props.bucketId,
        tagId
      });

      await transaction.isPersisted.promise;
    } else {
      const transaction = connectionTagsCollection.insert({
        id: generateConnectionTagMappingId(),
        connectionId: props.connectionId,
        tagId
      });

      await transaction.isPersisted.promise;
    }
  }

  async function onTagsChange(newTags: Tag[]) {
    const addedTags = newTags.filter(
      (tag) => !contextTags.some((current) => current.id === tag.id)
    );

    const removedTags = contextTags.filter(
      (tag) => !newTags.some((newTag) => newTag.id === tag.id)
    );

    if (props.type === 'bucket') {
      const added = addedTags.map<BucketTagMapping>((tag) => ({
        id: generateBucketTagMappingId(),
        bucketId: props.bucketId,
        tagId: tag.id
      }));

      const removedIds = removedTags.map<BucketTagMappingId>(
        (tag) => tag.mappingId as BucketTagMappingId
      );

      const promises: Promise<unknown>[] = [];

      if (added.length) {
        const transaction = bucketTagsCollection.insert(added);

        promises.push(transaction.isPersisted.promise);
      }

      if (removedIds.length) {
        const transaction = bucketTagsCollection.delete(removedIds);

        promises.push(transaction.isPersisted.promise);
      }

      await Promise.all(promises);
    } else {
      const added = addedTags.map<ConnectionTagMapping>((tag) => ({
        id: generateConnectionTagMappingId(),
        connectionId: props.connectionId,
        tagId: tag.id
      }));

      const removedIds = removedTags.map<ConnectionTagMappingId>(
        (tag) => tag.mappingId as ConnectionTagMappingId
      );

      const promises: Promise<unknown>[] = [];

      if (added.length) {
        const transaction = connectionTagsCollection.insert(added);

        promises.push(transaction.isPersisted.promise);
      }

      if (removedIds.length) {
        const transaction = connectionTagsCollection.delete(removedIds);

        promises.push(transaction.isPersisted.promise);
      }

      await Promise.all(promises);
    }
  }

  return (
    <>
      <TagsInput
        items={allTags}
        value={contextTags}
        onChange={onTagsChange}
        onCreate={(name) => {
          setCreateTagDialogState({
            open: true,
            defaultValue: name
          });
        }}
      />

      <CreateTagDialog
        open={createTagDialogState.open}
        defaultValue={createTagDialogState.defaultValue}
        onOpenChange={(open) => {
          setCreateTagDialogState({
            open,
            defaultValue: ''
          });
        }}
        onSubmit={async (tag) => {
          await addTag(tag.id);

          setCreateTagDialogState({
            open: false,
            defaultValue: ''
          });
        }}
      />
    </>
  );
};

const BucketTagManagerRoot: React.FunctionComponent<{
  bucketId: BucketId;
}> = (props) => {
  const { data: contextTags } = useBucketTags(props.bucketId);

  return (
    <TagManagerContent
      props={{ type: 'bucket', bucketId: props.bucketId }}
      contextTags={contextTags}
    />
  );
};

const ConnectionTagManagerRoot: React.FunctionComponent<{
  connectionId: ConnectionId;
}> = (props) => {
  const { data: contextTags } = useConnectionTags(props.connectionId);

  return (
    <TagManagerContent
      props={{ type: 'connection', connectionId: props.connectionId }}
      contextTags={contextTags}
    />
  );
};

const Root: React.FunctionComponent<TagManagerProps> = (props) => {
  if (props.type === 'bucket') {
    return <BucketTagManagerRoot bucketId={props.bucketId} />;
  }

  return <ConnectionTagManagerRoot connectionId={props.connectionId} />;
};

export const TagManager: React.FunctionComponent<TagManagerProps> = (props) => {
  return (
    <Suspense
      fallback={
        <Flex css={{ gap: '1', paddingBlock: '1.5' }}>
          <Skeleton css={{ width: '60px', height: '6' }} />
          <Skeleton css={{ width: '80px', height: '6' }} />
          <Skeleton css={{ width: '60px', height: '6' }} />
        </Flex>
      }
    >
      <Root {...props} />
    </Suspense>
  );
};
