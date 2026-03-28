import { useState } from 'react';
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users
} from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button';
import { Icon } from '../icon';
import { Menu } from './menu';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Menu>
      <Menu.Trigger
        render={(props) => (
          <Button variant="secondary" {...props}>
            Open
          </Button>
        )}
      />
      <Menu.Content align="start">
        <Menu.Group>
          <Menu.GroupLabel>My Account</Menu.GroupLabel>
          <Menu.Item>
            <Icon as={User} size="sm" />
            Profile
            <Menu.Shortcut>⇧⌘P</Menu.Shortcut>
          </Menu.Item>
          <Menu.Item>
            <Icon as={CreditCard} size="sm" />
            Billing
            <Menu.Shortcut>⌘B</Menu.Shortcut>
          </Menu.Item>
          <Menu.Item>
            <Icon as={Settings} size="sm" />
            Settings
            <Menu.Shortcut>⌘S</Menu.Shortcut>
          </Menu.Item>
          <Menu.Item>
            <Icon as={Keyboard} size="sm" />
            Keyboard shortcuts
            <Menu.Shortcut>⌘K</Menu.Shortcut>
          </Menu.Item>
        </Menu.Group>
        <Menu.Separator />
        <Menu.Group>
          <Menu.Item>
            <Icon as={Users} size="sm" />
            Team
          </Menu.Item>
          <Menu.SubmenuRoot>
            <Menu.SubmenuTrigger>
              <Icon as={UserPlus} size="sm" />
              Invite users
            </Menu.SubmenuTrigger>
            <Menu.Content>
              <Menu.Item>
                <Icon as={Mail} size="sm" />
                Email
              </Menu.Item>
              <Menu.Item>
                <Icon as={MessageSquare} size="sm" />
                Message
              </Menu.Item>
              <Menu.Separator />
              <Menu.Item>
                <Icon as={PlusCircle} size="sm" />
                More...
              </Menu.Item>
            </Menu.Content>
          </Menu.SubmenuRoot>
          <Menu.Item>
            <Icon as={Plus} size="sm" />
            New Team
            <Menu.Shortcut>⌘+T</Menu.Shortcut>
          </Menu.Item>
        </Menu.Group>
        <Menu.Separator />
        <Menu.Item>
          <Icon as={Github} size="sm" />
          GitHub
        </Menu.Item>
        <Menu.Item>
          <Icon as={LifeBuoy} size="sm" />
          Support
        </Menu.Item>
        <Menu.Item disabled>
          <Icon as={Cloud} size="sm" />
          API
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item>
          <Icon as={LogOut} size="sm" />
          Log out
          <Menu.Shortcut>⇧⌘Q</Menu.Shortcut>
        </Menu.Item>
      </Menu.Content>
    </Menu>
  )
};

const CheckboxesExample = () => {
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [showActivityBar, setShowActivityBar] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  return (
    <Menu>
      <Menu.Trigger
        render={(props) => (
          <Button variant="secondary" {...props}>
            Open
          </Button>
        )}
      />
      <Menu.Content align="start">
        <Menu.Group>
          <Menu.GroupLabel>Appearance</Menu.GroupLabel>
          <Menu.Separator />
          <Menu.CheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
            Status Bar
          </Menu.CheckboxItem>
          <Menu.CheckboxItem
            disabled
            checked={showActivityBar}
            onCheckedChange={setShowActivityBar}
          >
            Activity Bar
          </Menu.CheckboxItem>
          <Menu.CheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
            Panel
          </Menu.CheckboxItem>
        </Menu.Group>
      </Menu.Content>
    </Menu>
  );
};

export const Checkboxes: Story = {
  render: () => <CheckboxesExample />
};

const RadioGroupExample = () => {
  const [position, setPosition] = useState('bottom');

  return (
    <Menu>
      <Menu.Trigger
        render={(props) => (
          <Button variant="secondary" {...props}>
            Open
          </Button>
        )}
      />
      <Menu.Content align="start">
        <Menu.Group>
          <Menu.GroupLabel>Panel Position</Menu.GroupLabel>
          <Menu.Separator />
          <Menu.RadioGroup value={position} onValueChange={setPosition}>
            <Menu.RadioItem value="top">Top</Menu.RadioItem>
            <Menu.RadioItem value="bottom">Bottom</Menu.RadioItem>
            <Menu.RadioItem value="right">Right</Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Group>
      </Menu.Content>
    </Menu>
  );
};

export const RadioGroup: Story = {
  render: () => <RadioGroupExample />
};

export const OpenOnHover: Story = {
  render: () => (
    <Menu>
      <Menu.Trigger
        openOnHover
        delay={100}
        render={(props) => (
          <Button variant="secondary" {...props}>
            Hover me
          </Button>
        )}
      />
      <Menu.Content align="start">
        <Menu.Item>
          <Icon as={User} size="sm" />
          Profile
        </Menu.Item>
        <Menu.Item>
          <Icon as={Settings} size="sm" />
          Settings
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item>
          <Icon as={LogOut} size="sm" />
          Log out
        </Menu.Item>
      </Menu.Content>
    </Menu>
  )
};

export const WithIcons: Story = {
  render: () => (
    <Menu>
      <Menu.Trigger
        render={(props) => (
          <Button variant="secondary" {...props}>
            View
          </Button>
        )}
      />
      <Menu.Content align="start">
        <Menu.Group>
          <Menu.GroupLabel>View Options</Menu.GroupLabel>
          <Menu.Item>
            <Icon as={User} size="sm" />
            Show User Panel
          </Menu.Item>
          <Menu.Item>
            <Icon as={Settings} size="sm" />
            Show Settings
          </Menu.Item>
          <Menu.Item>
            <Icon as={Keyboard} size="sm" />
            Show Shortcuts
          </Menu.Item>
        </Menu.Group>
      </Menu.Content>
    </Menu>
  )
};

export const WithViewport: Story = {
  render: () => (
    <Menu>
      <Menu.Trigger
        render={(props) => (
          <Button variant="secondary" {...props}>
            Open
          </Button>
        )}
      />
      <Menu.Content align="start">
        <Menu.Viewport>
          <Menu.Group>
            <Menu.GroupLabel>Actions</Menu.GroupLabel>
            <Menu.Item>
              <Icon as={User} size="sm" />
              Profile
            </Menu.Item>
            <Menu.Item>
              <Icon as={Settings} size="sm" />
              Settings
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item>
              <Icon as={LogOut} size="sm" />
              Log out
            </Menu.Item>
          </Menu.Group>
        </Menu.Viewport>
      </Menu.Content>
    </Menu>
  )
};

export const Simple: Story = {
  render: () => (
    <Menu>
      <Menu.Trigger
        render={(props) => (
          <Button variant="secondary" {...props}>
            Actions
          </Button>
        )}
      />
      <Menu.Content align="start">
        <Menu.Item>Edit</Menu.Item>
        <Menu.Item>Duplicate</Menu.Item>
        <Menu.Separator />
        <Menu.Item>Archive</Menu.Item>
        <Menu.Item>Delete</Menu.Item>
      </Menu.Content>
    </Menu>
  )
};
