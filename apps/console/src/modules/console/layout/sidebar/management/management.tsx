import { PlugIcon, UsersIcon } from 'lucide-react';
import { UserRole } from '@buckethub/core';
import { Box, Flex } from '@buckethub/styled-system/jsx';
import { Icon, Text } from '@buckethub/ui';
import { Link } from '@tanstack/react-router';
import { useAuth } from '@/services/auth';
import { StyledManagementItem } from './management.styled';

type ManagementProps = React.ComponentProps<typeof Box>;

export const Management: React.FunctionComponent<ManagementProps> = (props) => {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === UserRole.Admin;

  return (
    <Box {...props}>
      <Text variant="caption" color="subtle">
        Management
      </Text>

      <Flex
        css={{
          flexDirection: 'column',
          marginTop: '1',
          gap: '1'
        }}
      >
        <StyledManagementItem as={Link} to="/connections" preload="intent">
          <Icon as={PlugIcon} />
          <Text variant="body-medium">Connections</Text>
        </StyledManagementItem>

        {isAdmin && (
          <StyledManagementItem as={Link} to="/users" preload="intent">
            <Icon as={UsersIcon} />
            <Text variant="body-medium">Users</Text>
          </StyledManagementItem>
        )}
      </Flex>
    </Box>
  );
};
