import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button';
import { Tooltip } from './tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger render={<Button variant="secondary">Hover me</Button>} />
      <Tooltip.Content>This is a tooltip</Tooltip.Content>
    </Tooltip>
  )
};

export const Positions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Tooltip>
        <Tooltip.Trigger render={<Button variant="secondary">Top</Button>} />
        <Tooltip.Content side="top">Tooltip on top</Tooltip.Content>
      </Tooltip>

      <Tooltip>
        <Tooltip.Trigger render={<Button variant="secondary">Right</Button>} />
        <Tooltip.Content side="right">Tooltip on right</Tooltip.Content>
      </Tooltip>

      <Tooltip>
        <Tooltip.Trigger render={<Button variant="secondary">Bottom</Button>} />
        <Tooltip.Content side="bottom">Tooltip on bottom</Tooltip.Content>
      </Tooltip>

      <Tooltip>
        <Tooltip.Trigger render={<Button variant="secondary">Left</Button>} />
        <Tooltip.Content side="left">Tooltip on left</Tooltip.Content>
      </Tooltip>
    </div>
  )
};

export const CloseOnClick: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger
        closeOnClick
        render={<Button variant="secondary">Hover then click</Button>}
      />
      <Tooltip.Content>This tooltip closes when you click the trigger</Tooltip.Content>
    </Tooltip>
  )
};
