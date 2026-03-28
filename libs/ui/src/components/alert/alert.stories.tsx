import { AlertCircleIcon, CheckCircleIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../icon';
import { Alert } from './alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
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

type Story = StoryObj<typeof Alert>;

export const Error: Story = {
  render: () => (
    <Alert variant="error">
      <Alert.Icon>
        <Icon as={AlertCircleIcon} size="md" />
      </Alert.Icon>
      <Alert.Content>
        <Alert.Title>Failed to create provider</Alert.Title>
        <Alert.Description>An unexpected error occurred. Please try again.</Alert.Description>
      </Alert.Content>
    </Alert>
  )
};

export const Warning: Story = {
  render: () => (
    <Alert variant="warning">
      <Alert.Icon>
        <Icon as={TriangleAlertIcon} size="md" />
      </Alert.Icon>
      <Alert.Content>
        <Alert.Title>Storage limit approaching</Alert.Title>
        <Alert.Description>
          You've used 80% of your available storage. Consider upgrading your plan.
        </Alert.Description>
      </Alert.Content>
    </Alert>
  )
};

export const Info: Story = {
  render: () => (
    <Alert variant="info">
      <Alert.Icon>
        <Icon as={InfoIcon} size="md" />
      </Alert.Icon>
      <Alert.Content>
        <Alert.Title>Scheduled maintenance</Alert.Title>
        <Alert.Description>
          The service will be under maintenance on Saturday, 3:00 AM - 5:00 AM UTC.
        </Alert.Description>
      </Alert.Content>
    </Alert>
  )
};

export const Success: Story = {
  render: () => (
    <Alert variant="success">
      <Alert.Icon>
        <Icon as={CheckCircleIcon} size="md" />
      </Alert.Icon>
      <Alert.Content>
        <Alert.Title>Provider created successfully</Alert.Title>
        <Alert.Description>
          Your storage provider has been configured and is ready to use.
        </Alert.Description>
      </Alert.Content>
    </Alert>
  )
};

export const WithoutIcon: Story = {
  render: () => (
    <Alert variant="error">
      <Alert.Content>
        <Alert.Title>Connection failed</Alert.Title>
        <Alert.Description>
          Unable to establish connection to the server. Please check your network settings.
        </Alert.Description>
      </Alert.Content>
    </Alert>
  )
};

export const TitleOnly: Story = {
  render: () => (
    <Alert variant="warning">
      <Alert.Icon>
        <Icon as={TriangleAlertIcon} size="md" />
      </Alert.Icon>
      <Alert.Content>
        <Alert.Title>Action required</Alert.Title>
      </Alert.Content>
    </Alert>
  )
};

export const DescriptionOnly: Story = {
  render: () => (
    <Alert variant="info">
      <Alert.Icon>
        <Icon as={InfoIcon} size="md" />
      </Alert.Icon>
      <Alert.Content>
        <Alert.Description>
          Your session will expire in 5 minutes. Please save your work.
        </Alert.Description>
      </Alert.Content>
    </Alert>
  )
};

export const LongContent: Story = {
  render: () => (
    <Alert variant="error">
      <Alert.Icon>
        <Icon as={AlertCircleIcon} size="md" />
      </Alert.Icon>
      <Alert.Content>
        <Alert.Title>Multiple validation errors</Alert.Title>
        <Alert.Description>
          The following errors were found in your submission: Invalid email format, password must be
          at least 8 characters long, username is already taken, and the confirmation code has
          expired. Please correct these issues and try again.
        </Alert.Description>
      </Alert.Content>
    </Alert>
  )
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '500px'
      }}
    >
      <Alert variant="error">
        <Alert.Icon>
          <Icon as={AlertCircleIcon} size="md" />
        </Alert.Icon>
        <Alert.Content>
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>This is an error alert.</Alert.Description>
        </Alert.Content>
      </Alert>

      <Alert variant="warning">
        <Alert.Icon>
          <Icon as={TriangleAlertIcon} size="md" />
        </Alert.Icon>
        <Alert.Content>
          <Alert.Title>Warning</Alert.Title>
          <Alert.Description>This is a warning alert.</Alert.Description>
        </Alert.Content>
      </Alert>

      <Alert variant="info">
        <Alert.Icon>
          <Icon as={InfoIcon} size="md" />
        </Alert.Icon>
        <Alert.Content>
          <Alert.Title>Info</Alert.Title>
          <Alert.Description>This is an info alert.</Alert.Description>
        </Alert.Content>
      </Alert>

      <Alert variant="success">
        <Alert.Icon>
          <Icon as={CheckCircleIcon} size="md" />
        </Alert.Icon>
        <Alert.Content>
          <Alert.Title>Success</Alert.Title>
          <Alert.Description>This is a success alert.</Alert.Description>
        </Alert.Content>
      </Alert>
    </div>
  )
};
