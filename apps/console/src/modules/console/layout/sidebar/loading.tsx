import { Box, Flex } from '@buckethub/styled-system/jsx';
import { Skeleton, Text } from '@buckethub/ui';

export const BucketsLoadingFallback: React.FunctionComponent = () => {
  return (
    <Box css={{ marginTop: '6' }}>
      <Flex css={{ justifyContent: 'space-between', alignItems: 'center', height: '26px' }}>
        <Text variant="caption" color="subtle">
          Buckets
        </Text>
      </Flex>

      <Flex css={{ flexDirection: 'column', marginTop: '1', gap: '2' }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Box key={index} css={{ padding: '3', borderRadius: 'xl', border: 'base' }}>
            <Skeleton css={{ height: '2.5', width: '100%', marginBottom: '1.5' }} />
            <Skeleton css={{ height: '2', width: '60%' }} />
          </Box>
        ))}
      </Flex>
    </Box>
  );
};
