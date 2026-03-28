import { Suspense } from 'react';
import { BucketId } from '@buckethub/rpc-contract';
import { Box } from '@buckethub/styled-system/jsx';
import { Link, useMatch } from '@tanstack/react-router';
import Logo from '@/assets/logotype.svg?react';
import { UploadIndicator } from '@/modules/console/features/upload';
import { Buckets } from './buckets';
import { BucketsLoadingFallback } from './loading';
import { Management } from './management';
import { StyledSidebar } from './sidebar.styled';
import { UserInfo } from './user-info';

interface SidebarProps {
  onCloseSidebar?: () => void;
}

export const Sidebar: React.FunctionComponent<SidebarProps> = ({ onCloseSidebar }) => {
  const matchedRoute = useMatch({
    from: '/main-layout/buckets/$bucketId/{-$key}',
    shouldThrow: false
  });
  const activeBucketId = matchedRoute?.params.bucketId;
  const parsedActiveBucketId = activeBucketId ? (activeBucketId as BucketId) : undefined;

  return (
    <StyledSidebar data-testid="sidebar">
      <Link to="/">
        <Box css={{ color: 'text-base' }}>
          <Logo style={{ maxWidth: '160px', height: 'auto' }} />
        </Box>
      </Link>

      <Suspense fallback={<BucketsLoadingFallback />}>
        <Buckets
          css={{ marginTop: '6' }}
          activeBucketId={parsedActiveBucketId}
          onCloseSidebar={onCloseSidebar}
        />
      </Suspense>

      <Management css={{ marginBlock: '6', flex: '1' }} />
      <UploadIndicator />
      <UserInfo css={{ marginTop: '2' }} />
    </StyledSidebar>
  );
};
