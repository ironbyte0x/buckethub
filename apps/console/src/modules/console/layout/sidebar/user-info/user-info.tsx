import {
  EllipsisIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon
} from 'lucide-react';
import { Theme } from '@buckethub/rpc-contract';
import { SystemStyleObject } from '@buckethub/styled-system/types';
import { Avatar, Icon, Menu } from '@buckethub/ui';
import { Link } from '@tanstack/react-router';
import { useAuth } from '@/services/auth';
import { useTheme } from '@/shared/theme';
import {
  StyledUserDetails,
  StyledUserEmail,
  StyledUserInfoTrigger,
  StyledUserName
} from './user-info.styled';

type ThemeOption = {
  [TTheme in Theme]: {
    value: TTheme;
    label: string;
    icon: React.FunctionComponent<React.ComponentProps<'svg'>>;
  };
}[Theme];

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'system', label: 'System', icon: MonitorIcon }
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface UserInfoProps {
  css?: SystemStyleObject;
}

export const UserInfo: React.FunctionComponent<UserInfoProps> = ({ css }) => {
  const { user, isAuthenticated, authClient } = useAuth();
  const { theme, setTheme } = useTheme();

  if (!isAuthenticated) {
    throw new Error('User not authenticated');
  }

  const onSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <Menu>
      <Menu.Trigger
        render={
          <StyledUserInfoTrigger data-testid="user-info-trigger" css={css}>
            <Avatar size="md">
              {user.image && <Avatar.Image src={user.image} alt={user.name} />}
              <Avatar.Fallback>{getInitials(user.name)}</Avatar.Fallback>
            </Avatar>

            <StyledUserDetails>
              <StyledUserName data-testid="user-info-name">{user.name}</StyledUserName>

              <StyledUserEmail data-testid="user-info-email">{user.email}</StyledUserEmail>
            </StyledUserDetails>

            <Icon as={EllipsisIcon} size="md" css={{ color: 'text-muted' }} />
          </StyledUserInfoTrigger>
        }
      />

      <Menu.Content align="end">
        <Link to="/settings">
          <Menu.Item>
            <Icon as={SettingsIcon} size="sm" />
            Settings
          </Menu.Item>
        </Link>

        <Menu.SubmenuRoot>
          <Menu.SubmenuTrigger>
            <Icon as={SunIcon} size="sm" />
            Theme
          </Menu.SubmenuTrigger>

          <Menu.Content>
            <Menu.RadioGroup
              value={theme}
              onValueChange={(value: string) => setTheme(value as Theme)}
            >
              {THEME_OPTIONS.map((option) => (
                <Menu.RadioItem key={option.value} value={option.value}>
                  <Icon as={option.icon} size="sm" />
                  {option.label}
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.Content>
        </Menu.SubmenuRoot>

        <Menu.Separator />

        <Menu.Item onClick={onSignOut}>
          <Icon as={LogOutIcon} size="sm" />
          Log out
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
};
