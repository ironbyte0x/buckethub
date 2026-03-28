import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from '../field';
import { Checkbox } from './checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => <Checkbox />
};

export const Checked: Story = {
  render: () => <Checkbox defaultChecked />
};

export const Indeterminate: Story = {
  render: () => <Checkbox indeterminate />
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Checkbox disabled />
      <Checkbox disabled defaultChecked />
      <Checkbox disabled indeterminate />
    </div>
  )
};

export const ReadOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Checkbox readOnly />
      <Checkbox readOnly defaultChecked />
    </div>
  )
};

const ControlledExample: React.FunctionComponent = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Checkbox checked={checked} onCheckedChange={setChecked} />
        Accept terms and conditions
      </label>
      <p style={{ fontSize: '14px', color: '#666' }}>
        Checkbox is {checked ? 'checked' : 'unchecked'}
      </p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />
};

export const WithLabel: Story = {
  render: () => (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer'
      }}
    >
      <Checkbox />
      Subscribe to newsletter
    </label>
  )
};

export const WithField: Story = {
  render: () => (
    <Field>
      <Field.Label>
        <Checkbox />
        Subscribe to newsletter
      </Field.Label>
      <Field.Description>Get updates about new features and products</Field.Description>
    </Field>
  )
};

const MultipleCheckboxesExample: React.FunctionComponent = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    setSelectedItems((previous) =>
      previous.includes(item)
        ? previous.filter((selectedItem) => selectedItem !== item)
        : [...previous, item]
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Select features</h3>
      {['Analytics', 'Reporting', 'Notifications', 'API Access'].map((item) => (
        <label
          key={item}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <Checkbox
            checked={selectedItems.includes(item)}
            onCheckedChange={() => toggleItem(item)}
          />
          {item}
        </label>
      ))}
      <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
        Selected: {selectedItems.join(', ') || 'None'}
      </p>
    </div>
  );
};

export const MultipleCheckboxes: Story = {
  render: () => <MultipleCheckboxesExample />
};

const ParentChildCheckboxesExample: React.FunctionComponent = () => {
  const [childrenChecked, setChildrenChecked] = useState([false, false, false]);

  const allChecked = childrenChecked.every(Boolean);
  const someChecked = childrenChecked.some(Boolean) && !allChecked;

  const toggleParent = () => {
    if (allChecked) {
      setChildrenChecked([false, false, false]);
    } else {
      setChildrenChecked([true, true, true]);
    }
  };

  const toggleChild = (index: number) => {
    setChildrenChecked((previous) =>
      previous.map((checked, itemIndex) => (itemIndex === index ? !checked : checked))
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        <Checkbox checked={allChecked} indeterminate={someChecked} onCheckedChange={toggleParent} />
        Select all permissions
      </label>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingLeft: '24px'
        }}
      >
        {['Read', 'Write', 'Delete'].map((item, index) => (
          <label
            key={item}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Checkbox checked={childrenChecked[index]} onCheckedChange={() => toggleChild(index)} />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
};

export const ParentChildCheckboxes: Story = {
  render: () => <ParentChildCheckboxesExample />
};

const InFormExample: React.FunctionComponent = () => {
  const [formData, setFormData] = useState({
    newsletter: false,
    terms: false,
    marketing: false
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert(`Form submitted:\n${JSON.stringify(formData, null, 2)}`);
  };

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={onSubmit}>
      <Field>
        <Field.Label>
          <Checkbox
            name="newsletter"
            checked={formData.newsletter}
            onCheckedChange={(checked) =>
              setFormData((previous) => ({ ...previous, newsletter: checked }))
            }
          />
          Subscribe to newsletter
        </Field.Label>
        <Field.Description>Receive weekly updates about new features</Field.Description>
      </Field>

      <Field>
        <Field.Label>
          <Checkbox
            name="terms"
            required
            checked={formData.terms}
            onCheckedChange={(checked) =>
              setFormData((previous) => ({ ...previous, terms: checked }))
            }
          />
          Accept terms and conditions *
        </Field.Label>
      </Field>

      <Field>
        <Field.Label>
          <Checkbox
            name="marketing"
            checked={formData.marketing}
            onCheckedChange={(checked) =>
              setFormData((previous) => ({ ...previous, marketing: checked }))
            }
          />
          Send me marketing emails
        </Field.Label>
      </Field>

      <button
        type="submit"
        disabled={!formData.terms}
        style={{
          padding: '8px 16px',
          backgroundColor: formData.terms ? '#0969da' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: formData.terms ? 'pointer' : 'not-allowed',
          marginTop: '8px'
        }}
      >
        Submit
      </button>
    </form>
  );
};

export const InForm: Story = {
  render: () => <InFormExample />
};
