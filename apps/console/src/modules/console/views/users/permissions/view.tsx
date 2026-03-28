import { useMemo, useState } from 'react';
import { Box } from '@buckethub/styled-system/jsx';
import { SearchInput, Text } from '@buckethub/ui';
import { useBuckets } from '@/services/buckets';
import { useListPermissions } from '@/services/permissions';
import { useListUsers } from '@/services/users';
import { PermissionsTable } from './permissions-table';

export const PermissionsView: React.FunctionComponent = () => {
  const { data: permissions } = useListPermissions();
  const { data: users } = useListUsers();
  const { data: buckets } = useBuckets();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return users;
    }

    const query = searchQuery.toLowerCase();

    return users.filter(
      (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  return (
    <Box>
      <Text variant="title-medium" css={{ display: 'block', marginBottom: '2' }}>
        Bucket Permissions
      </Text>
      <Text variant="body-medium" color="muted" css={{ display: 'block', marginBottom: '4' }}>
        Manage which users can view, edit, or delete buckets. Admin users have full access to all
        buckets automatically.
      </Text>

      <SearchInput
        placeholder="Search users..."
        value={searchQuery}
        css={{ marginBottom: '4', maxWidth: '320px' }}
        onChange={setSearchQuery}
      />

      <PermissionsTable permissions={permissions} users={filteredUsers} buckets={buckets} />
    </Box>
  );
};
