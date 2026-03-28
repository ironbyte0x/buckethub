import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from './text-input';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    variant: {
      control: 'select',
      options: ['default', 'error']
    },
    error: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    },
    readOnly: {
      control: 'boolean'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...'
  }
};

export const WithValue: Story = {
  args: {
    defaultValue: 'Hello World',
    placeholder: 'Enter text...'
  }
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Search...'
  }
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true
  }
};

export const ReadOnly: Story = {
  args: {
    defaultValue: 'Read-only value',
    readOnly: true
  }
};

export const Error: Story = {
  args: {
    placeholder: 'Enter valid email',
    error: true
  }
};

export const ErrorWithValue: Story = {
  args: {
    defaultValue: 'invalid-email',
    error: true
  }
};

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input'
  }
};

export const Medium: Story = {
  args: {
    size: 'md',
    placeholder: 'Medium input (default)'
  }
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input'
  }
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email'
  }
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password'
  }
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number'
  }
};

export const WithLabel: Story = {
  render: (arguments_) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label htmlFor="email-input" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
        Email
      </label>
      <TextInput id="email-input" {...arguments_} />
    </div>
  ),
  args: {
    type: 'email',
    placeholder: 'Enter your email'
  }
};

export const WithHelperText: Story = {
  render: (arguments_) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label htmlFor="username-input" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
        Username
      </label>
      <TextInput id="username-input" {...arguments_} />
      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
        This is your public display name.
      </span>
    </div>
  ),
  args: {
    placeholder: 'johndoe'
  }
};

export const WithErrorMessage: Story = {
  render: (arguments_) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label htmlFor="error-input" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
        Email
      </label>
      <TextInput id="error-input" {...arguments_} />
      <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>
        Please enter a valid email address.
      </span>
    </div>
  ),
  args: {
    type: 'email',
    defaultValue: 'invalid-email',
    error: true
  }
};

export const FullWidth: Story = {
  render: (arguments_) => (
    <div style={{ width: '400px' }}>
      <TextInput {...arguments_} />
    </div>
  ),
  args: {
    placeholder: 'Full width input'
  }
};

export const SearchExample: Story = {
  render: (arguments_) => (
    <div style={{ width: '300px' }}>
      <TextInput {...arguments_} />
    </div>
  ),
  args: {
    type: 'search',
    placeholder: 'Search...'
  }
};
