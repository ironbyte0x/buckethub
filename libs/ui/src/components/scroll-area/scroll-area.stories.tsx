import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from './scroll-area';

const meta: Meta<typeof ScrollArea> = {
  component: ScrollArea,
  title: 'Components/ScrollArea'
} satisfies Meta<typeof ScrollArea>;

export default meta;

type Story = StoryObj<typeof ScrollArea>;

export const Vertical: Story = {
  render: () => (
    <ScrollArea
      style={{
        height: '200px',
        width: '300px',
        border: '1px solid #ccc',
        borderRadius: '8px'
      }}
    >
      <ScrollArea.Gradient position="top" />
      <ScrollArea.Gradient position="bottom" />

      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <div style={{ padding: '16px' }}>
            <h3>Vertical Scrolling Content</h3>
            <p>This is a paragraph with content that will overflow vertically.</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium.
            </p>
            <p>
              Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
              beatae vitae dicta sunt explicabo.
            </p>
          </div>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea>
  )
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea style={{ width: '300px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <div style={{ padding: '16px', width: '600px' }}>
            <h3>Horizontal Scrolling Content</h3>
            <p>This content is wider than the container and will scroll horizontally.</p>
          </div>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea>
  )
};

export const Both: Story = {
  render: () => (
    <ScrollArea
      style={{
        height: '300px',
        width: '400px',
        border: '1px solid #ccc',
        borderRadius: '8px'
      }}
    >
      <ScrollArea.Gradient position="top" />
      <ScrollArea.Gradient position="bottom" />
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <div style={{ padding: '16px', width: '600px' }}>
            <h3>Vertical and Horizontal Scrolling</h3>
            <p>This content overflows both vertically and horizontally.</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium.
            </p>
            <p>
              Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
              beatae vitae dicta sunt explicabo.
            </p>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
            <p>Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
          </div>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea>
  )
};
