import { Box } from '@buckethub/styled-system/jsx';
import { Checkbox, Skeleton, Table } from '@buckethub/ui';

export const TableLoadingFallback: React.FunctionComponent = () => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head css={{ width: '12' }}>
            <Checkbox disabled />
          </Table.Head>
          <Table.Head>Object</Table.Head>
          <Table.Head>Type</Table.Head>
          <Table.Head>Storage class</Table.Head>
          <Table.Head>Size</Table.Head>
          <Table.Head css={{ minWidth: '200px' }}>Modified</Table.Head>
          <Table.Head>
            <Box css={{ srOnly: true }}>Actions</Box>
          </Table.Head>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {Array.from({ length: 5 }).map((_, index) => (
          <Table.Row key={index}>
            <Table.Cell>
              <Checkbox disabled />
            </Table.Cell>
            <Table.Cell>
              <Skeleton css={{ height: '4', width: '200px' }} />
            </Table.Cell>
            <Table.Cell>
              <Skeleton css={{ height: '4', width: '80px' }} />
            </Table.Cell>
            <Table.Cell>
              <Skeleton css={{ height: '4', width: '100px' }} />
            </Table.Cell>
            <Table.Cell>
              <Skeleton css={{ height: '4', width: '60px' }} />
            </Table.Cell>
            <Table.Cell>
              <Skeleton css={{ height: '4', width: '120px' }} />
            </Table.Cell>
            <Table.Cell>
              <Skeleton css={{ height: '4', width: '40px' }} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
