import { Loader2Icon, XIcon } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { Flex } from '@buckethub/styled-system/jsx';
import { Icon, IconButton, Progress, Text, Tooltip } from '@buckethub/ui';
import { DownloadZipStatus, useDownloadZipStore } from '../download-zip-store';
import { useDownloadZipProgress } from '../use-download-zip-progress';
import { StyledPanel } from './panel.styled';

export const DownloadZipPanel: React.FunctionComponent = () => {
  const { activeDownload, overallProgress, isActive } = useDownloadZipProgress();
  const { clearDownload } = useDownloadZipStore((state) => state.actions);

  const onClose = () => {
    if (isActive && activeDownload) {
      activeDownload.abortController.abort();
    }

    clearDownload();
  };

  const statusText = () => {
    if (!activeDownload) {
      return '';
    }

    switch (activeDownload.status) {
      case DownloadZipStatus.Fetching:
        return `Fetching ${activeDownload.fetchedFiles}/${activeDownload.totalFiles} files...`;
      case DownloadZipStatus.Zipping:
        return 'Creating zip archive...';
      case DownloadZipStatus.Completed:
        return 'Download complete';
      case DownloadZipStatus.Cancelled:
        return 'Download cancelled';
      case DownloadZipStatus.Failed:
        return `Failed: ${activeDownload.error}`;
      default:
        return '';
    }
  };

  const shouldShow = activeDownload !== null;

  return (
    <AnimatePresence>
      {shouldShow && (
        <StyledPanel
          initial={{ translateY: 'calc(100% + 40px)' }}
          animate={{ translateY: 0 }}
          exit={{ translateY: 'calc(100% + 40px)' }}
          transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        >
          <Flex css={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="title-medium">Download</Text>

            <Tooltip>
              <Tooltip.Trigger
                render={
                  <IconButton
                    variant="ghost"
                    size="xs"
                    css={{ marginRight: '-2' }}
                    onClick={onClose}
                  >
                    <Icon as={XIcon} size="sm" />
                  </IconButton>
                }
              />

              <Tooltip.Content>{isActive ? 'Cancel download' : 'Close'}</Tooltip.Content>
            </Tooltip>
          </Flex>

          <Progress value={overallProgress} />

          <Flex
            css={{
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '3'
            }}
          >
            <Text variant="body-medium-emphasized" color="muted">
              {statusText()}
            </Text>

            <Flex css={{ alignItems: 'center', gap: '2' }}>
              {isActive && (
                <Icon as={Loader2Icon} size="xs" css={{ animation: 'spin 1s linear infinite' }} />
              )}

              <Text variant="body-medium-accent">{overallProgress}%</Text>
            </Flex>
          </Flex>
        </StyledPanel>
      )}
    </AnimatePresence>
  );
};
