import { useState } from 'react';
import { CheckIcon, FolderIcon, XIcon } from 'lucide-react';
import { Flex } from '@buckethub/styled-system/jsx';
import { Button, Icon, TextInput } from '@buckethub/ui';
import { StyledNewItem } from './new-item.styled';

interface FolderSelectNewItemProps {
  onCreate: (name: string) => void;
  onCancelCreate: () => void;
}

export const FolderSelectNewItem: React.FunctionComponent<FolderSelectNewItemProps> = ({
  onCreate: onCreateProp,
  onCancelCreate
}) => {
  const [newFolderName, setNewFolderName] = useState('');

  const onCreate = () => {
    if (newFolderName.trim()) {
      onCreateProp(newFolderName);
      setNewFolderName('');
    }
  };

  const onCancel = () => {
    setNewFolderName('');
    onCancelCreate();
  };

  return (
    <StyledNewItem>
      <Flex css={{ alignItems: 'center', gap: '2', flex: 1, minWidth: 0 }}>
        <Icon as={FolderIcon} size="sm" css={{ flexShrink: 0 }} />

        <TextInput
          value={newFolderName}
          placeholder="Folder name"
          autoFocus
          css={{ flex: 1, minWidth: 0 }}
          onChange={(event) => setNewFolderName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onCreate();
            } else if (event.key === 'Escape') {
              event.preventDefault();
              onCancel();
            }
          }}
        />
      </Flex>

      <Flex css={{ alignItems: 'center', gap: '1', flexShrink: 0 }}>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={!newFolderName.trim()}
          onClick={onCreate}
        >
          <Icon as={CheckIcon} size="sm" />
        </Button>

        <Button type="button" size="sm" variant="secondary" onClick={onCancel}>
          <Icon as={XIcon} size="sm" />
        </Button>
      </Flex>
    </StyledNewItem>
  );
};
