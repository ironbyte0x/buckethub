import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '../text';
import { Accordion } from './accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => (
    <Accordion css={{ width: '300px' }}>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>
          <Accordion.Header>
            <Text variant="body-medium-emphasized">What is React?</Text>
            <Accordion.Chevron />
          </Accordion.Header>
        </Accordion.Trigger>

        <Accordion.Panel>
          <div style={{ padding: '0 1rem 1rem' }}>
            <Text variant="body-medium" css={{ color: 'text-muted' }}>
              React is a JavaScript library for building user interfaces.
            </Text>
          </div>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="item-2">
        <Accordion.Trigger>
          <Accordion.Header>
            <Text variant="body-medium-emphasized">What is TypeScript?</Text>
            <Accordion.Chevron />
          </Accordion.Header>
        </Accordion.Trigger>

        <Accordion.Panel>
          <div style={{ padding: '0 1rem 1rem' }}>
            <Text variant="body-medium" css={{ color: 'text-muted' }}>
              TypeScript is a strongly typed programming language.
            </Text>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
};

export const Multiple: Story = {
  render: () => (
    <Accordion multiple css={{ width: '300px' }}>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>
          <Accordion.Header>
            <Text variant="body-medium-emphasized">What is React?</Text>
            <Accordion.Chevron />
          </Accordion.Header>
        </Accordion.Trigger>

        <Accordion.Panel>
          <div style={{ padding: '0 1rem 1rem' }}>
            <Text variant="body-medium" css={{ color: 'text-muted' }}>
              React is a JavaScript library for building user interfaces.
            </Text>
          </div>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="item-2">
        <Accordion.Trigger>
          <Accordion.Header>
            <Text variant="body-medium-emphasized">What is TypeScript?</Text>
            <Accordion.Chevron />
          </Accordion.Header>
        </Accordion.Trigger>

        <Accordion.Panel>
          <div style={{ padding: '0 1rem 1rem' }}>
            <Text variant="body-medium" css={{ color: 'text-muted' }}>
              TypeScript is a strongly typed programming language.
            </Text>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
};

export const Nested: Story = {
  render: () => (
    <Accordion multiple css={{ width: '300px' }}>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>
          <Accordion.Header>
            <Text variant="body-medium-emphasized">What is React?</Text>
            <Accordion.Chevron />
          </Accordion.Header>
        </Accordion.Trigger>

        <Accordion.Panel css={{ paddingInline: '4', paddingBottom: '4' }}>
          <Accordion multiple css={{ width: '100%', gap: '2' }}>
            <Accordion.Item value="item-1" css={{ backgroundColor: 'background-base' }}>
              <Accordion.Trigger>
                <Accordion.Header>
                  <Text variant="body-medium-emphasized">What is React?</Text>
                  <Accordion.Chevron />
                </Accordion.Header>
              </Accordion.Trigger>

              <Accordion.Panel>
                <div style={{ padding: '0 1rem 1rem' }}>
                  <Text variant="body-medium" css={{ color: 'text-muted' }}>
                    React is a JavaScript library for building user interfaces.
                  </Text>
                </div>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="item-2" css={{ backgroundColor: 'background-base' }}>
              <Accordion.Trigger>
                <Accordion.Header>
                  <Text variant="body-medium-emphasized">What is TypeScript?</Text>
                  <Accordion.Chevron />
                </Accordion.Header>
              </Accordion.Trigger>

              <Accordion.Panel>
                <div style={{ padding: '0 1rem 1rem' }}>
                  <Text variant="body-medium" css={{ color: 'text-muted' }}>
                    TypeScript is a strongly typed programming language.
                  </Text>
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="item-2">
        <Accordion.Trigger>
          <Accordion.Header>
            <Text variant="body-medium-emphasized">What is TypeScript?</Text>
            <Accordion.Chevron />
          </Accordion.Header>
        </Accordion.Trigger>

        <Accordion.Panel>
          <div style={{ padding: '0 1rem 1rem' }}>
            <Text variant="body-medium" css={{ color: 'text-muted' }}>
              No nested accordions here!
            </Text>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
};
