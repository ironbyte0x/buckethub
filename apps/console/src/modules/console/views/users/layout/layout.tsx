import { UserRole } from '@buckethub/core';
import { Box } from '@buckethub/styled-system/jsx';
import { Navigate, Outlet } from '@tanstack/react-router';
import { useAuth } from '@/services/auth';
import { PageHeader } from '../../../components/page-header';
import { View } from '../../../layout';
import { UserManagementNav } from './nav';

export const UserManagementLayout: React.FunctionComponent = () => {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === UserRole.Admin;

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <View>
      <PageHeader>
        <PageHeader.Info>
          <PageHeader.Info.Title>User Management</PageHeader.Info.Title>
          <PageHeader.Info.Subtitle>Manage users and invitations.</PageHeader.Info.Subtitle>
        </PageHeader.Info>
      </PageHeader>

      <Box
        css={{
          '--layout-inline-padding': '{spacing.3}',

          paddingInline: 'var(--layout-inline-padding)',
          marginTop: '2',
          flex: '1',

          lg: {
            '--layout-inline-padding': '{spacing.6}'
          }
        }}
      >
        <UserManagementNav />

        <Box css={{ marginTop: '6' }}>
          <Outlet />
        </Box>
      </Box>
    </View>
  );
};
