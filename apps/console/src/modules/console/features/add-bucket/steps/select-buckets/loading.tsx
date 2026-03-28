import { Flex } from '@buckethub/styled-system/jsx';
import { ResponsiveDialog, Skeleton } from '@buckethub/ui';

export const SelectBucketsStepLoadingFallback: React.FunctionComponent = () => {
  return (
    <ResponsiveDialog.Body>
      <Flex css={{ flexDirection: 'column', gap: '3', padding: '4' }}>
        <Skeleton css={{ height: '5', width: '150px' }} />
        <Skeleton css={{ height: '10', width: '100%' }} />
        <Skeleton css={{ height: '10', width: '100%' }} />
        <Skeleton css={{ height: '10', width: '100%' }} />
      </Flex>
    </ResponsiveDialog.Body>
  );
};
