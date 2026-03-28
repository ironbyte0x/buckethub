import { DatabaseIcon } from 'lucide-react';
import { Icon, State } from '@buckethub/ui';

export const SelectBucketsEmptyFallback: React.FunctionComponent = () => {
  return (
    <State>
      <State.Header>
        <State.Media variant="icon">
          <Icon as={DatabaseIcon} size="2xl" color="neutral" />
        </State.Media>
        <State.Title>No buckets found</State.Title>
        <State.Description>This connection has no buckets available</State.Description>
      </State.Header>
    </State>
  );
};
