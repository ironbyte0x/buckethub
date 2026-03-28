import { Box, Flex } from '@buckethub/styled-system/jsx';
import { Skeleton } from '@buckethub/ui';

export const InvitationsLoadingView: React.FunctionComponent = () => {
  return (
    <Box>
      <Flex css={{ flexDirection: 'column' }}>
        <Skeleton css={{ height: '6', width: '160px', marginBottom: '1.5' }} />
        <Skeleton css={{ height: '4', width: '400px', marginBottom: '4' }} />
      </Flex>

      <Flex css={{ gap: '2', marginBottom: '6' }}>
        <Skeleton css={{ height: '9', flex: 1 }} />
        <Skeleton css={{ height: '9', width: '150px' }} />
      </Flex>

      <Skeleton css={{ height: '6', width: '180px' }} />

      <Flex css={{ flexDirection: 'column', gap: '2', marginTop: '2' }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Flex
            key={index}
            css={{
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '3',
              backgroundColor: 'background-surface',
              borderRadius: 'md',
              border: '1px solid',
              borderColor: 'border-input'
            }}
          >
            <Flex css={{ flexDirection: 'column', gap: '1' }}>
              <Skeleton css={{ height: '4', width: '200px' }} />
              <Skeleton css={{ height: '3', width: '280px' }} />
            </Flex>
            <Skeleton css={{ height: '8', width: '80px' }} />
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};
