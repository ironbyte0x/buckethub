import { Suspense, useMemo, useState } from 'react';
import { CheckIcon, DatabaseIcon } from 'lucide-react';
import { BucketId, ConnectionId } from '@buckethub/rpc-contract';
import { Box, Flex } from '@buckethub/styled-system/jsx';
import {
  Button,
  Checkbox,
  Field,
  Icon,
  Item,
  ResponsiveDialog,
  Reveal,
  Skeleton,
  Text
} from '@buckethub/ui';
import { ORPCError } from '@orpc/client';
import { TagManager } from '@/modules/console/features/tag-manager';
import {
  generateBucketId,
  useBuckets,
  useListBuckets,
  useListBucketsMetrics
} from '@/services/buckets';
import { useCollections } from '@/services/collections';
import { useAppForm } from '@/shared/form';
import { FieldError } from '@/shared/form/field-error';
import { formatBytes } from '@/shared/utils';
import { SelectBucketsEmptyFallback } from './empty';
import { SelectBucketsStepLoadingFallback } from './loading';
import { SelectBucketsSchema, selectBucketsSchema } from './schema';

interface BucketMetricsInfoProps {
  connectionId: ConnectionId;
  bucketNames: string[];
  bucketName: string;
}

const BucketMetricsInfo: React.FunctionComponent<BucketMetricsInfoProps> = ({
  connectionId,
  bucketNames,
  bucketName
}) => {
  const { data: metrics } = useListBucketsMetrics(connectionId, bucketNames);
  const bucketMetrics = metrics[bucketName];

  if (!bucketMetrics) {
    return null;
  }

  const qualifier = bucketMetrics.isComplete ? '' : '+';

  return (
    <Text variant="caption" color="muted">
      {formatBytes(bucketMetrics.totalSize)}
      {qualifier} • {bucketMetrics.totalObjects.toLocaleString()}
      {qualifier} objects
    </Text>
  );
};

interface SelectBucketsStepProps {
  connectionId: ConnectionId;
  onSuccess: () => void;
}

const SelectBucketsStepContent: React.FunctionComponent<SelectBucketsStepProps> = ({
  connectionId,
  onSuccess
}) => {
  const { bucketsCollection } = useCollections();
  const { data: buckets } = useListBuckets(connectionId);
  const { data: allBuckets } = useBuckets();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const addedBucketsData = useMemo(
    () => allBuckets.filter((bucket) => bucket.connectionId === connectionId),
    [allBuckets, connectionId]
  );

  const [addedBucketIds, setAddedBucketIds] = useState<Record<string, BucketId>>(() =>
    Object.fromEntries(addedBucketsData.map((bucket) => [bucket.name, bucket.id]))
  );

  const addedBuckets = useMemo(() => new Set(Object.keys(addedBucketIds)), [addedBucketIds]);

  const form = useAppForm({
    defaultValues: {
      buckets: buckets.map((bucket) => ({ name: bucket.name, checked: false }))
    } satisfies SelectBucketsSchema as SelectBucketsSchema,
    validators: {
      onChange: selectBucketsSchema
    },
    onSubmit: async ({ value, formApi }) => {
      if (isSubmitted) {
        onSuccess();

        return;
      }

      const promises = value.buckets.map(async (bucket) => {
        if (!bucket.checked) {
          return;
        }

        const bucketId = generateBucketId();

        const transaction = bucketsCollection.insert(
          {
            id: bucketId,
            name: bucket.name,
            connectionId,
            createdAt: new Date()
          },
          {
            optimistic: false
          }
        );

        await transaction.isPersisted.promise;

        setAddedBucketIds((previous) => ({
          ...previous,
          [bucket.name]: bucketId
        }));
      });

      const results = await Promise.allSettled(promises);

      const errors = results.reduce(
        (accumulator, result, index) => {
          if (result.status === 'rejected' && result.reason instanceof ORPCError) {
            accumulator[`buckets[${index}].checked`] = {
              message:
                result.reason instanceof ORPCError
                  ? result.reason.message
                  : 'An unexpected error occurred'
            };
          }

          return accumulator;
        },
        {} as Record<string, { message: string }>
      );

      if (Object.keys(errors).length > 0) {
        formApi.setErrorMap({
          onSubmit: {
            fields: errors
          }
        });
      } else {
        setIsSubmitted(true);
      }
    }
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        form.setErrorMap({
          onSubmit: {
            form: undefined,
            fields: {}
          }
        });

        form.handleSubmit();
      }}
    >
      <ResponsiveDialog.Body css={{ display: 'flex', flexDirection: 'column', gap: '2' }}>
        {buckets.length > 0 ? (
          <Flex css={{ flexDirection: 'column', gap: '3' }}>
            <Item.Content>
              <Item.Title>Choose which buckets you want to add</Item.Title>
            </Item.Content>

            {buckets.map((bucket, index) => {
              const isAdded = addedBuckets.has(bucket.name);
              const isCompleted = isSubmitted || isAdded;

              return (
                <Flex key={bucket.name} css={{ flexDirection: 'column', gap: '2' }}>
                  <form.AppField key={index} name={`buckets[${index}].checked`}>
                    {(field) => (
                      <Flex as={isCompleted ? 'div' : 'label'}>
                        <Field>
                          <Flex
                            css={{
                              flexDirection: 'column',
                              border: isCompleted ? 'base' : undefined,
                              borderRadius: 'lg'
                            }}
                          >
                            <Item
                              variant={isCompleted ? 'default' : 'outline'}
                              actionable={!isCompleted}
                              css={{
                                paddingBlock: '3.5',
                                paddingInline: '4',
                                width: '100%',
                                cursor: isCompleted ? 'default' : 'pointer'
                              }}
                            >
                              <Item.Media>
                                <Icon as={DatabaseIcon} size="xl" color="neutral" />
                              </Item.Media>

                              <Item.Content css={{ gap: '0.5' }}>
                                <Item.Title>{bucket.name}</Item.Title>

                                <Suspense
                                  fallback={<Skeleton css={{ width: '100px', height: '3.5' }} />}
                                >
                                  <BucketMetricsInfo
                                    connectionId={connectionId}
                                    bucketNames={buckets.map((b) => b.name)}
                                    bucketName={bucket.name}
                                  />
                                </Suspense>

                                <FieldError />
                              </Item.Content>

                              {isCompleted ? (
                                <Flex
                                  css={{
                                    width: '4.5',
                                    height: '4.5',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <Icon as={CheckIcon} css={{ color: 'text-subtle' }} />
                                </Flex>
                              ) : (
                                <Checkbox
                                  onCheckedChange={(checked) => {
                                    field.setValue(checked);
                                  }}
                                />
                              )}
                            </Item>

                            <Reveal initial={false}>
                              {isCompleted && (
                                <Reveal.Content>
                                  <Box
                                    css={{
                                      borderTop: 'base',
                                      paddingInline: '4',
                                      paddingBlock: '1',
                                      borderStyle: 'dashed',
                                      width: '100%'
                                    }}
                                  >
                                    <TagManager
                                      type="bucket"
                                      bucketId={addedBucketIds[bucket.name]}
                                    />
                                  </Box>
                                </Reveal.Content>
                              )}
                            </Reveal>
                          </Flex>
                        </Field>
                      </Flex>
                    )}
                  </form.AppField>
                </Flex>
              );
            })}

            <form.AppField name="buckets">
              {() => (
                <Field>
                  <FieldError />
                </Field>
              )}
            </form.AppField>
          </Flex>
        ) : (
          <SelectBucketsEmptyFallback />
        )}
      </ResponsiveDialog.Body>

      <ResponsiveDialog.Footer>
        <ResponsiveDialog.CloseTrigger
          render={(props) => (
            <Button variant="secondary" css={{ flex: '1' }} {...props}>
              Cancel
            </Button>
          )}
        />

        <form.Subscribe
          selector={(form) => ({
            hasBuckets: form.values.buckets.length > 0,
            hasNewBuckets: form.values.buckets.some(
              (bucket) => bucket.checked && !addedBuckets.has(bucket.name)
            )
          })}
        >
          {({ hasBuckets, hasNewBuckets }) => (
            <Button
              variant="primary"
              css={{ flex: '1' }}
              type="submit"
              loading={form.state.isSubmitting}
              disabled={isSubmitted ? false : !hasBuckets || !hasNewBuckets}
            >
              {isSubmitted ? 'Finish' : 'Add'}
            </Button>
          )}
        </form.Subscribe>
      </ResponsiveDialog.Footer>
    </form>
  );
};

export const SelectBucketsStep: React.FunctionComponent<SelectBucketsStepProps> = (props) => {
  return (
    <Suspense fallback={<SelectBucketsStepLoadingFallback />}>
      <SelectBucketsStepContent {...props} />
    </Suspense>
  );
};
