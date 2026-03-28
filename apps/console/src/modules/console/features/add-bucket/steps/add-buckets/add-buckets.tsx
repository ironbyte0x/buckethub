import { useEffect, useState } from 'react';
import { AlertCircleIcon, CheckIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { BucketId, ConnectionId } from '@buckethub/rpc-contract';
import { Box, Flex } from '@buckethub/styled-system/jsx';
import {
  Button,
  Field,
  Icon,
  IconButton,
  Item,
  ResponsiveDialog,
  Reveal,
  State,
  TextInput
} from '@buckethub/ui';
import { ORPCError } from '@orpc/client';
import { useStore } from '@tanstack/react-form';
import { TagManager } from '@/modules/console/features/tag-manager';
import { generateBucketId } from '@/services/buckets';
import { useCollections } from '@/services/collections';
import { useAppForm } from '@/shared/form';
import { FieldError } from '@/shared/form/field-error';
import { AddBucketsSchema, addBucketsSchema } from './schema';

interface AddBucketsStepProps {
  connectionId: ConnectionId;
  onDirty?: () => void;
  onSuccess: () => void;
}

export const AddBucketsStep: React.FunctionComponent<AddBucketsStepProps> = ({
  connectionId,
  onDirty,
  onSuccess
}) => {
  const { bucketsCollection } = useCollections();
  const [addedBuckets, setAddedBuckets] = useState<Set<string>>(new Set());
  const [addedBucketIds, setAddedBucketIds] = useState<Record<string, BucketId>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useAppForm({
    defaultValues: {
      buckets: [{ name: '' }]
    } satisfies AddBucketsSchema as AddBucketsSchema,
    validators: {
      onSubmit: addBucketsSchema
    },
    onSubmit: async ({ value, formApi }) => {
      if (isSubmitted) {
        onSuccess();

        return;
      }

      const promises = value.buckets.map(async (bucket) => {
        if (addedBuckets.has(bucket.name)) {
          return;
        }

        const bucketId = generateBucketId();

        const transaction = bucketsCollection.insert({
          id: bucketId,
          name: bucket.name,
          connectionId,
          createdAt: new Date()
        });

        await transaction.isPersisted.promise;

        setAddedBuckets((previous) => new Set(previous).add(bucket.name));

        setAddedBucketIds((previous) => ({
          ...previous,
          [bucket.name]: bucketId
        }));
      });

      const results = await Promise.allSettled(promises);

      const errors = results.reduce(
        (accumulator, result, index) => {
          if (result.status === 'rejected' && result.reason instanceof ORPCError) {
            accumulator[`buckets[${index}].name`] = {
              message: result.reason.message
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

  const isDirty = useStore(form.store, (state) => state.isDirty);

  useEffect(() => {
    if (isDirty) {
      onDirty?.();
    }
  }, [isDirty, onDirty]);

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
        <Flex css={{ flexDirection: 'column', gap: '5' }}>
          <State
            css={{
              backgroundColor: 'background-surface',
              borderRadius: 'xl',
              border: 'base',
              padding: '4 !important'
            }}
          >
            <State.Header>
              <State.Media variant="default" css={{ marginBottom: '1' }}>
                <Icon as={AlertCircleIcon} size="2xl" color="error" />
              </State.Media>

              <State.Title>Failed to list buckets</State.Title>

              <State.Description>
                Your connection doesn't have permission to list buckets automatically. You can still
                add buckets by entering their names manually.
              </State.Description>
            </State.Header>
          </State>

          <Flex
            css={{
              flexDirection: 'column',
              gap: '4',
              padding: '5',
              borderRadius: 'xl',
              border: 'base'
            }}
          >
            <Item.Content>
              <Item.Title>Bucket names</Item.Title>
              <Item.Description>Enter the names of buckets you want to add</Item.Description>
            </Item.Content>

            <form.Field name="buckets" mode="array">
              {(field) => (
                <Flex
                  css={{
                    flexDirection: 'column',
                    gap: '3'
                  }}
                >
                  {field.state.value.map((bucket, index) => (
                    <form.AppField key={index} name={`buckets[${index}].name`}>
                      {(nameField) => (
                        <form.Subscribe>
                          {({ fieldMeta }) => {
                            const isError = !!fieldMeta[`buckets[${index}].name`]?.errors.length;
                            const isAdded = addedBuckets.has(bucket.name);
                            const bucketId = addedBucketIds[bucket.name];

                            return (
                              <Field css={{ flexDirection: 'column' }}>
                                <Flex css={{ gap: '2', alignItems: 'center' }}>
                                  <TextInput
                                    name={nameField.name}
                                    placeholder={
                                      index === 0
                                        ? 'db-backup'
                                        : index === 1
                                          ? 'user-uploads'
                                          : 'Enter bucket name'
                                    }
                                    error={isError}
                                    disabled={isAdded}
                                    // eslint-disable-next-line react/jsx-handler-names
                                    onBlur={nameField.handleBlur}
                                    onChange={(event) => nameField.handleChange(event.target.value)}
                                  />

                                  {isAdded ? (
                                    <Flex
                                      css={{
                                        width: '9',
                                        height: '9',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                    >
                                      <Icon as={CheckIcon} css={{ color: 'text-success' }} />
                                    </Flex>
                                  ) : (
                                    <IconButton
                                      type="button"
                                      aria-label="Remove bucket"
                                      css={{ color: 'text-error' }}
                                      onClick={() => field.removeValue(index)}
                                    >
                                      <Icon as={Trash2Icon} />
                                    </IconButton>
                                  )}
                                </Flex>

                                <FieldError />

                                <Reveal>
                                  {!!bucketId && (
                                    <Reveal.Content>
                                      <Box css={{ paddingTop: '3', width: '100%' }}>
                                        <TagManager type="bucket" bucketId={bucketId} />
                                      </Box>
                                    </Reveal.Content>
                                  )}
                                </Reveal>
                              </Field>
                            );
                          }}
                        </form.Subscribe>
                      )}
                    </form.AppField>
                  ))}

                  <Reveal>
                    {!isSubmitted && (
                      <Reveal.Content css={{ width: '100%' }}>
                        <Button
                          variant="secondary"
                          type="button"
                          disabled={form.state.isSubmitting}
                          css={{ width: '100%' }}
                          onClick={() => field.pushValue({ name: '' })}
                        >
                          <Icon as={PlusIcon} />
                          Add another
                        </Button>
                      </Reveal.Content>
                    )}
                  </Reveal>
                </Flex>
              )}
            </form.Field>
          </Flex>
        </Flex>
      </ResponsiveDialog.Body>

      <ResponsiveDialog.Footer>
        <ResponsiveDialog.CloseTrigger
          render={(props) => (
            <Button variant="secondary" css={{ flex: '1' }} {...props}>
              Cancel
            </Button>
          )}
        />

        <Button
          variant="primary"
          css={{ flex: '1' }}
          type="submit"
          loading={form.state.isSubmitting}
        >
          {isSubmitted ? 'Finish' : 'Add'}
        </Button>
      </ResponsiveDialog.Footer>
    </form>
  );
};
