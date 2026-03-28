import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './separator';

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <div>Content above</div>
      <Separator orientation="horizontal" />
      <div>Content below</div>
    </div>
  )
};

export const Vertical: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        height: '100px',
        alignItems: 'center',
        gap: '16px'
      }}
    >
      <div>Left content</div>
      <Separator orientation="vertical" />
      <div>Right content</div>
    </div>
  )
};

export const InList: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <div style={{ padding: '8px' }}>Item 1</div>
      <Separator />
      <div style={{ padding: '8px' }}>Item 2</div>
      <Separator />
      <div style={{ padding: '8px' }}>Item 3</div>
    </div>
  )
};
