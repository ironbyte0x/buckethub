import { Suspense, useMemo } from 'react';
import { ConnectionId } from '@buckethub/rpc-contract';
import { Flex } from '@buckethub/styled-system/jsx';
import { Skeleton, State } from '@buckethub/ui';
import { useBuckets } from '@/services/buckets';
import { BucketItem } from './item';
import { StyledBucketsList } from './list.styled';

const BucketsListContent: React.FunctionComponent<{
  connectionId: ConnectionId;
}> = ({ connectionId }) => {
  const { data: allBuckets } = useBuckets();

  const buckets = useMemo(
    () => allBuckets.filter((bucket) => bucket.connectionId === connectionId),
    [allBuckets, connectionId]
  );

  if (buckets.length === 0) {
    return (
      <State>
        <State.Header>
          <State.Description>No buckets yet</State.Description>
        </State.Header>
      </State>
    );
  }

  return (
    <StyledBucketsList>
      {buckets.map((bucket) => (
        <BucketItem key={bucket.id} bucket={bucket} />
      ))}
    </StyledBucketsList>
  );
};

const BucketsListSkeleton: React.FunctionComponent = () => {
  return (
    <Flex css={{ flexDirection: 'column', gap: '4' }}>
      <Skeleton css={{ height: '10', borderRadius: 'md' }} />
      <Skeleton css={{ height: '10', borderRadius: 'md' }} />
    </Flex>
  );
};

export const BucketsList: React.FunctionComponent<{
  connectionId: ConnectionId;
}> = ({ connectionId }) => {
  return (
    <Suspense fallback={<BucketsListSkeleton />}>
      <BucketsListContent connectionId={connectionId} />
    </Suspense>
  );
};
