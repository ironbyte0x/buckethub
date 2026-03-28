import { useMemo } from 'react';
import { Loader2Icon, Minimize2Icon, XIcon } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { Flex } from '@buckethub/styled-system/jsx';
import { Badge, Fade, Icon, IconButton, Reveal, ScrollArea, Text, Tooltip } from '@buckethub/ui';
import { UploadStatus, useUploadStore } from '../upload-store';
import { useUploadUiStore } from '../upload-ui-store';
import { useUploadProgress } from '../use-upload-progress';
import { UploadItem } from './item';
import { StyledFooter, StyledHeader, StyledPanel } from './panel.styled';

const statusOrder: Record<UploadStatus, number> = {
  [UploadStatus.Uploading]: 0,
  [UploadStatus.Failed]: 1,
  [UploadStatus.Aborted]: 2,
  [UploadStatus.Completed]: 3
};

export const UploadPanel: React.FunctionComponent = () => {
  const {
    ids,
    uploads,
    actions: { clearCompleted }
  } = useUploadStore();
  const { isMinimized, setIsMinimized } = useUploadUiStore();
  const { overallProgress, uploadingCount } = useUploadProgress();

  const hasCompleted = useMemo(
    () => ids.some((id) => uploads[id].status === UploadStatus.Completed),
    [ids, uploads]
  );

  const sortedIds = useMemo(() => {
    return [...ids].sort((a, b) => {
      const statusA = uploads[a].status;
      const statusB = uploads[b].status;

      return statusOrder[statusA] - statusOrder[statusB];
    });
  }, [ids, uploads]);

  const shouldShow = ids.length > 0 && !isMinimized;

  return (
    <AnimatePresence>
      {shouldShow && (
        <StyledPanel
          initial={{
            translateY: 'calc(100% + 40px)'
          }}
          animate={{
            translateY: 0
          }}
          exit={{
            translateY: 'calc(100% + 40px)'
          }}
          transition={{
            type: 'spring',
            stiffness: 320,
            damping: 34
          }}
        >
          <StyledHeader>
            <Flex css={{ alignItems: 'center', gap: '2' }}>
              <Text variant="title-medium">Uploads</Text>
              <Badge variant="primary">{ids.length}</Badge>
            </Flex>

            <Flex css={{ alignItems: 'center', gap: '1' }}>
              <Fade>
                {hasCompleted && (
                  <Tooltip>
                    <Tooltip.Trigger
                      render={
                        <Fade.Content>
                          <IconButton variant="ghost" size="xs" onClick={clearCompleted}>
                            <Icon as={XIcon} color="base" />
                          </IconButton>
                        </Fade.Content>
                      }
                    />

                    <Tooltip.Content>Clear completed</Tooltip.Content>
                  </Tooltip>
                )}
              </Fade>

              <Tooltip>
                <Tooltip.Trigger
                  render={
                    <IconButton
                      variant="ghost"
                      size="xs"
                      css={{ marginRight: '-2' }}
                      onClick={() => setIsMinimized(true)}
                    >
                      <Icon as={Minimize2Icon} size="sm" color="base" />
                    </IconButton>
                  }
                />

                <Tooltip.Content>Minimize panel</Tooltip.Content>
              </Tooltip>
            </Flex>
          </StyledHeader>

          <ScrollArea>
            <ScrollArea.Viewport>
              <ScrollArea.Content css={{ minWidth: 'unset !important' }}>
                <AnimatePresence mode="sync" initial={false}>
                  {sortedIds.map((uploadId) => {
                    const upload = uploads[uploadId];

                    return <UploadItem key={uploadId} item={upload} />;
                  })}
                </AnimatePresence>
              </ScrollArea.Content>
            </ScrollArea.Viewport>

            <ScrollArea.Gradient />

            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb
                css={{
                  '&::before': {
                    minWidth: 'unset'
                  }
                }}
              />
            </ScrollArea.Scrollbar>
          </ScrollArea>

          <Reveal>
            {uploadingCount > 0 && (
              <Reveal.Content>
                <StyledFooter>
                  <Text variant="body-medium-emphasized" color="muted">
                    {uploadingCount} file{uploadingCount > 1 ? 's' : ''} uploading
                  </Text>

                  <Flex css={{ alignItems: 'center', gap: '2' }}>
                    <Icon
                      as={Loader2Icon}
                      size="xs"
                      color="base"
                      css={{
                        animation: 'spin 1s linear infinite'
                      }}
                    />

                    <Text variant="body-medium-accent" color="base">
                      {overallProgress}%
                    </Text>
                  </Flex>
                </StyledFooter>
              </Reveal.Content>
            )}
          </Reveal>
        </StyledPanel>
      )}
    </AnimatePresence>
  );
};
