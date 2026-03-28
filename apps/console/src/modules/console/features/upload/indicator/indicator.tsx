import { CircleAlertIcon, Maximize2Icon } from 'lucide-react';
import { Box, Flex } from '@buckethub/styled-system/jsx';
import { SystemStyleObject } from '@buckethub/styled-system/types';
import { Badge, Icon, IconButton, Progress, Reveal, Text, Tooltip } from '@buckethub/ui';
import { useUploadStore } from '../upload-store';
import { useUploadUiStore } from '../upload-ui-store';
import { useUploadProgress } from '../use-upload-progress';

interface UploadIndicatorProps {
  css?: SystemStyleObject;
}

export const UploadIndicator: React.FunctionComponent<UploadIndicatorProps> = ({ css }) => {
  const { ids } = useUploadStore();
  const { isMinimized, setIsMinimized } = useUploadUiStore();
  const { overallProgress, uploadingCount, failedCount } = useUploadProgress();

  const shouldShow = ids.length > 0 && isMinimized;

  return (
    <Reveal initial>
      {shouldShow && (
        <Reveal.Content css={css}>
          <Box
            css={{
              backgroundColor: 'background-base',
              borderRadius: 'xl',
              border: 'base',
              padding: '3',
              width: '100%',
              boxShadow: 'xs'
            }}
          >
            <Flex
              css={{
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Flex css={{ alignItems: 'center', gap: '2' }}>
                <Text variant="title-medium">Uploads</Text>
                <Badge variant="primary">{ids.length}</Badge>
              </Flex>

              <Flex css={{ alignItems: 'center' }}>
                {failedCount > 0 && (
                  <Tooltip>
                    <Tooltip.Trigger
                      render={
                        <Flex
                          css={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 'button-height-xs',
                            height: 'button-height-xs'
                          }}
                        >
                          <Icon as={CircleAlertIcon} size="sm" color="error" strokeWidth={2.5} />
                        </Flex>
                      }
                    />

                    <Tooltip.Content>
                      {failedCount} failed {failedCount === 1 ? 'upload' : 'uploads'}
                    </Tooltip.Content>
                  </Tooltip>
                )}

                <Tooltip>
                  <Tooltip.Trigger
                    render={
                      <IconButton variant="ghost" size="xs" onClick={() => setIsMinimized(false)}>
                        <Icon as={Maximize2Icon} size="sm" color="base" />
                      </IconButton>
                    }
                  />

                  <Tooltip.Content>Restore upload panel</Tooltip.Content>
                </Tooltip>
              </Flex>
            </Flex>

            <Reveal>
              {uploadingCount > 0 && (
                <Reveal.Content>
                  <Flex
                    css={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '2',
                      marginBottom: '2'
                    }}
                  >
                    <Text variant="body-medium-emphasized" color="muted">
                      {uploadingCount > 0 ? `${uploadingCount} uploading` : 'All uploads completed'}
                    </Text>

                    <Text variant="body-medium-emphasized" color="muted">
                      {overallProgress}%
                    </Text>
                  </Flex>

                  <Progress value={overallProgress} />
                </Reveal.Content>
              )}
            </Reveal>
          </Box>
        </Reveal.Content>
      )}
    </Reveal>
  );
};
