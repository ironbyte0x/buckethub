import { FolderIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { Bucket } from '@buckethub/rpc-contract';
import { Flex } from '@buckethub/styled-system/jsx';
import { alert, Badge, Icon, IconButton, Text } from '@buckethub/ui';
import { Link } from '@tanstack/react-router';
import { EditBucketDialog } from '@/modules/console/features/edit-bucket';
import { useCollections } from '@/services/collections';
import { useBucketTags } from '@/services/tags';
import { StyledBucketIcon, StyledBucketItem } from './item.styled';

interface BucketItemProps {
  bucket: Bucket;
}

export const BucketItem: React.FunctionComponent<BucketItemProps> = ({ bucket }) => {
  const { bucketsCollection } = useCollections();
  const { data: tags } = useBucketTags(bucket.id);

  const onDeleteClick = () => {
    alert({
      title: 'Delete Bucket',
      description: (
        <>
          Are you sure you want to delete the bucket{' '}
          <Text variant="body-large-emphasized" css={{ whiteSpace: 'nowrap' }}>
            "{bucket.name}"
          </Text>
          ?
          <br />
          <br />
          <Text variant="body-medium" css={{ color: 'text-base-error' }}>
            Warning: This action cannot be undone.
          </Text>
        </>
      ),
      actions: {
        confirm: {
          label: 'Delete',
          variant: 'destructive',
          onClick: async () => {
            const transaction = bucketsCollection.delete(bucket.id);

            await transaction.isPersisted.promise;
          }
        }
      }
    });
  };

  return (
    <Link to="/buckets/$bucketId/{-$key}" params={{ bucketId: bucket.id.toString() }}>
      <StyledBucketItem>
        <Flex css={{ alignItems: 'center', gap: '2', flex: '1' }}>
          <StyledBucketIcon>
            <Icon as={FolderIcon} size="sm" color="base" />
          </StyledBucketIcon>

          <Text variant="body-medium">{bucket.name}</Text>

          {tags.length > 0 && (
            <Flex css={{ gap: '1' }}>
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  size="md"
                  aria-label={tag.name}
                  variant="secondary"
                  css={{ marginBlock: '-1' }}
                >
                  {tag.name}
                </Badge>
              ))}
            </Flex>
          )}
        </Flex>

        <Flex css={{ gap: '2' }}>
          <EditBucketDialog.Trigger
            bucket={bucket}
            render={(props) => (
              <IconButton
                {...props}
                variant="ghost"
                size="sm"
                aria-label="Edit bucket"
                onClick={(event) => {
                  event.preventDefault();
                  props.onClick?.(event);
                }}
              >
                <Icon as={PencilIcon} size="sm" color="base" />
              </IconButton>
            )}
          />

          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Delete bucket"
            onClick={(event) => {
              event.preventDefault();
              onDeleteClick();
            }}
          >
            <Icon as={TrashIcon} size="sm" color="base" />
          </IconButton>
        </Flex>
      </StyledBucketItem>
    </Link>
  );
};
