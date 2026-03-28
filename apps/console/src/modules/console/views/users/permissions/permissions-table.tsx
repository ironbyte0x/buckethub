import { useMemo } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { UserRole } from '@buckethub/core';
import { BucketId, PermissionLevel, User, UserBucketPermissions } from '@buckethub/rpc-contract';
import { Flex } from '@buckethub/styled-system/jsx';
import { Accordion, Avatar, Checkbox, Icon, Table, Text } from '@buckethub/ui';
import { useSetPermissions } from '@/services/permissions';

interface Bucket {
  id: BucketId;
  name: string;
}

interface PermissionsTableProps {
  permissions: UserBucketPermissions[];
  users: User[];
  buckets: Bucket[];
}

const PERMISSION_LEVELS: PermissionLevel[] = ['view', 'edit', 'delete'];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface UserPermissionsItemProps {
  user: User;
  buckets: Bucket[];
  permissions: UserBucketPermissions[];
}

const UserPermissionsItem: React.FunctionComponent<UserPermissionsItemProps> = ({
  user,
  buckets,
  permissions
}) => {
  const { mutate: setPermissions } = useSetPermissions();

  const getPermissionsForBucket = (bucketId: BucketId): PermissionLevel[] => {
    const entry = permissions.find((p) => p.userId === user.id && p.bucketId === bucketId);

    return entry?.permissions ?? [];
  };

  const onTogglePermission = (
    bucketId: BucketId,
    permission: PermissionLevel,
    currentPermissions: PermissionLevel[]
  ) => {
    const hasPermission = currentPermissions.includes(permission);
    let newPermissions: PermissionLevel[];

    if (hasPermission) {
      newPermissions = currentPermissions.filter((p) => p !== permission);
    } else {
      newPermissions = [...currentPermissions, permission];
    }

    setPermissions({ bucketId, userId: user.id, permissions: newPermissions });
  };

  const totalPermissions = useMemo(() => {
    return permissions
      .filter((p) => p.userId === user.id)
      .reduce((sum, p) => sum + p.permissions.length, 0);
  }, [permissions, user.id]);

  return (
    <Accordion.Item
      value={user.id}
      css={{
        backgroundColor: 'background-base'
      }}
    >
      <Accordion.Trigger
        render={(props, state) => (
          <Accordion.Header {...props}>
            <Flex css={{ alignItems: 'center', gap: '3', flex: '1' }}>
              <Avatar size="md">
                {user.image && <Avatar.Image src={user.image} alt={user.name} />}
                <Avatar.Fallback>{getInitials(user.name)}</Avatar.Fallback>
              </Avatar>

              <Flex css={{ flexDirection: 'column', gap: '0.5' }}>
                <Text variant="body-medium-emphasized">{user.name}</Text>
                <Text variant="caption" color="muted">
                  {user.email}
                </Text>
              </Flex>
            </Flex>

            <Flex css={{ gap: '3', alignItems: 'center' }}>
              <Text variant="caption" color="muted">
                {totalPermissions} {totalPermissions === 1 ? 'permission' : 'permissions'}
              </Text>

              <Accordion.Chevron>
                <Icon
                  as={ChevronDownIcon}
                  size="sm"
                  css={{
                    transform: state.open ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                />
              </Accordion.Chevron>
            </Flex>
          </Accordion.Header>
        )}
      />

      <Accordion.Panel>
        <Table css={{ marginTop: '2' }}>
          <Table.Header>
            <Table.Row>
              <Table.Head>Bucket</Table.Head>
              {PERMISSION_LEVELS.map((level) => (
                <Table.Head key={level} css={{ textTransform: 'capitalize', width: '100px' }}>
                  {level}
                </Table.Head>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {buckets.map((bucket) => {
              const currentPermissions = getPermissionsForBucket(bucket.id);

              return (
                <Table.Row key={bucket.id}>
                  <Table.Cell>
                    <Text variant="body-medium">{bucket.name}</Text>
                  </Table.Cell>

                  {PERMISSION_LEVELS.map((level) => (
                    <Table.Cell key={level}>
                      <Checkbox
                        checked={currentPermissions.includes(level)}
                        onCheckedChange={() =>
                          onTogglePermission(bucket.id, level, currentPermissions)
                        }
                      />
                    </Table.Cell>
                  ))}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export const PermissionsTable: React.FunctionComponent<PermissionsTableProps> = ({
  permissions,
  users,
  buckets
}) => {
  const nonAdminUsers = users.filter((u) => u.role !== UserRole.Admin);

  if (nonAdminUsers.length === 0) {
    return (
      <Text variant="body-medium" color="muted">
        No non-admin users to manage permissions for.
      </Text>
    );
  }

  if (buckets.length === 0) {
    return (
      <Text variant="body-medium" color="muted">
        No buckets available. Add buckets first to manage permissions.
      </Text>
    );
  }

  return (
    <Accordion multiple defaultValue={[]}>
      {nonAdminUsers.map((user) => (
        <UserPermissionsItem
          key={user.id}
          user={user}
          buckets={buckets}
          permissions={permissions}
        />
      ))}
    </Accordion>
  );
};
