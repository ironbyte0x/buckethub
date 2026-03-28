import { ChevronRightIcon, FolderIcon } from 'lucide-react';
import { Object } from '@buckethub/rpc-contract';
import { Flex } from '@buckethub/styled-system/jsx';
import { Icon, Text } from '@buckethub/ui';
import { StyledItem } from './item.styled';

interface FolderSelectItemProps {
  folder: Object;
  isSelected: boolean;
  onSelect: (path: string) => void;
}

export const FolderSelectItem: React.FunctionComponent<FolderSelectItemProps> = ({
  folder,
  isSelected,
  onSelect
}) => {
  const key = folder.key || '';

  return (
    <StyledItem
      type="button"
      data-selected={isSelected}
      onClick={() => {
        onSelect(key);
      }}
    >
      <Flex css={{ alignItems: 'center', gap: '2', flex: 1, minWidth: 0 }}>
        <Icon as={FolderIcon} size="sm" color="neutral" css={{ flexShrink: 0 }} />

        <Text
          variant="body-medium"
          css={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontWeight: 'medium'
          }}
        >
          {folder.name}
        </Text>
      </Flex>

      <Icon as={ChevronRightIcon} size="sm" css={{ flexShrink: 0, color: 'text-muted' }} />
    </StyledItem>
  );
};
