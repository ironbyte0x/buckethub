import { useState } from 'react';
import { PlusIcon, ServerIcon } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../icon';
import { Item } from '../item';
import { Radio } from './radio';

const meta: Meta<typeof Radio> = {
  component: Radio,
  title: 'Components/Radio'
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof Radio>;

export const Basic: Story = {
  render: () => (
    <Radio defaultValue="option-1">
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Radio.Item value="option-1" />
        Option 1
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Radio.Item value="option-2" />
        Option 2
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Radio.Item value="option-3" />
        Option 3
      </label>
    </Radio>
  )
};

export const WithDisabled: Story = {
  render: () => (
    <Radio defaultValue="option-1">
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Radio.Item value="option-1" />
        Option 1
      </label>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0.5
        }}
      >
        <Radio.Item value="option-2" disabled />
        Option 2 (Disabled)
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Radio.Item value="option-3" />
        Option 3
      </label>
    </Radio>
  )
};

export const WithItemComponent: Story = {
  render: () => {
    const WithItemExample = () => {
      const [type, setType] = useState<'existing' | 'new'>('existing');

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Radio value={type} onValueChange={(value) => setType(value as 'existing' | 'new')}>
            <label>
              <Item variant="outline" actionable>
                <Item.Media>
                  <Icon as={ServerIcon} size="xl" />
                </Item.Media>

                <Item.Content>
                  <Item.Title>Use existing provider</Item.Title>
                  <Item.Description>Select an existing provider from the list.</Item.Description>
                </Item.Content>

                <Radio.Item value="existing" />
              </Item>
            </label>

            <label>
              <Item variant="outline" actionable>
                <Item.Media>
                  <Icon as={PlusIcon} size="xl" />
                </Item.Media>

                <Item.Content>
                  <Item.Title>Add new provider</Item.Title>
                  <Item.Description>Connect with new S3 credentials.</Item.Description>
                </Item.Content>

                <Radio.Item value="new" />
              </Item>
            </label>
          </Radio>

          <div>
            Selected: <strong>{type}</strong>
          </div>
        </div>
      );
    };

    return <WithItemExample />;
  }
};
