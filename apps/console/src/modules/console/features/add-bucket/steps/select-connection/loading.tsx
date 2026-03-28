import { Flex } from '@buckethub/styled-system/jsx';
import { Button, Item, ResponsiveDialog, Skeleton } from '@buckethub/ui';

export const SelectConnectionLoadingFallback: React.FunctionComponent = () => {
  return (
    <>
      <ResponsiveDialog.Body css={{ display: 'flex', flexDirection: 'column', gap: '2' }}>
        <Flex css={{ flexDirection: 'column', gap: '5' }}>
          <Item.Content>
            <Item.Title>Select connection</Item.Title>
            <Item.Description>Choose an existing connection or create a new one.</Item.Description>
          </Item.Content>

          <Flex css={{ flexDirection: 'column', gap: '2' }}>
            <Skeleton css={{ height: '5', width: '16' }} />
            <Skeleton css={{ height: '9', width: 'full' }} />
          </Flex>
        </Flex>
      </ResponsiveDialog.Body>

      <ResponsiveDialog.Footer>
        <Button variant="primary" css={{ flex: '1' }} disabled>
          Next
        </Button>
      </ResponsiveDialog.Footer>
    </>
  );
};
