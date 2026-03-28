import { BucketId, Object } from '@buckethub/rpc-contract';
import { Box, Flex } from '@buckethub/styled-system/jsx';
import { Checkbox, Table } from '@buckethub/ui';
import { Link } from '@tanstack/react-router';
import { FileIcon } from '../file-icon';

interface FolderRowProps {
  bucketId: BucketId;
  object: Extract<Object, { type: 'folder' }>;
  selected?: boolean;
  onSelectionChange?: (key: string) => void;
}

export const FolderRow: React.FunctionComponent<FolderRowProps> = ({
  bucketId,
  object,
  selected,
  onSelectionChange
}) => {
  return (
    <Table.Row key={object.key} data-state={selected ? 'selected' : undefined}>
      <Table.Cell>
        <Checkbox checked={selected} onCheckedChange={() => onSelectionChange?.(object.key)} />
      </Table.Cell>

      <Table.Cell>
        <Link
          to="/buckets/$bucketId/{-$key}"
          preload="intent"
          params={{
            bucketId: bucketId.toString(),
            key: object.key
          }}
        >
          <Flex
            css={{
              gap: '1.5',
              alignItems: 'center',
              overflow: 'hidden',

              '&:hover': {
                textDecoration: 'underline',
                textUnderlineOffset: '3px'
              }
            }}
          >
            <FileIcon object={object} size="lg" color="neutral" css={{ flexShrink: 0 }} />

            <Box css={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {object.name}
            </Box>
          </Flex>
        </Link>
      </Table.Cell>

      <Table.Cell>Folder</Table.Cell>

      {/* <Table.Cell /> */}
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
    </Table.Row>
  );
};
