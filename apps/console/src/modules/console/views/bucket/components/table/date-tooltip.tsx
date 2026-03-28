import { TooltipTriggerProps } from '@base-ui/react/tooltip';
import { Text, Tooltip } from '@buckethub/ui';
import { relativeTime } from '@/shared/utils';

interface Payload {
  date: Date;
}

const handle = Tooltip.createHandle<Payload>();

const Root: React.FunctionComponent = () => {
  return (
    <Tooltip handle={handle}>
      {({ payload }) => {
        if (!payload) {
          return null;
        }

        const { date } = payload as Payload;
        const utcDate = date
          ?.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'UTC'
          })
          .replace(/,/g, '');

        return (
          <Tooltip.Content
            css={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              paddingInline: '3',
              paddingBlock: '3',
              rowGap: '2',
              columnGap: '2',
              alignItems: 'center'
            }}
          >
            <Text variant="body-medium" color="muted" css={{ textAlign: 'right' }}>
              UTC
            </Text>

            <Text variant="body-medium">{utcDate}</Text>

            <Text variant="body-medium" color="muted" css={{ textAlign: 'right' }}>
              Relative
            </Text>

            <Text variant="body-medium">{relativeTime(date)}</Text>

            <Text variant="body-medium" color="muted" css={{ textAlign: 'right' }}>
              Timestamp
            </Text>

            <Text variant="body-medium">{date.toISOString()}</Text>
          </Tooltip.Content>
        );
      }}
    </Tooltip>
  );
};

interface TriggerProps extends TooltipTriggerProps<Payload> {
  payload: Payload;
}

const Trigger: React.FunctionComponent<TriggerProps> = (props) => {
  return <Tooltip.Trigger handle={handle} {...props} />;
};

export const DateTooltip = Object.assign(Root, {
  Trigger
});
