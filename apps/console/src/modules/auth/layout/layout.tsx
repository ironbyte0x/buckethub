import { type ReactNode } from 'react';
import { Database, Shield, Users } from 'lucide-react';
import { css } from '@buckethub/styled-system/css';
import { Flex } from '@buckethub/styled-system/jsx';
import Logo from '@/assets/logotype.svg?react';
import {
  StyledAuthPage,
  StyledFormCard,
  StyledFormHeader,
  StyledFormPanel,
  StyledHeroContent,
  StyledHeroDescription,
  StyledHeroPanel,
  StyledHeroTitle,
  StyledIcon
} from './layout.styled';

interface LayoutProps {
  children: ReactNode;
}

const Root: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <StyledAuthPage>
      <StyledHeroPanel>
        <StyledHeroContent>
          <Logo
            style={{
              maxWidth: '160px',
              height: 'auto',
              marginBottom: '40px',
              color: 'var(--colors-text-button-primary)'
            }}
          />

          <StyledHeroTitle>
            Your S3 storage,
            <br />
            simplified.
          </StyledHeroTitle>

          <StyledHeroDescription>
            A modern interface for managing your S3 buckets, objects, and team access — all in one
            place.
          </StyledHeroDescription>

          <Flex css={{ flexDirection: 'column', gap: '4', marginTop: '10' }}>
            <Flex
              css={{
                alignItems: 'center',
                gap: '3',
                opacity: 0.6,
                fontSize: '0.875rem'
              }}
            >
              <Database size={18} className={css({ flexShrink: 0 })} />
              Browse and manage buckets and objects
            </Flex>

            <Flex
              css={{
                alignItems: 'center',
                gap: '3',
                opacity: 0.6,
                fontSize: '0.875rem'
              }}
            >
              <Shield size={18} className={css({ flexShrink: 0 })} />
              Secure role-based access control
            </Flex>

            <Flex
              css={{
                alignItems: 'center',
                gap: '3',
                opacity: 0.6,
                fontSize: '0.875rem'
              }}
            >
              <Users size={18} className={css({ flexShrink: 0 })} />
              Invite and manage team members
            </Flex>
          </Flex>
        </StyledHeroContent>
      </StyledHeroPanel>

      <StyledFormPanel>
        <StyledFormCard>{children}</StyledFormCard>
      </StyledFormPanel>
    </StyledAuthPage>
  );
};

export const Layout = Object.assign(Root, {
  Header: StyledFormHeader,
  Icon: StyledIcon
});
