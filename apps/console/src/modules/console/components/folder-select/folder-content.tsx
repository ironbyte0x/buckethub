import { BucketId } from '@buckethub/rpc-contract';
import { Text } from '@buckethub/ui';
import { useObjects } from '@/services/objects';
import { StyledEmpty } from './folder-select.styled';
import { FolderSelectItem } from './item';

interface FolderSelectContentProps {
  bucketId: BucketId;
  currentPath: string;
  selectedPath: string;
  creating: boolean;
  onSelect: (path: string) => void;
}

export const FolderSelectContent: React.FunctionComponent<FolderSelectContentProps> = ({
  bucketId,
  currentPath,
  selectedPath,
  creating,
  onSelect
}) => {
  const { data: objects } = useObjects({
    bucketId,
    prefix: currentPath
  });

  const folders = objects.filter((object) => object.type === 'folder');

  if (folders.length === 0 && !creating) {
    return (
      <StyledEmpty>
        <Text variant="body-medium" color="muted">
          No directories in this location
        </Text>
      </StyledEmpty>
    );
  }

  return folders.map((folder) => (
    <FolderSelectItem
      key={folder.key}
      folder={folder}
      isSelected={selectedPath === folder.key}
      onSelect={onSelect}
    />
  ));
};
