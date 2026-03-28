import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button';
import { ResponsiveDialog } from './responsive-dialog';

const meta: Meta<typeof ResponsiveDialog> = {
  component: ResponsiveDialog,
  title: 'Components/ResponsiveDialog'
} satisfies Meta<typeof ResponsiveDialog>;

export default meta;

type Story = StoryObj<typeof ResponsiveDialog>;

export const Basic: Story = {
  render: () => (
    <ResponsiveDialog>
      <ResponsiveDialog.Trigger>
        <Button variant="primary">Open</Button>
      </ResponsiveDialog.Trigger>

      <ResponsiveDialog.Content>
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>Responsive Dialog</ResponsiveDialog.Title>
          <ResponsiveDialog.Description>
            Resize the browser to see it switch between Dialog and Drawer.
          </ResponsiveDialog.Description>
          <ResponsiveDialog.Close />
        </ResponsiveDialog.Header>

        <ResponsiveDialog.Body>
          <p>Above 1024px this renders as a centered Dialog.</p>
          <p>Below 1024px this renders as a bottom Drawer.</p>
        </ResponsiveDialog.Body>

        <ResponsiveDialog.Footer>
          <ResponsiveDialog.CloseTrigger>
            <Button variant="secondary">Cancel</Button>
          </ResponsiveDialog.CloseTrigger>
          <Button variant="primary">Confirm</Button>
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  )
};

const ControlledExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Controlled
      </Button>

      <ResponsiveDialog open={open} onOpenChange={setOpen}>
        <ResponsiveDialog.Content>
          <ResponsiveDialog.Header>
            <ResponsiveDialog.Title>Controlled Dialog</ResponsiveDialog.Title>
            <ResponsiveDialog.Description>
              Opened and closed via external state.
            </ResponsiveDialog.Description>
            <ResponsiveDialog.Close />
          </ResponsiveDialog.Header>

          <ResponsiveDialog.Body>
            <p>This dialog is controlled by an external open state.</p>
          </ResponsiveDialog.Body>

          <ResponsiveDialog.Footer>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </ResponsiveDialog.Footer>
        </ResponsiveDialog.Content>
      </ResponsiveDialog>
    </>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />
};
