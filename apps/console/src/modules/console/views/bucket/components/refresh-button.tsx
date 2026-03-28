import { useRef, useState } from 'react';
import { RefreshCwIcon } from 'lucide-react';
import { animate } from 'motion/react';
import { anchoredToast, Button, Icon } from '@buckethub/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useObjectsLazy } from '@/services/objects';
import { useNavigationData } from '../use-navigation-data';

export const RefreshButton: React.FunctionComponent = () => {
  const queryClient = useQueryClient();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLElement>(null);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const { bucketId, prefix } = useNavigationData();
  const { isLoading, refetch } = useObjectsLazy({ bucketId, prefix });

  const onRefreshClick = async () => {
    setIsRefreshed(true);

    if (!iconRef.current) {
      throw new Error('Icon ref is not set');
    }

    refetch();

    do {
      await animate(
        iconRef.current,
        {
          transform: ['rotate(0deg)', 'rotate(360deg)']
        },
        {
          ease: 'linear',
          duration: 1
        }
      );
    } while (queryClient.isFetching() > 0);

    anchoredToast.add({
      description: 'Refreshed',
      positionerProps: {
        anchor: buttonRef.current,
        sideOffset: 8
      },
      timeout: 1500,
      onClose() {
        setIsRefreshed(false);
      }
    });
  };

  return (
    <Button
      ref={buttonRef}
      variant="secondary"
      size="sm"
      disabled={isLoading || isRefreshed}
      onClick={onRefreshClick}
    >
      <Icon ref={iconRef} as={RefreshCwIcon} size="sm" />
      Refresh
    </Button>
  );
};
