import { Suspense } from 'react';
import { ConnectionId } from '@buckethub/rpc-contract';
import { Flex } from '@buckethub/styled-system/jsx';
import { Button, Item, Radio, ResponsiveDialog, ScrollArea, SearchInput } from '@buckethub/ui';
import { SearchKeys, useSearch } from '@/modules/console/hooks';
import { useConnections } from '@/services/connections';
import { useAppForm } from '@/shared/form';
import { SelectConnectionLoadingFallback } from './loading';
import { SelectConnectionSchema, selectConnectionSchema } from './schema';

interface MappedConnection {
  value: string;
  label: string;
}

const SEARCH_KEYS: SearchKeys<MappedConnection> = ['label'];

interface ConnectionStepProps {
  onBack: () => void;
  onNext: (data: { id: ConnectionId }) => void;
}

const ConnectionSelectContent: React.FunctionComponent<ConnectionStepProps> = ({
  onBack,
  onNext
}) => {
  const { data: existingConnections } = useConnections();

  const form = useAppForm({
    defaultValues: {} satisfies Partial<SelectConnectionSchema> as SelectConnectionSchema,
    validators: {
      onSubmit: selectConnectionSchema
    },
    onSubmit: async ({ value }) => {
      onNext({ id: value.connectionId as ConnectionId });
    }
  });

  const connections = existingConnections.map<MappedConnection>((connection) => ({
    value: String(connection.id),
    label: connection.label
  }));

  const {
    results: filteredConnections,
    setSearchTerm,
    shouldShowSearch
  } = useSearch(connections, SEARCH_KEYS);

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
        <Flex css={{ flexDirection: 'column', gap: '3' }}>
          <Item.Content>
            <Item.Title>Select connection</Item.Title>
            <Item.Description>Choose an existing connection or create a new one.</Item.Description>
          </Item.Content>

          {shouldShowSearch && (
            <SearchInput placeholder="Search connections..." onChange={setSearchTerm} />
          )}

          <form.AppField name="connectionId">
            {(field) => (
              <ScrollArea>
                <ScrollArea.Viewport>
                  <ScrollArea.Content
                    css={{
                      maxHeight: '318px',

                      '&[data-has-overflow-y]': {
                        paddingRight: '4'
                      }
                    }}
                  >
                    <Radio
                      css={{
                        flexDirection: 'column',
                        gap: '4'
                      }}
                      onValueChange={(value) => field.setValue(value as string)}
                    >
                      {filteredConnections.map((item) => (
                        <label key={item.value}>
                          <Item variant="outline" actionable>
                            <Item.Content>
                              <Item.Title>{item.label}</Item.Title>
                            </Item.Content>

                            <Radio.Item value={item.value} />
                          </Item>
                        </label>
                      ))}
                    </Radio>
                  </ScrollArea.Content>
                </ScrollArea.Viewport>

                <ScrollArea.Gradient />

                <ScrollArea.Scrollbar orientation="vertical">
                  <ScrollArea.Thumb />
                </ScrollArea.Scrollbar>
              </ScrollArea>
            )}
          </form.AppField>
        </Flex>
      </ResponsiveDialog.Body>

      <ResponsiveDialog.Footer>
        <Button variant="secondary" css={{ flex: '1' }} type="button" onClick={onBack}>
          Back
        </Button>

        <Button variant="primary" css={{ flex: '1' }}>
          Next
        </Button>
      </ResponsiveDialog.Footer>
    </form>
  );
};

export const SelectConnectionStep: React.FunctionComponent<ConnectionStepProps> = (props) => {
  return (
    <Suspense fallback={<SelectConnectionLoadingFallback />}>
      <ConnectionSelectContent {...props} />
    </Suspense>
  );
};
