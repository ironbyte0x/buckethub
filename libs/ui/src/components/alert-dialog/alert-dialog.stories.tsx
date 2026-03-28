import { useState } from 'react';
import { Trash2Icon } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button';
import { Icon } from '../icon';
import { AlertDialog } from './alert-dialog';

const meta: Meta<typeof AlertDialog> = {
  title: 'Components/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => {
    return (
      <AlertDialog>
        <AlertDialog.Trigger
          render={(props) => (
            <Button variant="destructive" {...props}>
              Delete account
            </Button>
          )}
        />

        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
            <AlertDialog.Description>
              This action cannot be undone. This will permanently delete your account and remove
              your data from our servers.
            </AlertDialog.Description>
            <AlertDialog.Close />
          </AlertDialog.Header>

          <AlertDialog.Footer>
            <AlertDialog.CloseTrigger
              render={(props) => (
                <Button variant="secondary" {...props}>
                  Cancel
                </Button>
              )}
            />
            <Button variant="destructive">Delete</Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    );
  }
};

export const WithIcon: Story = {
  render: () => {
    return (
      <AlertDialog>
        <AlertDialog.Trigger
          render={(props) => (
            <Button variant="destructive" {...props}>
              Delete file
            </Button>
          )}
        />

        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.IconContainer>
              <Icon as={Trash2Icon} />
            </AlertDialog.IconContainer>
            <AlertDialog.Title>Delete file</AlertDialog.Title>
            <AlertDialog.Description>
              This file will be permanently deleted. This action cannot be undone.
            </AlertDialog.Description>
            <AlertDialog.Close />
          </AlertDialog.Header>

          <AlertDialog.Footer>
            <AlertDialog.CloseTrigger
              render={(props) => (
                <Button variant="secondary" {...props}>
                  Cancel
                </Button>
              )}
            />
            <Button variant="destructive">Delete</Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    );
  }
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open alert</Button>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title>Confirm action</AlertDialog.Title>
              <AlertDialog.Description>
                Are you sure you want to proceed with this action?
              </AlertDialog.Description>
              <AlertDialog.Close />
            </AlertDialog.Header>

            <AlertDialog.Footer>
              <AlertDialog.CloseTrigger
                render={(props) => (
                  <Button variant="secondary" {...props}>
                    Cancel
                  </Button>
                )}
              />
              <Button onClick={() => setOpen(false)}>Confirm</Button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </div>
    );
  }
};

export const WithBody: Story = {
  render: () => {
    return (
      <AlertDialog>
        <AlertDialog.Trigger
          render={(props) => (
            <Button variant="destructive" {...props}>
              Delete items
            </Button>
          )}
        />

        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Delete multiple items</AlertDialog.Title>
            <AlertDialog.Description>
              You are about to delete the following items:
            </AlertDialog.Description>
            <AlertDialog.Close />
          </AlertDialog.Header>

          <AlertDialog.Body>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
              <li>document.pdf</li>
              <li>image.png</li>
              <li>presentation.pptx</li>
            </ul>
          </AlertDialog.Body>

          <AlertDialog.Footer>
            <AlertDialog.CloseTrigger
              render={(props) => (
                <Button variant="secondary" {...props}>
                  Cancel
                </Button>
              )}
            />
            <Button variant="destructive">Delete all</Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    );
  }
};
