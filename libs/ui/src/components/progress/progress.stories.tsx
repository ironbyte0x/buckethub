import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './progress';

const meta = {
  component: Progress,
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 }
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive']
    }
  }
} satisfies Meta<typeof Progress>;

export const Default: StoryObj<typeof Progress> = {
  args: {
    value: 50
  }
};

export const Empty: StoryObj<typeof Progress> = {
  args: {
    value: 0
  }
};

export const Full: StoryObj<typeof Progress> = {
  args: {
    value: 100
  }
};

export const Destructive: StoryObj<typeof Progress> = {
  args: {
    value: 75,
    variant: 'destructive'
  }
};

export const ProgressSteps: StoryObj<typeof Progress> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Progress value={25} />
      <Progress value={50} />
      <Progress value={75} />
      <Progress value={100} />
    </div>
  )
};

export const Variants: StoryObj<typeof Progress> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Progress value={60} variant="default" />
      <Progress value={60} variant="destructive" />
    </div>
  )
};

export default meta;
