import { LockIcon, MailIcon, ServerIcon } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../icon';
import { InputGroup } from '../input-group';
import { Item } from '../item';
import { Radio } from '../radio';
import { Select } from '../select';
import { TextInput } from '../text-input';
import { Field } from './field';

const meta: Meta<typeof Field> = {
  title: 'Components/Field',
  component: Field,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof meta>;

export const WithTextInput: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <Field>
        <Field.Label htmlFor="email">Email</Field.Label>

        <TextInput id="email" type="email" placeholder="Enter your email" />

        <Field.Description>We'll never share your email with anyone else.</Field.Description>
      </Field>
    </div>
  )
};

export const WithSelect: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <Field>
        <Field.Label>Country</Field.Label>

        <Select defaultValue="us">
          <Select.Trigger>
            <Select.Value>Select a country...</Select.Value>
          </Select.Trigger>

          <Select.Content>
            <Select.Item value="us">United States</Select.Item>
            <Select.Item value="ca">Canada</Select.Item>
            <Select.Item value="uk">United Kingdom</Select.Item>
            <Select.Item value="de">Germany</Select.Item>
          </Select.Content>
        </Select>

        <Field.Description>Choose your primary country of residence.</Field.Description>
      </Field>
    </div>
  )
};

export const WithRadio: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <Field>
        <Field.Label css={{ marginBottom: '0' }}>Provider Type</Field.Label>

        <Field.Description css={{ marginBottom: '3' }}>
          Choose how you want to connect to your S3 bucket.
        </Field.Description>

        <Radio defaultValue="existing">
          <label style={{ display: 'block', marginBottom: '4' }}>
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

          <label style={{ display: 'block' }}>
            <Item variant="outline" actionable>
              <Item.Media>
                <Icon as={ServerIcon} size="xl" />
              </Item.Media>

              <Item.Content>
                <Item.Title>Add new provider</Item.Title>
                <Item.Description>Connect with new S3 credentials.</Item.Description>
              </Item.Content>
              <Radio.Item value="new" />
            </Item>
          </label>
        </Radio>
      </Field>
    </div>
  )
};

export const WithInputGroup: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <Field>
        <Field.Label htmlFor="email-input">Email Address</Field.Label>

        <InputGroup>
          <InputGroup.Addon align="inline-start">
            <Icon as={MailIcon} size="sm" />
          </InputGroup.Addon>

          <InputGroup.Input id="email-input" type="email" placeholder="Enter your email" />
        </InputGroup>

        <Field.Description>
          Your email will be used for notifications and account recovery.
        </Field.Description>
      </Field>
    </div>
  )
};

export const WithError: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <Field>
        <Field.Label htmlFor="error-email">Email</Field.Label>

        <TextInput
          id="error-email"
          type="email"
          defaultValue="invalid-email"
          error
          aria-invalid="true"
        />

        <Field.Description>We'll never share your email with anyone else.</Field.Description>

        <Field.Error>Please enter a valid email address.</Field.Error>
      </Field>
    </div>
  )
};

export const WithErrorInputGroup: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <Field>
        <Field.Label htmlFor="error-password">Password</Field.Label>

        <InputGroup>
          <InputGroup.Addon align="inline-start">
            <Icon as={LockIcon} size="sm" />
          </InputGroup.Addon>

          <InputGroup.Input
            id="error-password"
            type="password"
            defaultValue="123"
            error
            aria-invalid="true"
          />
        </InputGroup>

        <Field.Description>Password must be at least 8 characters long.</Field.Description>

        <Field.Error>Password is too short. Please use at least 8 characters.</Field.Error>
      </Field>
    </div>
  )
};

export const ControlledExample: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <Field>
        <Field.Label htmlFor="controlled-email">Email</Field.Label>

        <TextInput
          id="controlled-email"
          type="email"
          placeholder="Enter your email to see error state"
          defaultValue="invalid-email"
          error
          aria-invalid="true"
        />

        <Field.Description>This shows the error state styling.</Field.Description>

        <Field.Error>Please enter a valid email address.</Field.Error>
      </Field>
    </div>
  )
};

export const MultipleFields: Story = {
  render: () => (
    <div
      style={{
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}
    >
      <Field>
        <Field.Label htmlFor="first-name">First Name</Field.Label>

        <TextInput id="first-name" placeholder="Enter your first name" />
      </Field>

      <Field>
        <Field.Label htmlFor="last-name">Last Name</Field.Label>

        <TextInput id="last-name" placeholder="Enter your last name" />
      </Field>

      <Field>
        <Field.Label htmlFor="company-email">Company Email</Field.Label>

        <InputGroup>
          <InputGroup.Input id="company-email" placeholder="username" />

          <InputGroup.Addon align="inline-end">
            <InputGroup.Text>@company.com</InputGroup.Text>
          </InputGroup.Addon>
        </InputGroup>
        <Field.Description>
          Your company email will be used for business communications.
        </Field.Description>
      </Field>

      <Field>
        <Field.Label>Role</Field.Label>

        <Select>
          <Select.Trigger>
            <Select.Value>Select your role...</Select.Value>
          </Select.Trigger>

          <Select.Content>
            <Select.Item value="developer">Developer</Select.Item>
            <Select.Item value="designer">Designer</Select.Item>
            <Select.Item value="manager">Manager</Select.Item>
            <Select.Item value="admin">Administrator</Select.Item>
          </Select.Content>
        </Select>
      </Field>
    </div>
  )
};
