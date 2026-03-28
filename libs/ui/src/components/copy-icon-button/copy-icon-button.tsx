import { useRef, useState } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { SystemStyleObject } from '@buckethub/styled-system/types';
import { Icon } from '../icon';
import { anchoredToastManager } from '../toast/toast-manager';
import { Tooltip } from '../tooltip';
import { StyledButton } from './copy-icon-button.styled';

interface CopyIconButtonProps {
  content: string;
  css?: SystemStyleObject;
  disabled?: boolean;
}

export const CopyIconButton: React.FunctionComponent<CopyIconButtonProps> = ({
  content,
  css = {},
  disabled
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const onCopyClick = async () => {
    if (!navigator?.clipboard) {
      throw new Error('Clipboard API not available');
    }

    await navigator.clipboard.writeText(content);

    setIsCopied(true);

    anchoredToastManager.add({
      description: 'Copied',
      positionerProps: {
        anchor: buttonRef.current,
        sideOffset: 8
      },
      timeout: 1500,
      onClose() {
        setIsCopied(false);
      }
    });
  };

  return (
    <Tooltip
      disabled={isCopied}
      onOpenChange={(open, eventDetails) => {
        if (eventDetails.reason === 'trigger-press') {
          eventDetails.cancel();
        }
      }}
    >
      <Tooltip.Trigger
        ref={buttonRef}
        render={<StyledButton css={css} disabled={disabled || isCopied} />}
        onClick={onCopyClick}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isCopied ? 'check' : 'copy'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isCopied ? <Icon as={CheckIcon} size="sm" /> : <Icon as={CopyIcon} size="sm" />}
          </motion.div>
        </AnimatePresence>
      </Tooltip.Trigger>

      <Tooltip.Content>Copy</Tooltip.Content>
    </Tooltip>
  );
};
