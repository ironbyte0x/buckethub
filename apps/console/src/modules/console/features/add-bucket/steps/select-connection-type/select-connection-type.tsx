import { useState } from 'react';
import { PlugIcon, PlusIcon } from 'lucide-react';
import { Flex } from '@buckethub/styled-system/jsx';
import { Button, Icon, Item, Radio, ResponsiveDialog } from '@buckethub/ui';

export type ConnectionType = 'existing' | 'new';

interface SelectConnectionTypeStepProps {
  onNext: (type: ConnectionType) => void;
}

export const SelectConnectionTypeStep: React.FunctionComponent<SelectConnectionTypeStepProps> = ({
  onNext
}) => {
  const [type, setType] = useState<ConnectionType | null>(null);

  return (
    <>
      <ResponsiveDialog.Body css={{ display: 'flex', flexDirection: 'column', gap: '3' }}>
        <Item.Content>
          <Item.Title>How would you like to connect?</Item.Title>
          <Item.Description>Choose from existing connections or add a new one.</Item.Description>
        </Item.Content>

        <Flex css={{ flexDirection: 'column', gap: '2' }}>
          <Radio onValueChange={(value) => setType(value as ConnectionType)}>
            <label>
              <Item variant="outline" actionable>
                <Item.Media>
                  <Icon as={PlugIcon} size="xl" color="base" />
                </Item.Media>

                <Item.Content>
                  <Item.Title>Use existing connection</Item.Title>
                  <Item.Description>Select a connection from the list.</Item.Description>
                </Item.Content>

                <Radio.Item value="existing" />
              </Item>
            </label>

            <label>
              <Item variant="outline" actionable>
                <Item.Media>
                  <Icon as={PlusIcon} size="xl" color="base" />
                </Item.Media>

                <Item.Content>
                  <Item.Title>Add new connection</Item.Title>
                  <Item.Description>Create a new connection with credentials.</Item.Description>
                </Item.Content>

                <Radio.Item value="new" />
              </Item>
            </label>
          </Radio>
        </Flex>
      </ResponsiveDialog.Body>

      <ResponsiveDialog.Footer>
        <Button
          variant="primary"
          disabled={!type}
          css={{ flex: '1' }}
          onClick={() => {
            onNext(type as ConnectionType);
          }}
        >
          Next
        </Button>
      </ResponsiveDialog.Footer>
    </>
  );
};
