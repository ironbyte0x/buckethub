import { Box, Flex } from '@buckethub/styled-system/jsx';
import { Skeleton, Table } from '@buckethub/ui';

export const UsersLoadingView: React.FunctionComponent = () => {
  return (
    <Box>
      <Flex css={{ flexDirection: 'column' }}>
        <Skeleton css={{ height: '6', width: '160px', marginBottom: '1.5' }} />
        <Skeleton css={{ height: '4', width: '400px', marginBottom: '3.5' }} />
      </Flex>

      <Table
        css={{
          marginInline: 'calc(var(--layout-inline-padding, 0px) * -1)',
          width: 'calc(100% + var(--layout-inline-padding, 0px) * 2)'
        }}
      >
        <Table.Header>
          <Table.Row>
            <Table.Head>User</Table.Head>
            <Table.Head>Role</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Joined</Table.Head>
            <Table.Head css={{ width: '60px' }} />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {Array.from({ length: 5 }).map((_, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Flex css={{ gap: '3', alignItems: 'center' }}>
                  <Skeleton css={{ height: '10', width: '10', borderRadius: 'full' }} />

                  <Flex css={{ flexDirection: 'column', gap: '1' }}>
                    <Skeleton css={{ height: '4', width: '120px' }} />
                    <Skeleton css={{ height: '3', width: '160px' }} />
                  </Flex>
                </Flex>
              </Table.Cell>

              <Table.Cell>
                <Skeleton css={{ height: '5', width: '50px', borderRadius: 'full' }} />
              </Table.Cell>

              <Table.Cell>
                <Skeleton css={{ height: '4', width: '50px' }} />
              </Table.Cell>

              <Table.Cell>
                <Skeleton css={{ height: '4', width: '80px' }} />
              </Table.Cell>

              <Table.Cell>
                <Skeleton css={{ height: '6', width: '6', marginRight: '1' }} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Box>
  );
};
