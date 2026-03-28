import { PlusIcon } from 'lucide-react';
import { Bucket, BucketId } from '@buckethub/rpc-contract';
import { Box, Flex } from '@buckethub/styled-system/jsx';
import { SystemStyleObject } from '@buckethub/styled-system/types';
import { Badge, Icon, IconButton, ScrollArea, Text } from '@buckethub/ui';
import { Link } from '@tanstack/react-router';
import { PROVIDERS_BY_TYPE } from '@/constants';
import { AddBucketDialog } from '@/modules/console/features/add-bucket';
import { useBuckets } from '@/services/buckets';
import { useConnection } from '@/services/connections';
import { useBucketTags } from '@/services/tags';
import { StyledBucket } from './buckets.styled';

interface BucketItemProps {
  bucket: Bucket;
  active: boolean;
}

const BucketItem: React.FunctionComponent<BucketItemProps> = ({ bucket, active }) => {
  const { data: tags } = useBucketTags(bucket.id);
  const { data: connection } = useConnection(bucket.connectionId);

  if (!connection) {
    return null;
  }

  const providerLabel = PROVIDERS_BY_TYPE[connection.providerType].shortLabel;

  return (
    <StyledBucket key={bucket.id} as={Link} to={`/buckets/${bucket.id}`} active={active}>
      <Flex
        css={{
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1'
        }}
      >
        <Text variant="body-medium">{bucket.name}</Text>

        {providerLabel && (
          <Badge variant="primary" css={{ textTransform: 'uppercase' }}>
            {providerLabel}
          </Badge>
        )}
      </Flex>

      {tags.length > 0 && (
        <Flex css={{ gap: '1.5', flexWrap: 'wrap' }}>
          {tags.map((tag) => (
            <Badge key={tag.id} size="sm" variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </Flex>
      )}
    </StyledBucket>
  );
};

interface BucketsProps extends React.ComponentProps<typeof Flex> {
  activeBucketId?: BucketId;
  css?: SystemStyleObject;
  onCloseSidebar?: () => void;
}

export const Buckets: React.FunctionComponent<BucketsProps> = ({
  activeBucketId,
  css = {},
  onCloseSidebar,
  ...props
}) => {
  const { data: buckets } = useBuckets();

  return (
    <Flex
      css={[
        {
          flexDirection: 'column',
          minHeight: '0'
        },
        css
      ]}
      {...props}
    >
      <Flex css={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Text variant="caption" color="subtle">
          Buckets ({buckets.length})
        </Text>

        <AddBucketDialog.Trigger
          render={(props) => (
            <IconButton
              variant="ghost"
              size="xs"
              css={{ marginTop: '-0.5' }}
              {...props}
              onClick={(event) => {
                props.onClick?.(event);
                onCloseSidebar?.();
              }}
            >
              <Icon as={PlusIcon} size="sm" color="base" />
            </IconButton>
          )}
        />
      </Flex>

      <ScrollArea
        type="hover"
        css={{
          flex: '1',
          minHeight: '0',
          marginTop: '1',
          '--scrollbar-size': 'var(--spacing-2)'
        }}
      >
        <ScrollArea.Viewport>
          <ScrollArea.Content
            css={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2'
            }}
          >
            {buckets.length === 0 ? (
              <>
                <Box
                  css={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1.5',
                    borderRadius: 'xl',
                    padding: '3',
                    height: '40px',
                    border: 'dashed',
                    borderColor: 'border-base'
                  }}
                />

                <Box
                  css={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1.5',
                    borderRadius: 'xl',
                    padding: '3',
                    height: '40px',
                    border: 'dashed',
                    borderColor: 'border-base'
                  }}
                />
              </>
            ) : (
              buckets.flat().map((bucket) => {
                return (
                  <BucketItem
                    key={bucket.id}
                    bucket={bucket}
                    active={bucket.id === activeBucketId}
                  />
                );
              })
            )}
          </ScrollArea.Content>

          <ScrollArea.GradientPart position="top" />
          <ScrollArea.GradientPart position="bottom" />
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar
          orientation="vertical"
          css={{ backgroundColor: 'transparent !important' }}
        >
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea>
    </Flex>
  );
};
