import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';

const meta = {
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost']
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md']
    },
    loading: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    }
  }
} satisfies Meta<typeof Button>;

export const Primary: StoryObj<typeof Button> = {
  args: {
    children: 'Button',
    variant: 'primary'
  }
};

export const Secondary: StoryObj<typeof Button> = {
  args: {
    children: 'Button',
    variant: 'secondary'
  }
};

export const Ghost: StoryObj<typeof Button> = {
  args: {
    children: 'Button',
    variant: 'ghost'
  }
};

export const Loading: StoryObj<typeof Button> = {
  args: {
    children: 'Save Changes',
    loading: true,
    variant: 'primary'
  }
};

export const LoadingSecondary: StoryObj<typeof Button> = {
  args: {
    children: 'Cancel',
    loading: true,
    variant: 'secondary'
  }
};

export const Sizes: StoryObj<typeof Button> = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
    </div>
  )
};

export const LoadingSizes: StoryObj<typeof Button> = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Button size="xs" loading>
        XS Loading
      </Button>
      <Button size="sm" loading>
        SM Loading
      </Button>
      <Button size="md" loading>
        MD Loading
      </Button>
    </div>
  )
};

export const LoadingTransition: StoryObj<typeof Button> = {
  render: function LoadingTransitionDemo() {
    const [loading, setLoading] = useState(false);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'flex-start'
        }}
      >
        <Button variant="primary" loading={loading} onClick={() => setLoading(!loading)}>
          {loading ? 'Loading...' : 'Toggle Loading'}
        </Button>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Click the button to see the smooth width transition when loading state changes
        </p>
      </div>
    );
  }
};

export default meta;
