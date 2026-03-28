import { Flex } from '@buckethub/styled-system/jsx';
import { useMatchRoute } from '@tanstack/react-router';
import { StyledNavItem } from './nav.styled';

export const UserManagementNav: React.FunctionComponent = () => {
  const matchRoute = useMatchRoute();

  const isInvitationsActive = !!matchRoute({ to: '/users/invitations' });
  const isUsersActive = !!matchRoute({ to: '/users/users' });
  const isPermissionsActive = !!matchRoute({ to: '/users/permissions' });

  return (
    <Flex
      css={{
        gap: '1',
        borderBottom: '1px solid {colors.border-input}',
        paddingBottom: '2',

        lg: {
          paddingBottom: '4'
        }
      }}
    >
      <StyledNavItem to="/users/users" preload="intent" data-active={isUsersActive}>
        Users
      </StyledNavItem>

      <StyledNavItem to="/users/invitations" preload="intent" data-active={isInvitationsActive}>
        Invitations
      </StyledNavItem>

      <StyledNavItem to="/users/permissions" preload="intent" data-active={isPermissionsActive}>
        Permissions
      </StyledNavItem>
    </Flex>
  );
};
