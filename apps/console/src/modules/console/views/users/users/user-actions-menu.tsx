import {
  BanIcon,
  MoreHorizontalIcon,
  ShieldIcon,
  ShieldOffIcon,
  Trash2Icon,
  UnlockIcon
} from 'lucide-react';
import { UserRole } from '@buckethub/core';
import { User } from '@buckethub/rpc-contract';
import { alert, Icon, IconButton, Menu, Text, toast } from '@buckethub/ui';
import { useBanUser, useDeleteUser, useUnbanUser, useUpdateUserRole } from '@/services/users';

interface UserActionsMenuProps {
  user: User;
  currentUserId: string;
}

export const UserActionsMenu: React.FunctionComponent<UserActionsMenuProps> = ({
  user,
  currentUserId
}) => {
  const { mutate: updateRole } = useUpdateUserRole();
  const { mutate: banUser } = useBanUser();
  const { mutate: unbanUser } = useUnbanUser();
  const { mutate: deleteUser } = useDeleteUser();

  const isCurrentUser = user.id === currentUserId;
  const isAdmin = user.role === UserRole.Admin;
  const isBanned = user.banned === true;

  if (isCurrentUser) {
    return null;
  }

  const onToggleRole = () => {
    const newRole = isAdmin ? UserRole.User : UserRole.Admin;

    updateRole(
      { userId: user.id, role: newRole },
      {
        onSuccess: () => {
          toast.success({
            title: isAdmin ? 'Admin access revoked' : 'Admin access granted'
          });
        }
      }
    );
  };

  const onBan = () => {
    alert({
      title: 'Ban User',
      description: (
        <>
          Are you sure you want to ban <Text variant="body-large-emphasized">{user.name}</Text>?
          <br />
          <br />
          <Text variant="body-medium" color="muted">
            They will not be able to sign in until unbanned.
          </Text>
        </>
      ),
      actions: {
        confirm: {
          label: 'Ban User',
          variant: 'destructive',
          onClick: async () => {
            banUser(
              { userId: user.id },
              {
                onSuccess: () => {
                  toast.success({ title: 'User banned' });
                }
              }
            );
          }
        }
      }
    });
  };

  const onUnban = () => {
    unbanUser(
      { userId: user.id },
      {
        onSuccess: () => {
          toast.success({ title: 'User unbanned' });
        }
      }
    );
  };

  const onDelete = () => {
    alert({
      title: 'Delete User',
      description: (
        <>
          Are you sure you want to permanently delete{' '}
          <Text variant="body-large-emphasized">{user.name}</Text>?
          <br />
          <br />
          <Text variant="body-medium" css={{ color: 'text-base-error' }}>
            Warning: This action cannot be undone. All user data will be lost.
          </Text>
        </>
      ),
      actions: {
        confirm: {
          label: 'Delete',
          variant: 'destructive',
          onClick: async () => {
            deleteUser(
              { userId: user.id },
              {
                onSuccess: () => {
                  toast.success({ title: 'User deleted' });
                }
              }
            );
          }
        }
      }
    });
  };

  return (
    <Menu>
      <Menu.Trigger
        render={
          <IconButton
            variant="ghost"
            size="sm"
            css={{ marginBlock: '-3' }}
            data-testid={`user-actions-menu-${user.email}`}
          >
            <Icon as={MoreHorizontalIcon} />
          </IconButton>
        }
      />

      <Menu.Content align="end">
        <Menu.Item data-testid={`toggle-role-${user.email}`} onClick={onToggleRole}>
          <Icon as={isAdmin ? ShieldOffIcon : ShieldIcon} size="sm" />
          {isAdmin ? 'Revoke Admin' : 'Make Admin'}
        </Menu.Item>

        <Menu.Separator />

        {isBanned ? (
          <Menu.Item data-testid={`unban-user-${user.email}`} onClick={onUnban}>
            <Icon as={UnlockIcon} size="sm" />
            Unban User
          </Menu.Item>
        ) : (
          <Menu.Item data-testid={`ban-user-${user.email}`} onClick={onBan}>
            <Icon as={BanIcon} size="sm" />
            Ban User
          </Menu.Item>
        )}

        <Menu.Separator />

        <Menu.Item
          data-testid={`delete-user-${user.email}`}
          variant="destructive"
          onClick={onDelete}
        >
          <Icon as={Trash2Icon} size="sm" />
          Delete User
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
};
