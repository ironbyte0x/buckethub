import { useEffect, useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { Drawer, Icon, IconButton } from '@buckethub/ui';
import { Navigate, Outlet, useLocation } from '@tanstack/react-router';
import { useAuth } from '@/services/auth';
import { AddBucketDialog } from '../features/add-bucket';
import { StyledContentContainer, StyledLayout, StyledSidebarContainer } from './layout.styled';
import { Sidebar } from './sidebar';

export const Layout: React.FunctionComponent = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <>
      <AddBucketDialog />

      <StyledLayout>
        <StyledSidebarContainer>
          <Sidebar />
        </StyledSidebarContainer>

        <Drawer position="left" open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <Drawer.Content
            css={{
              backgroundColor: 'background-secondary',
              paddingBottom: 'var(--drawer-bottom-offset, 0px)'
            }}
          >
            <Sidebar onCloseSidebar={() => setIsMobileSidebarOpen(false)} />
          </Drawer.Content>
        </Drawer>

        <StyledContentContainer>
          <IconButton
            variant="ghost"
            size="sm"
            css={{
              marginLeft: '1',
              marginTop: '1',

              sm: {
                marginLeft: '4'
              },

              lg: {
                display: 'none'
              }
            }}
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Icon as={MenuIcon} size="md" color="base" />
          </IconButton>

          <Outlet />
        </StyledContentContainer>
      </StyledLayout>
    </>
  );
};
