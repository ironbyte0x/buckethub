import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../badge';
import { Button } from '../button';
import { Item } from './item';

const meta: Meta<typeof Item> = {
  title: 'Components/Item',
  component: Item,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Item>;

export const Default: Story = {
  render: () => (
    <Item>
      <Item.Content>
        <Item.Title>Item Title</Item.Title>
        <Item.Description>This is a simple item description</Item.Description>
      </Item.Content>
    </Item>
  )
};

export const WithIcon: Story = {
  render: () => (
    <Item>
      <Item.Media variant="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </Item.Media>
      <Item.Content>
        <Item.Title>Download File</Item.Title>
        <Item.Description>Click to download the file</Item.Description>
      </Item.Content>
    </Item>
  )
};

export const WithActions: Story = {
  render: () => (
    <Item>
      <Item.Content>
        <Item.Title>Item with Actions</Item.Title>
        <Item.Description>This item has action buttons</Item.Description>
      </Item.Content>
      <Item.Actions>
        <Button variant="secondary" size="sm">
          Edit
        </Button>
        <Button variant="ghost" size="sm">
          Delete
        </Button>
      </Item.Actions>
    </Item>
  )
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Item>
      <Item.Header>
        <Item.Title>Project Name</Item.Title>
        <Badge>Active</Badge>
      </Item.Header>
      <Item.Content>
        <Item.Description>
          This is a project description that spans multiple lines and provides detailed information
          about the project.
        </Item.Description>
      </Item.Content>
      <Item.Footer>
        <span>Last updated: 2 days ago</span>
        <Button variant="secondary" size="sm">
          View Details
        </Button>
      </Item.Footer>
    </Item>
  )
};

export const OutlineVariant: Story = {
  render: () => (
    <Item variant="outline">
      <Item.Content>
        <Item.Title>Outline Item</Item.Title>
        <Item.Description>This item has an outline border</Item.Description>
      </Item.Content>
    </Item>
  )
};

export const MutedVariant: Story = {
  render: () => (
    <Item variant="muted">
      <Item.Content>
        <Item.Title>Muted Item</Item.Title>
        <Item.Description>This item has a muted background</Item.Description>
      </Item.Content>
    </Item>
  )
};

export const SmallSize: Story = {
  render: () => (
    <Item size="sm">
      <Item.Content>
        <Item.Title>Small Item</Item.Title>
        <Item.Description>This is a smaller sized item</Item.Description>
      </Item.Content>
    </Item>
  )
};

export const GroupExample: Story = {
  render: () => (
    <Item.Group>
      <Item>
        <Item.Media variant="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </Item.Media>
        <Item.Content>
          <Item.Title>John Doe</Item.Title>
          <Item.Description>john.doe@example.com</Item.Description>
        </Item.Content>
      </Item>
      <Item.Separator />
      <Item>
        <Item.Media variant="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </Item.Media>
        <Item.Content>
          <Item.Title>Jane Smith</Item.Title>
          <Item.Description>jane.smith@example.com</Item.Description>
        </Item.Content>
      </Item>
      <Item.Separator />
      <Item>
        <Item.Media variant="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </Item.Media>
        <Item.Content>
          <Item.Title>Bob Johnson</Item.Title>
          <Item.Description>bob.johnson@example.com</Item.Description>
        </Item.Content>
      </Item>
    </Item.Group>
  )
};

export const CustomRenderWithElement: Story = {
  render: () => (
    <Item
      render={<a href="/profile" aria-label="View profile" />}
      onClick={(event) => {
        event.preventDefault();
        alert('Item clicked!');
      }}
    >
      <Item.Content>
        <Item.Title>Clickable Item (Element)</Item.Title>
        <Item.Description>
          This item uses render prop with an element to render as a link
        </Item.Description>
      </Item.Content>
    </Item>
  )
};

export const CustomRenderWithFunction: Story = {
  render: () => (
    <Item
      render={(props) => (
        <a
          {...props}
          href="/profile"
          onClick={(event) => {
            event.preventDefault();
            alert('Custom link clicked!');
          }}
        >
          {props.children}
        </a>
      )}
    >
      <Item.Content>
        <Item.Title>Clickable Item (Function)</Item.Title>
        <Item.Description>
          This item uses render prop with a function for full control
        </Item.Description>
      </Item.Content>
    </Item>
  )
};
