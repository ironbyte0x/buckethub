import { AlertCircleIcon, DatabaseIcon, InboxIcon, SearchIcon } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button';
import { Icon } from '../icon';
import { InputGroup } from '../input-group';
import { State } from './state';

const meta: Meta<typeof State> = {
  title: 'Components/State',
  component: State,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof State>;

export const Empty: Story = {
  render: () => (
    <State>
      <State.Header>
        <State.Media variant="icon">
          <Icon as={InboxIcon} size="2xl" color="neutral" />
        </State.Media>
        <State.Title>No buckets found</State.Title>
        <State.Description>
          This connection has no buckets available. Create a new bucket to get started.
        </State.Description>
      </State.Header>
      <State.Content>
        <State.Actions>
          <Button variant="primary" size="sm">
            Create Bucket
          </Button>
        </State.Actions>
      </State.Content>
    </State>
  )
};

export const EmptyWithMultipleActions: Story = {
  render: () => (
    <State>
      <State.Header>
        <State.Media variant="icon">
          <Icon as={DatabaseIcon} size="2xl" color="neutral" />
        </State.Media>
        <State.Title>No Projects Yet</State.Title>
        <State.Description>
          You haven't created any projects yet. Get started by creating your first project.
        </State.Description>
      </State.Header>
      <State.Content>
        <State.Actions>
          <Button variant="primary" size="sm">
            Create Project
          </Button>
          <Button variant="secondary" size="sm">
            Import Project
          </Button>
        </State.Actions>
      </State.Content>
    </State>
  )
};

export const Error: Story = {
  render: () => (
    <State>
      <State.Header>
        <State.Media variant="icon">
          <Icon as={AlertCircleIcon} size="2xl" color="error" />
        </State.Media>
        <State.Title>Connection Failed</State.Title>
        <State.Description>
          Unable to connect to the server. Please check your connection settings and try again.
        </State.Description>
      </State.Header>
      <State.Content>
        <State.Actions>
          <Button variant="primary" size="sm">
            Retry Connection
          </Button>
          <Button variant="secondary" size="sm">
            Update Settings
          </Button>
        </State.Actions>
      </State.Content>
    </State>
  )
};

export const WithSearch: Story = {
  render: () => (
    <State>
      <State.Header>
        <State.Title>No results found</State.Title>
        <State.Description>
          We couldn't find any results matching your search. Try different keywords.
        </State.Description>
      </State.Header>
      <State.Content>
        <InputGroup css={{ width: '100%' }}>
          <InputGroup.Input placeholder="Search..." />
          <InputGroup.Addon>
            <Icon as={SearchIcon} size="sm" />
          </InputGroup.Addon>
        </InputGroup>
      </State.Content>
    </State>
  )
};

export const MinimalEmpty: Story = {
  render: () => (
    <State>
      <State.Header>
        <State.Media variant="icon">
          <Icon as={InboxIcon} size="2xl" color="neutral" />
        </State.Media>
        <State.Title>No data</State.Title>
        <State.Description>There's nothing here yet.</State.Description>
      </State.Header>
    </State>
  )
};

export const MinimalError: Story = {
  render: () => (
    <State>
      <State.Header>
        <State.Media variant="icon">
          <Icon as={AlertCircleIcon} size="2xl" color="error" />
        </State.Media>
        <State.Title>Something went wrong</State.Title>
        <State.Description>An unexpected error occurred. Please try again.</State.Description>
      </State.Header>
    </State>
  )
};

export const CustomContent: Story = {
  render: () => (
    <State>
      <State.Header>
        <State.Media variant="icon">
          <Icon as={DatabaseIcon} size="2xl" color="neutral" />
        </State.Media>
        <State.Title>Welcome to BucketHub</State.Title>
        <State.Description>
          Get started by connecting to your S3 storage provider.
        </State.Description>
      </State.Header>
      <State.Content>
        <State.Actions>
          <Button variant="primary" size="sm">
            Add Connection
          </Button>
        </State.Actions>
        <State.Description css={{ marginTop: '4' }}>
          Need help?{' '}
          <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>View documentation</span>
        </State.Description>
      </State.Content>
    </State>
  )
};

export const WithoutIcon: Story = {
  render: () => (
    <State>
      <State.Header>
        <State.Title>No notifications</State.Title>
        <State.Description>
          You're all caught up. New notifications will appear here.
        </State.Description>
      </State.Header>
      <State.Content>
        <State.Actions>
          <Button variant="secondary" size="sm">
            Refresh
          </Button>
        </State.Actions>
      </State.Content>
    </State>
  )
};
