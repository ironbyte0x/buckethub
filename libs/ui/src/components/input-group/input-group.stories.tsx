import {
  CheckIcon,
  CopyIcon,
  DollarSignIcon,
  LinkIcon,
  MailIcon,
  PlayIcon,
  SearchIcon,
  SendIcon,
  XIcon
} from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../icon';
import { InputGroup } from './input-group';

const meta: Meta<typeof InputGroup> = {
  title: 'Components/InputGroup',
  component: InputGroup,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <InputGroup>
        <InputGroup.Input placeholder="Enter text..." />
      </InputGroup>
    </div>
  )
};

export const WithIconStart: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <InputGroup>
        <InputGroup.Addon align="inline-start">
          <Icon as={SearchIcon} size="sm" />
        </InputGroup.Addon>
        <InputGroup.Input placeholder="Search..." />
      </InputGroup>
    </div>
  )
};

export const WithIconEnd: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <InputGroup>
        <InputGroup.Input placeholder="Search..." />
        <InputGroup.Addon align="inline-end">
          <Icon as={SearchIcon} size="sm" />
        </InputGroup.Addon>
      </InputGroup>
    </div>
  )
};

export const WithIconsBothSides: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <InputGroup>
        <InputGroup.Addon align="inline-start">
          <Icon as={MailIcon} size="sm" />
        </InputGroup.Addon>
        <InputGroup.Input type="email" placeholder="you@example.com" />
        <InputGroup.Addon align="inline-end">
          <Icon as={CheckIcon} size="sm" />
        </InputGroup.Addon>
      </InputGroup>
    </div>
  )
};

export const WithText: Story = {
  render: () => (
    <div
      style={{
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      <InputGroup>
        <InputGroup.Addon align="inline-start">
          <InputGroup.Text>$</InputGroup.Text>
        </InputGroup.Addon>
        <InputGroup.Input type="number" placeholder="0.00" />
      </InputGroup>

      <InputGroup>
        <InputGroup.Input placeholder="example" />
        <InputGroup.Addon align="inline-end">
          <InputGroup.Text>.com</InputGroup.Text>
        </InputGroup.Addon>
      </InputGroup>

      <InputGroup>
        <InputGroup.Addon align="inline-start">
          <InputGroup.Text>https://</InputGroup.Text>
        </InputGroup.Addon>
        <InputGroup.Input placeholder="example.com" />
      </InputGroup>

      <InputGroup>
        <InputGroup.Input placeholder="username" />
        <InputGroup.Addon align="inline-end">
          <InputGroup.Text>@company.com</InputGroup.Text>
        </InputGroup.Addon>
      </InputGroup>
    </div>
  )
};

export const WithButton: Story = {
  render: () => (
    <div
      style={{
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      <InputGroup>
        <InputGroup.Input placeholder="Search..." />
        <InputGroup.Addon align="inline-end">
          <InputGroup.Button>Search</InputGroup.Button>
        </InputGroup.Addon>
      </InputGroup>

      <InputGroup>
        <InputGroup.Addon align="inline-start">
          <InputGroup.Text>https://</InputGroup.Text>
        </InputGroup.Addon>
        <InputGroup.Input placeholder="example.com" />
        <InputGroup.Addon align="inline-end">
          <InputGroup.Button>
            <Icon as={LinkIcon} size="sm" />
          </InputGroup.Button>
        </InputGroup.Addon>
      </InputGroup>

      <InputGroup>
        <InputGroup.Addon align="inline-start">
          <Icon as={SearchIcon} size="sm" />
        </InputGroup.Addon>
        <InputGroup.Input placeholder="Search..." />
        <InputGroup.Addon align="inline-end">
          <InputGroup.Button>Search</InputGroup.Button>
        </InputGroup.Addon>
      </InputGroup>
    </div>
  )
};

export const WithMultipleButtons: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <InputGroup>
        <InputGroup.Input placeholder="Enter URL..." />
        <InputGroup.Addon align="inline-end">
          <InputGroup.Button size="xs">
            <Icon as={CopyIcon} size="xs" />
          </InputGroup.Button>
          <InputGroup.Button size="xs">
            <Icon as={LinkIcon} size="xs" />
          </InputGroup.Button>
        </InputGroup.Addon>
      </InputGroup>
    </div>
  )
};

export const EmailInput: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <InputGroup>
        <InputGroup.Addon align="inline-start">
          <Icon as={MailIcon} size="sm" />
        </InputGroup.Addon>
        <InputGroup.Input type="email" placeholder="Enter your email" />
      </InputGroup>
    </div>
  )
};

export const URLInput: Story = {
  render: () => (
    <div style={{ width: '500px' }}>
      <InputGroup>
        <InputGroup.Addon align="inline-start">
          <InputGroup.Text>https://</InputGroup.Text>
        </InputGroup.Addon>
        <InputGroup.Input placeholder="example.com" />
        <InputGroup.Addon align="inline-end">
          <InputGroup.Button>
            <Icon as={CopyIcon} size="sm" />
          </InputGroup.Button>
        </InputGroup.Addon>
      </InputGroup>
    </div>
  )
};

export const PriceInput: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <InputGroup>
        <InputGroup.Addon align="inline-start">
          <Icon as={DollarSignIcon} size="sm" />
        </InputGroup.Addon>
        <InputGroup.Input type="number" placeholder="0.00" step="0.01" />
        <InputGroup.Addon align="inline-end">
          <InputGroup.Text>USD</InputGroup.Text>
        </InputGroup.Addon>
      </InputGroup>
    </div>
  )
};

export const SearchWithClear: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <InputGroup>
        <InputGroup.Addon align="inline-start">
          <Icon as={SearchIcon} size="sm" />
        </InputGroup.Addon>
        <InputGroup.Input placeholder="Search..." defaultValue="query text" />
        <InputGroup.Addon align="inline-end">
          <InputGroup.Button size="xs">
            <Icon as={XIcon} size="xs" />
          </InputGroup.Button>
        </InputGroup.Addon>
      </InputGroup>
    </div>
  )
};

export const WithTextarea: Story = {
  render: () => (
    <div style={{ width: '500px' }}>
      <InputGroup>
        <InputGroup.Textarea placeholder="Enter your message..." rows={4} />
        <InputGroup.Addon align="block-end">
          <InputGroup.Button>
            <Icon as={SendIcon} size="sm" />
          </InputGroup.Button>
        </InputGroup.Addon>
      </InputGroup>
    </div>
  )
};

export const TextareaWithTopAddon: Story = {
  render: () => (
    <div style={{ width: '500px' }}>
      <InputGroup>
        <InputGroup.Addon align="block-start">
          <InputGroup.Text>script.js</InputGroup.Text>
          <InputGroup.Button size="xs">
            <Icon as={PlayIcon} size="xs" />
          </InputGroup.Button>
        </InputGroup.Addon>
        <InputGroup.Textarea placeholder="Enter your code..." rows={6} />
      </InputGroup>
    </div>
  )
};

export const ComplexExample: Story = {
  render: () => (
    <div
      style={{
        width: '600px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      <div>
        <label
          htmlFor="search"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500
          }}
        >
          Search
        </label>
        <InputGroup>
          <InputGroup.Addon align="inline-start">
            <Icon as={SearchIcon} size="sm" />
          </InputGroup.Addon>
          <InputGroup.Input id="search" placeholder="Search products..." />
          <InputGroup.Addon align="inline-end">
            <InputGroup.Button>Search</InputGroup.Button>
          </InputGroup.Addon>
        </InputGroup>
      </div>

      <div>
        <label
          htmlFor="email"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500
          }}
        >
          Email Address
        </label>
        <InputGroup>
          <InputGroup.Addon align="inline-start">
            <Icon as={MailIcon} size="sm" />
          </InputGroup.Addon>
          <InputGroup.Input id="email" type="email" placeholder="you@example.com" />
        </InputGroup>
        <span
          style={{
            display: 'block',
            marginTop: '0.25rem',
            fontSize: '0.75rem',
            color: '#6b7280'
          }}
        >
          We'll never share your email.
        </span>
      </div>

      <div>
        <label
          htmlFor="url"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500
          }}
        >
          Website URL
        </label>
        <InputGroup>
          <InputGroup.Addon align="inline-start">
            <InputGroup.Text>https://</InputGroup.Text>
          </InputGroup.Addon>
          <InputGroup.Input id="url" placeholder="example.com" />
          <InputGroup.Addon align="inline-end">
            <InputGroup.Text>.com</InputGroup.Text>
          </InputGroup.Addon>
        </InputGroup>
      </div>
    </div>
  )
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <InputGroup>
        <InputGroup.Addon align="inline-start">
          <Icon as={SearchIcon} size="sm" />
        </InputGroup.Addon>
        <InputGroup.Input placeholder="Disabled input" disabled />
      </InputGroup>
    </div>
  )
};

export const ReadOnly: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <InputGroup>
        <InputGroup.Addon align="inline-start">
          <Icon as={MailIcon} size="sm" />
        </InputGroup.Addon>
        <InputGroup.Input defaultValue="readonly@example.com" readOnly />
      </InputGroup>
    </div>
  )
};
