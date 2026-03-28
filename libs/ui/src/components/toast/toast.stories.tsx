import { useRef, useState } from 'react';
import { CheckIcon, ClipboardIcon } from 'lucide-react';
import { Box } from '@buckethub/styled-system/jsx';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button';
import { Icon } from '../icon';
import { Tooltip } from '../tooltip';
import { AnchoredToasts } from './anchored-toast';
import { Toast } from './toast';
import { anchoredToastManager, toast, toastManager } from './toast-manager';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <div style={{ padding: '20px', minHeight: '400px' }}>
          <Story />
        </div>

        <Toast.Provider toastManager={anchoredToastManager}>
          <AnchoredToasts />
        </Toast.Provider>

        <Toast.Provider toastManager={toastManager}>
          <Toast.Viewport />
        </Toast.Provider>
      </>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.success({
          title: 'Changes saved',
          description: 'Your changes have been saved successfully.'
        })
      }
    >
      Show Success Toast
    </Button>
  )
};

export const Error: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.error({
          title: 'Error occurred',
          description: 'Something went wrong. Please try again.'
        })
      }
    >
      Show Error Toast
    </Button>
  )
};

export const Warning: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.warning({
          title: 'Warning',
          description: 'This action cannot be undone.'
        })
      }
    >
      Show Warning Toast
    </Button>
  )
};

export const Info: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.info({
          title: 'Information',
          description: 'Your session will expire in 5 minutes.'
        })
      }
    >
      Show Info Toast
    </Button>
  )
};

export const TitleOnly: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.success({
          title: 'File uploaded successfully'
        })
      }
    >
      Show Title Only Toast
    </Button>
  )
};

export const LongContent: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.error({
          title: 'Multiple validation errors',
          description:
            'The following errors were found: Invalid email format, password must be at least 8 characters long, username is already taken.'
        })
      }
    >
      Show Long Content Toast
    </Button>
  )
};

export const CustomTimeout: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.info({
          title: 'Long lasting toast',
          description: 'This toast will stay for 10 seconds.',
          timeout: 10000
        })
      }
    >
      Show Long Duration Toast
    </Button>
  )
};

export const Persistent: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.warning({
          title: 'Action required',
          description: 'This toast will not auto-dismiss. Click X to close.',
          timeout: 0
        })
      }
    >
      Show Persistent Toast
    </Button>
  )
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button
        onClick={() =>
          toast.success({
            title: 'Success',
            description: 'This is a success toast.'
          })
        }
      >
        Success
      </Button>
      <Button
        onClick={() =>
          toast.error({
            title: 'Error',
            description: 'This is an error toast.'
          })
        }
      >
        Error
      </Button>
      <Button
        onClick={() =>
          toast.warning({
            title: 'Warning',
            description: 'This is a warning toast.'
          })
        }
      >
        Warning
      </Button>
      <Button onClick={() => toast.info({ title: 'Info', description: 'This is an info toast.' })}>
        Info
      </Button>
      <Button
        onClick={() =>
          toast.add({
            title: 'Default',
            description: 'This is a default toast.'
          })
        }
      >
        Default
      </Button>
    </div>
  )
};

export const MultipleToasts: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button
        onClick={() => {
          toast.success({ title: 'First toast' });
          setTimeout(() => toast.info({ title: 'Second toast' }), 200);
          setTimeout(() => toast.warning({ title: 'Third toast' }), 400);
        }}
      >
        Show Multiple Toasts
      </Button>
    </div>
  )
};

export const AnchoredToast: Story = {
  render: () => {
    const [isCopied, setIsCopied] = useState(false);

    const buttonRef = useRef<HTMLButtonElement | null>(null);

    function onCopyClick() {
      setIsCopied(true);

      anchoredToastManager.add({
        description: 'Copied',
        positionerProps: {
          anchor: buttonRef.current,
          sideOffset: 8,
          side: 'top',
          align: 'center'
        },
        timeout: 1500,
        onClose() {
          setIsCopied(false);
        }
      });
    }

    return (
      <Box
        css={{
          padding: '32'
        }}
      >
        <Tooltip
          disabled={isCopied}
          onOpenChange={(open, eventDetails) => {
            if (eventDetails.reason === 'trigger-press') {
              eventDetails.cancel();
            }
          }}
        >
          <Tooltip.Trigger
            ref={buttonRef}
            render={<Button disabled={isCopied} />}
            onClick={onCopyClick}
          >
            {isCopied ? <Icon as={CheckIcon} /> : <Icon as={ClipboardIcon} />}
          </Tooltip.Trigger>

          <Tooltip.Content>Copy</Tooltip.Content>
        </Tooltip>
      </Box>
    );
  }
};
