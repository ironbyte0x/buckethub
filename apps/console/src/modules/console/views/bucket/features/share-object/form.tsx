import { useMemo, useState } from 'react';
import { Duration } from '@buckethub/core';
import { BucketId, FileObject } from '@buckethub/rpc-contract';
import { Box, Flex, Grid } from '@buckethub/styled-system/jsx';
import { ButtonGroup, CopyIconButton, Field, InputGroup, Text, TextInput } from '@buckethub/ui';
import { useShareUrl } from '@/services/objects';
import { ErrorAlert } from '@/shared/form/error-alert';

interface ShareObjectFormProps {
  bucketId: BucketId;
  object: FileObject;
}

const MAX_DAYS = 7;

const MIN_EXPIRES_IN = Duration.inMinutes(1).toSeconds();
const MAX_EXPIRES_IN = Duration.inDays(MAX_DAYS).toSeconds();

export const ShareObjectForm: React.FunctionComponent<ShareObjectFormProps> = ({
  bucketId,
  object
}) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const [currentTime] = useState(() => Date.now());

  const expiresIn = useMemo(() => {
    return (
      Duration.inDays(days).toSeconds() +
      Duration.inHours(hours).toSeconds() +
      Duration.inMinutes(minutes).toSeconds()
    );
  }, [days, hours, minutes]);

  const isValid = expiresIn >= MIN_EXPIRES_IN && expiresIn <= MAX_EXPIRES_IN;

  if (!object.key) {
    throw new Error('Object key is required to generate share URL');
  }

  const { data, isError } = useShareUrl({
    bucketId,
    key: object.key,
    expiresIn: Math.max(MIN_EXPIRES_IN, Math.min(expiresIn, MAX_EXPIRES_IN))
  });

  const expirationDate = useMemo(() => {
    if (!expiresIn) {
      return null;
    }

    const date = new Date(currentTime + expiresIn * 1000);

    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }, [expiresIn, currentTime]);

  const onChange = (value: string, setter: (value: number) => void, max: number) => {
    const numberValue = value === '' ? 0 : parseInt(value, 10);

    if (!isNaN(numberValue) && numberValue >= 0 && numberValue <= max) {
      setter(numberValue);
    }
  };

  return (
    <Flex css={{ flexDirection: 'column', gap: '5' }}>
      <Box>
        <Text variant="body-medium" color="muted">
          Generate a temporary URL to share this object without requiring login. The link expires at
          the configured time or when your session ends, whichever comes first.
        </Text>
      </Box>

      <ErrorAlert
        show={isError}
        title="Failed to generate share link"
        description="An unexpected error occurred. Please try again."
      />

      <Box
        css={{
          borderRadius: 'xl',
          overflow: 'hidden',
          backgroundColor: 'background-surface',
          paddingInline: '1'
        }}
      >
        <Flex
          css={{
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBlock: '3',
            paddingInline: '3',
            gap: '4'
          }}
        >
          <Text variant="body-medium" color="muted">
            Active for
          </Text>
        </Flex>

        <Box
          css={{
            padding: '4',
            borderRadius: 'lg',
            border: 'base',
            backgroundColor: 'background-base'
          }}
        >
          <Grid
            css={{
              gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
              gap: '4',
              alignItems: 'start'
            }}
          >
            <ButtonGroup>
              <TextInput
                type="number"
                min="0"
                max={MAX_DAYS}
                value={days.toString()}
                onChange={(event) => onChange(event.target.value, setDays, MAX_DAYS)}
              />

              <ButtonGroup.Text css={{ width: '100px' }}>Days</ButtonGroup.Text>
            </ButtonGroup>

            <ButtonGroup>
              <TextInput
                type="number"
                min="0"
                max="23"
                value={hours.toString()}
                onChange={(event) => onChange(event.target.value, setHours, 23)}
              />

              <ButtonGroup.Text css={{ width: '100px' }}>Hours</ButtonGroup.Text>
            </ButtonGroup>

            <ButtonGroup>
              <TextInput
                type="number"
                min="0"
                max="59"
                value={minutes.toString()}
                onChange={(event) => onChange(event.target.value, setMinutes, 59)}
              />

              <ButtonGroup.Text css={{ width: '100px' }}>Minutes</ButtonGroup.Text>
            </ButtonGroup>
          </Grid>

          <Field.Error>
            {!isValid && (
              <Box css={{ marginTop: '2' }}>
                {expiresIn < 60 ? 'Minimum duration is 1 minute' : 'Maximum duration is 7 days'}
              </Box>
            )}
          </Field.Error>
        </Box>

        <Flex
          css={{
            paddingInline: '3',
            paddingBlock: '3'
          }}
        >
          <Text variant="body-medium" color="muted">
            Link expiration:{' '}
            {expirationDate
              ? expirationDate
              : 'Set a duration to calculate the exact expiration time.'}
          </Text>
        </Flex>
      </Box>

      <InputGroup>
        <InputGroup.Input
          readOnly
          value={data?.url}
          onClick={(event) => event.currentTarget.select()}
        />

        <InputGroup.Addon align="inline-end">
          <CopyIconButton disabled={!data?.url} content={data?.url ?? ''} />
        </InputGroup.Addon>
      </InputGroup>
    </Flex>
  );
};
