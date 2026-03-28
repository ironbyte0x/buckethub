import { Box, Flex } from '@buckethub/styled-system/jsx';
import { Skeleton } from '@buckethub/ui';

export const PermissionsLoadingView: React.FunctionComponent = () => {
  return (
    <Box>
      <Flex css={{ flexDirection: 'column' }}>
        <Skeleton css={{ height: '6', width: '180px', marginBottom: '1.5' }} />
        <Skeleton css={{ height: '4', width: '420px', marginBottom: '4' }} />
      </Flex>

      <Flex css={{ flexDirection: 'column', gap: '2' }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Flex
            key={index}
            css={{
              alignItems: 'center',
              gap: '3',
              padding: '3',
              borderRadius: 'md',
              border: '1px solid {colors.border-input}'
            }}
          >
            <Skeleton css={{ height: '8', width: '8', borderRadius: 'full' }} />

            <Flex css={{ flexDirection: 'column', gap: '1', flex: '1' }}>
              <Skeleton css={{ height: '4', width: '120px' }} />
              <Skeleton css={{ height: '3', width: '180px' }} />
            </Flex>

            <Skeleton css={{ height: '3', width: '80px' }} />
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};
