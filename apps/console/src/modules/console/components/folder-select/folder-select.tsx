import { Suspense, useState } from 'react';
import { FolderPlusIcon } from 'lucide-react';
import { BucketId } from '@buckethub/rpc-contract';
import { Box, Flex } from '@buckethub/styled-system/jsx';
import { AnimatedPanel, Button, Icon, Skeleton } from '@buckethub/ui';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { FolderBreadcrumbs } from './breadcrumbs';
import { FolderSelectContent } from './folder-content';
import { StyledList, StyledRoot } from './folder-select.styled';
import { FolderSelectNewItem } from './new-item';

interface FolderSelectProps {
  bucketId: BucketId;
  defaultValue?: string;
  value?: string;
  onValueChange: (path: string) => void;
}

function getBreadcrumbParts(path: string): string[] {
  if (!path) {
    return [];
  }

  return path.split('/').filter(Boolean);
}

export const FolderSelect: React.FunctionComponent<FolderSelectProps> = ({
  bucketId,
  defaultValue,
  value,
  onValueChange
}) => {
  const [currentPath, setCurrentPath] = useControllableState({
    defaultProp: defaultValue ?? '',
    prop: value,
    onChange: onValueChange
  });
  const [isCreating, setIsCreating] = useState(false);

  const breadcrumbParts = getBreadcrumbParts(currentPath);

  const navigateToPath = (index: number) => {
    if (index === -1) {
      setCurrentPath('');
    } else {
      const newPath = breadcrumbParts.slice(0, index + 1).join('/') + '/';

      setCurrentPath(newPath);
    }

    setIsCreating(false);
  };

  return (
    <StyledRoot>
      <Flex
        css={{
          paddingLeft: '3',
          paddingRight: '2',
          paddingBlock: '2',
          borderBottom: '1px solid {colors.border-input}',
          backgroundColor: 'background-base',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '2',
          alignItems: 'center'
        }}
      >
        <FolderBreadcrumbs items={breadcrumbParts} onSelect={navigateToPath} />

        <Button type="button" size="xs" variant="secondary" onClick={() => setIsCreating(true)}>
          <Icon as={FolderPlusIcon} size="sm" />
          New
        </Button>
      </Flex>

      <AnimatedPanel>
        <StyledList>
          <Suspense
            fallback={
              <Box css={{ padding: '4' }}>
                <Skeleton css={{ width: '100%', height: '8', marginBottom: '0.5' }} />
                <Skeleton css={{ width: '100%', height: '8', marginBottom: '0.5' }} />
                <Skeleton css={{ width: '100%', height: '8' }} />
              </Box>
            }
          >
            {isCreating && (
              <FolderSelectNewItem
                onCancelCreate={() => setIsCreating(false)}
                onCreate={(name) => {
                  const path = currentPath + name + '/';

                  setCurrentPath(path);
                  setIsCreating(false);
                }}
              />
            )}

            <FolderSelectContent
              bucketId={bucketId}
              currentPath={currentPath}
              selectedPath={currentPath}
              creating={isCreating}
              onSelect={(path) => {
                setCurrentPath(path);
                setIsCreating(false);
              }}
            />
          </Suspense>
        </StyledList>
      </AnimatedPanel>
    </StyledRoot>
  );
};
