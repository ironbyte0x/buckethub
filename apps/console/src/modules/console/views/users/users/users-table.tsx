import { UserRole } from '@buckethub/core';
import { User } from '@buckethub/rpc-contract';
import { Flex } from '@buckethub/styled-system/jsx';
import { SystemStyleObject } from '@buckethub/styled-system/types';
import { Avatar, Badge, ScrollArea, Table, Text } from '@buckethub/ui';
import { UserActionsMenu } from './user-actions-menu';

interface UsersTableProps {
  users: User[];
  currentUserId: string;
  css?: SystemStyleObject;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export const UsersTable: React.FunctionComponent<UsersTableProps> = ({
  users,
  currentUserId,
  css = {}
}) => {
  return (
    <ScrollArea css={[{ width: '100%', flex: '1' }, css]}>
      <ScrollArea.Viewport>
        <ScrollArea.Content
          css={{
            '&[data-has-overflow-y]': {
              paddingBottom: 'var(--scrollbar-size)'
            }
          }}
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>User</Table.Head>
                <Table.Head>Role</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Joined</Table.Head>
                <Table.Head css={{ width: '60px' }} />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user.id} data-testid={`user-row-${user.email}`}>
                  <Table.Cell>
                    <Flex css={{ gap: '3', alignItems: 'center' }}>
                      <Avatar size="md">
                        {user.image && <Avatar.Image src={user.image} alt={user.name} />}
                        <Avatar.Fallback>{getInitials(user.name)}</Avatar.Fallback>
                      </Avatar>

                      <Flex css={{ flexDirection: 'column', gap: '0.5' }}>
                        <Text variant="body-medium" data-testid={`user-name-${user.email}`}>
                          {user.name}
                          {user.id === currentUserId && (
                            <Text as="span" color="muted">
                              {' '}
                              (you)
                            </Text>
                          )}
                        </Text>
                        <Text
                          variant="body-small-emphasized"
                          color="muted"
                          data-testid={`user-email-${user.email}`}
                        >
                          {user.email}
                        </Text>
                      </Flex>
                    </Flex>
                  </Table.Cell>

                  <Table.Cell>
                    <Badge
                      variant={user.role === UserRole.Admin ? 'primary' : 'secondary'}
                      data-testid={`user-role-${user.email}`}
                    >
                      {user.role === UserRole.Admin ? 'Admin' : 'User'}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell data-testid={`user-status-${user.email}`}>
                    {user.banned ? (
                      <Badge variant="secondary">Banned</Badge>
                    ) : (
                      <Text variant="body-medium" color="muted">
                        Active
                      </Text>
                    )}
                  </Table.Cell>

                  <Table.Cell css={{ whiteSpace: 'nowrap' }}>
                    {formatDate(user.createdAt)}
                  </Table.Cell>

                  <Table.Cell>
                    <UserActionsMenu user={user} currentUserId={currentUserId} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </ScrollArea.Content>

        <ScrollArea.GradientPart position="top" css={{ top: '10' }} />
        <ScrollArea.GradientPart position="right" />
        <ScrollArea.GradientPart position="bottom" />
        <ScrollArea.GradientPart position="left" />
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical" css={{ paddingTop: '11' }}>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>

      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea>
  );
};
