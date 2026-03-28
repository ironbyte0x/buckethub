import { useMemo } from 'react';
import { MoreHorizontalIcon } from 'lucide-react';
import { BucketId, Object } from '@buckethub/rpc-contract';
import { Box, Flex } from '@buckethub/styled-system/jsx';
import { Checkbox, Icon, IconButton, Table, Text } from '@buckethub/ui';
import { Link } from '@tanstack/react-router';
import { formatBytes } from '@/shared/utils';
import { FileIcon } from '../file-icon';
import { DateTooltip } from './date-tooltip';
import { FileRowActions } from './file-row-actions';

interface FileRowProps {
  bucketId: BucketId;
  object: Extract<Object, { type: 'file' }>;
  selected?: boolean;
  onSelectionChange?: (key: string) => void;
}

export const FileRow: React.FunctionComponent<FileRowProps> = ({
  bucketId,
  object,
  selected,
  onSelectionChange
}) => {
  const lastModifiedDate = useMemo(
    () => (object.lastModified ? new Date(object.lastModified) : undefined),
    [object.lastModified]
  );

  const gmtDate = lastModifiedDate
    ?.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    .replace(/,/g, '');

  const timezoneOffset = lastModifiedDate ? -lastModifiedDate.getTimezoneOffset() / 60 : 0;

  return (
    <Table.Row key={object.key} data-state={selected ? 'selected' : undefined}>
      <Table.Cell>
        <Checkbox checked={selected} onCheckedChange={() => onSelectionChange?.(object.key)} />
      </Table.Cell>

      <Table.Cell>
        <Link
          to="/buckets/$bucketId/{-$key}"
          params={(parameters) => ({
            bucketId: parameters.bucketId || '',
            key: object.key
          })}
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

      <Table.Cell
        css={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {object.contentType}
      </Table.Cell>

      {/* <Table.Cell
        css={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {object.storageClass
          ? object.storageClass.charAt(0)?.toUpperCase() +
            object.storageClass.slice(1).toLowerCase()
          : undefined}
      </Table.Cell> */}

      <Table.Cell css={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {formatBytes(object.size ?? 0)}
      </Table.Cell>

      <Table.Cell>
        {lastModifiedDate ? (
          <DateTooltip.Trigger
            payload={{
              date: lastModifiedDate
            }}
          >
            <Text
              css={{
                borderBottom: '1px dashed {colors.border-surface}',
                paddingBlock: '0.5',
                marginBlock: '-0.5',
                textOverflow: 'ellipsis',
                lineClamp: 1
              }}
            >
              {gmtDate}{' '}
              <Box as="span" css={{ color: 'text-muted' }}>
                GMT{timezoneOffset >= 0 ? '+' : ''}
                {timezoneOffset}
              </Box>
            </Text>
          </DateTooltip.Trigger>
        ) : undefined}
      </Table.Cell>

      <Table.Cell>
        <FileRowActions
          bucketId={bucketId}
          object={object}
          render={
            <IconButton
              variant="ghost"
              size="xs"
              css={{
                marginBlock: '-3'
              }}
            >
              <Icon as={MoreHorizontalIcon} />
            </IconButton>
          }
        />
      </Table.Cell>
    </Table.Row>
  );
};
