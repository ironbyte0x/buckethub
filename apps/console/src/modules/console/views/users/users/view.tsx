import { Box } from '@buckethub/styled-system/jsx';
import { Text } from '@buckethub/ui';
import { useAuth } from '@/services/auth';
import { useListUsers } from '@/services/users';
import { UsersTable } from './users-table';

export const UsersView: React.FunctionComponent = () => {
  const { user: currentUser } = useAuth();
  const { data: users } = useListUsers();

  return (
    <Box>
      <Text variant="title-medium" css={{ display: 'block', marginBottom: '2' }}>
        User Management
      </Text>

      <Text variant="body-medium" color="muted" css={{ display: 'block', marginBottom: '4' }}>
        View and manage users. Admins can change user roles, ban users, or remove them from the
        system.
      </Text>

      {users.length === 0 ? (
        <Text variant="body-medium" color="muted">
          No users found
        </Text>
      ) : (
        <UsersTable
          users={users}
          currentUserId={currentUser?.id ?? ''}
          css={{
            marginInline: 'calc(var(--layout-inline-padding, 0px) * -1)',
            width: 'calc(100% + var(--layout-inline-padding, 0px) * 2)'
          }}
        />
      )}
    </Box>
  );
};
