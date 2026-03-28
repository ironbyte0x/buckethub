import { Suspense } from 'react';
import { KeyRoundIcon, PaletteIcon, UserIcon } from 'lucide-react';
import { Icon, Skeleton } from '@buckethub/ui';
import { Link, Outlet } from '@tanstack/react-router';
import { PageHeader } from '../../../components/page-header';
import { View } from '../../../layout';
import {
  StyledSettingsContent,
  StyledSettingsNav,
  StyledSettingsNavItem,
  StyledSettingsPanel
} from './layout.styled';

export const SettingsLayout: React.FunctionComponent = () => {
  return (
    <View>
      <PageHeader>
        <PageHeader.Info>
          <PageHeader.Info.Title>Settings</PageHeader.Info.Title>

          <PageHeader.Info.Subtitle>
            Manage your account settings and preferences.
          </PageHeader.Info.Subtitle>
        </PageHeader.Info>
      </PageHeader>

      <StyledSettingsContent>
        <StyledSettingsNav>
          <Link to="/settings/profile" preload="intent">
            {({ isActive }) => (
              <StyledSettingsNavItem active={isActive}>
                <Icon as={UserIcon} size="sm" />
                Profile
              </StyledSettingsNavItem>
            )}
          </Link>

          <Link to="/settings/appearance" preload="intent">
            {({ isActive }) => (
              <StyledSettingsNavItem active={isActive}>
                <Icon as={PaletteIcon} size="sm" />
                Appearance
              </StyledSettingsNavItem>
            )}
          </Link>

          <Link to="/settings/security" preload="intent">
            {({ isActive }) => (
              <StyledSettingsNavItem active={isActive}>
                <Icon as={KeyRoundIcon} size="sm" />
                Security
              </StyledSettingsNavItem>
            )}
          </Link>
        </StyledSettingsNav>

        <StyledSettingsPanel>
          <Suspense fallback={<Skeleton css={{ width: '100%', height: '80' }} />}>
            <Outlet />
          </Suspense>
        </StyledSettingsPanel>
      </StyledSettingsContent>
    </View>
  );
};
