import { Flex } from '@buckethub/styled-system/jsx';
import { Drawer, Skeleton } from '@buckethub/ui';
import { SidePanel } from '../../../../layout/side-panel';

type Variant = 'side-panel' | 'drawer';

export const ObjectDetailsPanelLoadingFallback: React.FunctionComponent<{ variant: Variant }> = ({
  variant
}) => {
  const ContentWrapper = variant === 'drawer' ? Drawer.Body : SidePanel.Content;
  const ActionsWrapper = variant === 'drawer' ? Drawer.Footer : SidePanel.Group;

  return (
    <>
      <ContentWrapper>
        <Flex css={{ flexDirection: 'column', gap: '2.5' }}>
          <Flex css={{ flexDirection: 'column', gap: '0.5' }}>
            <Skeleton css={{ height: '4', width: '100px' }} />
            <Skeleton css={{ height: '4', width: '100%' }} />
          </Flex>

          <Flex css={{ flexDirection: 'column', gap: '0.5' }}>
            <Skeleton css={{ height: '4', width: '80px' }} />
            <Skeleton css={{ height: '4', width: '150px' }} />
          </Flex>

          <Flex css={{ flexDirection: 'column', gap: '0.5' }}>
            <Skeleton css={{ height: '4', width: '120px' }} />
            <Skeleton css={{ height: '4', width: '100%' }} />
          </Flex>

          <Flex css={{ flexDirection: 'column', gap: '0.5' }}>
            <Skeleton css={{ height: '4', width: '90px' }} />
            <Skeleton css={{ height: '4', width: '180px' }} />
          </Flex>

          <Flex css={{ flexDirection: 'column', gap: '0.5' }}>
            <Skeleton css={{ height: '4', width: '90px' }} />
            <Skeleton css={{ height: '4', width: '180px' }} />
          </Flex>
        </Flex>
      </ContentWrapper>

      <ActionsWrapper
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2.5'
        }}
      >
        <Skeleton css={{ height: '8', width: '100%', gridColumn: 'span 2' }} />

        <Skeleton css={{ height: '8', width: '100%' }} />
        <Skeleton css={{ height: '8', width: '100%' }} />

        <Skeleton css={{ height: '8', width: '100%', gridColumn: 'span 2' }} />
      </ActionsWrapper>
    </>
  );
};
