import { Box } from '@buckethub/styled-system/jsx';
import { PageHeader } from '../../components/page-header';
import { EditBucketDialog } from '../../features/edit-bucket';
import { View } from '../../layout';
import { ConnectionsList } from './components/connections';

export const ConnectionsView: React.FunctionComponent = () => {
  return (
    <View>
      <PageHeader>
        <PageHeader.Info>
          <PageHeader.Info.Title>Connections management</PageHeader.Info.Title>

          <PageHeader.Info.Subtitle>Manage your storage connections.</PageHeader.Info.Subtitle>
        </PageHeader.Info>
      </PageHeader>

      <Box
        css={{
          paddingInline: '3',
          marginTop: '2',
          flex: '1',

          lg: {
            paddingInline: '6'
          }
        }}
      >
        <ConnectionsList />
      </Box>

      <EditBucketDialog />
    </View>
  );
};
