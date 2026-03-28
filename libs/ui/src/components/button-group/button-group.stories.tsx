import { useState } from 'react';
import { ChevronDown, ClipboardCopy, Minus, Plus, Search } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button';
import { TextInput } from '../text-input';
import { ButtonGroup } from './button-group';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="secondary">Button 1</Button>
      <Button variant="secondary">Button 2</Button>
      <Button variant="secondary">Button 3</Button>
    </ButtonGroup>
  )
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="secondary">
        <Plus />
        Increment
      </Button>
      <Button variant="secondary">
        <Minus />
        Decrement
      </Button>
    </ButtonGroup>
  )
};

export const WithSeparator: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="secondary" size="sm">
        <ClipboardCopy />
        Copy
      </Button>
      <ButtonGroup.Separator />
      <Button variant="secondary" size="sm">
        <ClipboardCopy />
        Paste
      </Button>
    </ButtonGroup>
  )
};

export const SplitButton: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="secondary">Action</Button>
      <ButtonGroup.Separator />
      <Button variant="secondary">
        <ChevronDown />
      </Button>
    </ButtonGroup>
  )
};

export const WithInput: Story = {
  render: () => (
    <ButtonGroup>
      <TextInput placeholder="Search..." />
      <Button variant="secondary">
        <Search />
      </Button>
    </ButtonGroup>
  )
};

export const Nested: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="secondary" size="sm">
          1
        </Button>
        <Button variant="secondary" size="sm">
          2
        </Button>
        <Button variant="secondary" size="sm">
          3
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="secondary" size="sm">
          <Plus />
        </Button>
        <Button variant="secondary" size="sm">
          <Minus />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ButtonGroup>
        <Button variant="secondary" size="xs">
          Small
        </Button>
        <Button variant="secondary" size="xs">
          Button
        </Button>
        <Button variant="secondary" size="xs">
          Group
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="secondary" size="sm">
          Medium
        </Button>
        <Button variant="secondary" size="sm">
          Button
        </Button>
        <Button variant="secondary" size="sm">
          Group
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="secondary" size="md">
          Large
        </Button>
        <Button variant="secondary" size="md">
          Button
        </Button>
        <Button variant="secondary" size="md">
          Group
        </Button>
      </ButtonGroup>
    </div>
  )
};

export const WithText: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroup.Text>Label:</ButtonGroup.Text>
      <Button variant="secondary" size="sm">
        Option 1
      </Button>
      <Button variant="secondary" size="sm">
        Option 2
      </Button>
    </ButtonGroup>
  )
};

export const MixedVariants: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Save</Button>
    </ButtonGroup>
  )
};

export const Interactive: Story = {
  render: () => {
    const InteractiveDemo = () => {
      const [selected, setSelected] = useState<string>('option1');

      return (
        <ButtonGroup>
          <Button
            variant={selected === 'option1' ? 'primary' : 'secondary'}
            onClick={() => setSelected('option1')}
          >
            Option 1
          </Button>
          <Button
            variant={selected === 'option2' ? 'primary' : 'secondary'}
            onClick={() => setSelected('option2')}
          >
            Option 2
          </Button>
          <Button
            variant={selected === 'option3' ? 'primary' : 'secondary'}
            onClick={() => setSelected('option3')}
          >
            Option 3
          </Button>
        </ButtonGroup>
      );
    };

    return <InteractiveDemo />;
  }
};
