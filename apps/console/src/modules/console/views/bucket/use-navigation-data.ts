import { useMemo } from 'react';
import { BucketId } from '@buckethub/rpc-contract';
import { useParams, useSearch } from '@tanstack/react-router';
import { getKeyPrefix } from '@/shared/lib';

export function useNavigationData() {
  const { bucketId: bucketIdParameter, key } = useParams({
    from: '/main-layout/buckets/$bucketId/{-$key}'
  });

  const { search } = useSearch({
    from: '/main-layout/buckets/$bucketId/{-$key}'
  });

  const bucketId = bucketIdParameter as BucketId;
  const prefix = useMemo(() => getKeyPrefix(key), [key]);

  return {
    bucketId,
    key,
    prefix,
    search
  };
}
