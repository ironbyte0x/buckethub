import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select defaultValue="apple">
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="orange">Orange</Select.Item>
        <Select.Item value="grape">Grape</Select.Item>
        <Select.Item value="mango">Mango</Select.Item>
      </Select.Content>
    </Select>
  )
};

export const WithPlaceholder: Story = {
  render: () => (
    <Select>
      <Select.Trigger>
        <Select.Value>Select a fruit...</Select.Value>
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="orange">Orange</Select.Item>
        <Select.Item value="grape">Grape</Select.Item>
        <Select.Item value="mango">Mango</Select.Item>
      </Select.Content>
    </Select>
  )
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <Select.Trigger>
        <Select.Value>Select a food...</Select.Value>
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.GroupLabel>Fruits</Select.GroupLabel>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="orange">Orange</Select.Item>
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.GroupLabel>Vegetables</Select.GroupLabel>
          <Select.Item value="carrot">Carrot</Select.Item>
          <Select.Item value="broccoli">Broccoli</Select.Item>
          <Select.Item value="spinach">Spinach</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select>
  )
};

export const WithLabel: Story = {
  render: () => (
    <Select defaultValue="apple">
      <Select.Label>Favorite Fruit</Select.Label>
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="orange">Orange</Select.Item>
        <Select.Item value="grape">Grape</Select.Item>
        <Select.Item value="mango">Mango</Select.Item>
      </Select.Content>
    </Select>
  )
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <Select.Trigger>
        <Select.Value>Select a fruit...</Select.Value>
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
      </Select.Content>
    </Select>
  )
};

export const WithDisabledItems: Story = {
  render: () => (
    <Select>
      <Select.Trigger>
        <Select.Value>Select a fruit...</Select.Value>
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana" disabled>
          Banana (Out of stock)
        </Select.Item>
        <Select.Item value="orange">Orange</Select.Item>
        <Select.Item value="grape" disabled>
          Grape (Out of stock)
        </Select.Item>
        <Select.Item value="mango">Mango</Select.Item>
      </Select.Content>
    </Select>
  )
};

export const WithScrollArrows: Story = {
  render: () => (
    <Select>
      <Select.Trigger>
        <Select.Value>Select a country...</Select.Value>
      </Select.Trigger>
      <Select.Content>
        <Select.ScrollUpArrow />
        <Select.Item value="us">United States</Select.Item>
        <Select.Item value="ca">Canada</Select.Item>
        <Select.Item value="mx">Mexico</Select.Item>
        <Select.Item value="uk">United Kingdom</Select.Item>
        <Select.Item value="fr">France</Select.Item>
        <Select.Item value="de">Germany</Select.Item>
        <Select.Item value="it">Italy</Select.Item>
        <Select.Item value="es">Spain</Select.Item>
        <Select.Item value="jp">Japan</Select.Item>
        <Select.Item value="cn">China</Select.Item>
        <Select.Item value="in">India</Select.Item>
        <Select.Item value="au">Australia</Select.Item>
        <Select.ScrollDownArrow />
      </Select.Content>
    </Select>
  )
};

const ControlledExample = () => {
  const [value, setValue] = useState<string>('apple');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Select value={value} onValueChange={(newValue) => setValue(newValue as string)}>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="orange">Orange</Select.Item>
          <Select.Item value="grape">Grape</Select.Item>
          <Select.Item value="mango">Mango</Select.Item>
        </Select.Content>
      </Select>
      <div>Selected value: {value}</div>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />
};
