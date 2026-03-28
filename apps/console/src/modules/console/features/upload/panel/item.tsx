import { CircleMinusIcon, Loader2Icon, RefreshCwIcon, XIcon } from 'lucide-react';
import { Flex } from '@buckethub/styled-system/jsx';
import { Icon, IconButton, Progress, Text, Tooltip } from '@buckethub/ui';
import { formatBytes } from '@/shared/utils';
import { UploadItem as TUploadItem, UploadStatus, useUploadStore } from '../upload-store';
import { useUploader } from '../use-uploader';
import { FailedIcon, SuccessIcon } from './icons';
import { StyledItem } from './item.styled';

interface UploadItemProps {
  item: TUploadItem;
}

export const UploadItem: React.FunctionComponent<UploadItemProps> = ({
  item: { id, status, progress, object, abortController }
}) => {
  const { removeUpload } = useUploadStore((store) => store.actions);
  const { retry } = useUploader();

  return (
    <StyledItem
      initial={{
        opacity: 0,
        height: 0,
        paddingBlock: 0
      }}
      animate={{
        opacity: 1,
        height: 'auto',
        paddingBlock: 'var(--padding-block)'
      }}
      exit={{
        opacity: 0,
        height: 0,
        paddingBlock: 0
      }}
      transition={{
        type: 'keyframes',
        ease: 'easeOut'
      }}
    >
      {status === UploadStatus.Uploading ? (
        <Icon
          as={Loader2Icon}
          size="md"
          color="base"
          css={{
            animation: 'spin 1s linear infinite'
          }}
        />
      ) : status === UploadStatus.Completed ? (
        <Icon as={SuccessIcon} size="md" color="base" />
      ) : status === UploadStatus.Failed ? (
        <Icon as={FailedIcon} size="md" />
      ) : status === UploadStatus.Aborted ? (
        <Icon
          as={CircleMinusIcon}
          size="md"
          css={{ fill: 'background-surface-warning', color: 'warning.500' }}
        />
      ) : null}

      <Flex
        css={{
          flex: '1',
          flexDirection: 'column',
          minWidth: '0',
          marginTop: '-7px'
        }}
      >
        <Flex
          css={{
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text
            variant="body-medium"
            title={object.path + object.name}
            truncate
            css={{
              direction: 'rtl',
              marginRight: '2'
            }}
          >
            {object.path}
            {object.name}
          </Text>

          <Flex css={{ marginRight: '-1.5' }}>
            {status === UploadStatus.Failed && (
              <Tooltip>
                <Tooltip.Trigger
                  render={
                    <IconButton variant="ghost" size="xs" onClick={() => retry(id)}>
                      <Icon as={RefreshCwIcon} size="xs" color="base" />
                    </IconButton>
                  }
                />

                <Tooltip.Content>Retry upload</Tooltip.Content>
              </Tooltip>
            )}

            <Tooltip>
              <Tooltip.Trigger
                render={
                  <IconButton
                    variant="ghost"
                    size="2xs"
                    color="base"
                    onClick={() => {
                      if (status === UploadStatus.Uploading) {
                        abortController.abort();
                      } else {
                        removeUpload(id);
                      }
                    }}
                  >
                    <Icon as={XIcon} size="sm" color="base" />
                  </IconButton>
                }
              />

              <Tooltip.Content>
                {status === UploadStatus.Uploading ? 'Cancel upload' : 'Remove'}
              </Tooltip.Content>
            </Tooltip>
          </Flex>
        </Flex>

        <Flex
          css={{
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2'
          }}
        >
          <Text variant="body-small-emphasized" color="muted">
            {status === UploadStatus.Completed
              ? formatBytes(object.size)
              : `${formatBytes((progress * object.size) / 100)} of ${formatBytes(object.size)}`}
          </Text>

          <Text variant="body-small-emphasized" color="muted">
            {Math.round(progress)}%
          </Text>
        </Flex>

        <Progress
          value={progress}
          variant={
            status === UploadStatus.Aborted
              ? 'warning'
              : status === UploadStatus.Failed
                ? 'destructive'
                : 'default'
          }
        />
      </Flex>
    </StyledItem>
  );
};
