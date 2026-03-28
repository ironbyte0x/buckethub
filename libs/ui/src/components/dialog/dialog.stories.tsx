import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button';
import { Dialog } from './dialog';

const meta: Meta<typeof Dialog> = {
  component: Dialog,
  title: 'Components/Dialog'
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof Dialog>;

export const Basic: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button variant="primary">Open Dialog</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.Description>
            This is a description of what this dialog is about.
          </Dialog.Description>
          <Dialog.Close />
        </Dialog.Header>

        <Dialog.Body>
          <p>
            This is the main content of the dialog. You can put any content here including forms,
            text, images, or other components.
          </p>
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button variant="secondary">Cancel</Button>
          </Dialog.CloseTrigger>
          <Button variant="primary">Confirm</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
};

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button variant="primary">Create Account</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Create New Account</Dialog.Title>
          <Dialog.Description>
            Fill in the details below to create a new account.
          </Dialog.Description>
          <Dialog.Close />
        </Dialog.Header>

        <Dialog.Body>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
          </form>
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button variant="secondary">Cancel</Button>
          </Dialog.CloseTrigger>
          <Button variant="primary">Create Account</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
};

export const WithoutFooter: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button variant="primary">Show Info</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Information</Dialog.Title>
          <Dialog.Close />
        </Dialog.Header>

        <Dialog.Body>
          <p>This is a simple informational dialog without a footer section.</p>
          <p>You can close it by clicking the X button or pressing Escape.</p>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  )
};
