import { Flex } from '@buckethub/styled-system/jsx';
import { Skeleton } from '@buckethub/ui';
import { PageHeader } from '../../components/page-header';
import { View } from '../../layout';

export const BucketLoadingView: React.FunctionComponent = () => {
  return (
    <View>
      <PageHeader>
        <PageHeader.Info>
          <Skeleton css={{ height: '8', width: '200px' }} />
          <Skeleton css={{ height: '4', width: '150px', marginTop: '1' }} />
        </PageHeader.Info>
      </PageHeader>

      <Flex
        css={{
          flexDirection: 'column',
          gap: '2',
          marginTop: '1',
          paddingInline: '6'
        }}
      >
        <Flex css={{ gap: '2.5' }}>
          <Skeleton css={{ height: '8', width: '280px' }} />
          <Skeleton css={{ height: '8', width: '116px' }} />
          <Skeleton css={{ height: '8', width: '92px' }} />
          <Skeleton css={{ height: '8', width: '96px' }} />
        </Flex>

        <Skeleton css={{ height: '5', width: '300px', marginBlock: '2' }} />

        <Skeleton css={{ height: '10', width: '100%' }} />
        <Skeleton css={{ height: '10', width: '100%' }} />
        <Skeleton css={{ height: '10', width: '100%' }} />
        <Skeleton css={{ height: '10', width: '100%' }} />
        <Skeleton css={{ height: '10', width: '100%' }} />
      </Flex>
    </View>
  );
};
