import { useEffect, useState } from 'react';
import { Box, Flex } from '@buckethub/styled-system/jsx';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {}
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    show: true
  },
  render: (props) => (
    <Flex css={{ alignItems: 'center', gap: '4' }}>
      <Skeleton css={{ height: '12', width: '12', borderRadius: 'full' }} {...props} />
      <Flex css={{ flexDirection: 'column', gap: '2' }}>
        <Skeleton css={{ height: '4', width: '250px' }} {...props} />
        <Skeleton css={{ height: '4', width: '200px' }} {...props} />
      </Flex>
    </Flex>
  )
};

export const RevealContent: Story = {
  args: {},
  render: () => {
    const [show, setShow] = useState(true);

    useEffect(() => {
      const timeout = setTimeout(() => {
        setShow(false);
      }, 3000);

      return () => {
        clearTimeout(timeout);
      };
    }, []);

    return (
      <Flex css={{ alignItems: 'center', gap: '4' }}>
        <Skeleton show={show} css={{ height: '12', width: '12', borderRadius: 'full' }}>
          <Box
            css={{
              height: '12',
              width: '12',
              borderRadius: 'full',
              backgroundColor: 'primary.300'
            }}
          />
        </Skeleton>
        <Flex css={{ flexDirection: 'column', gap: '2' }}>
          <Skeleton show={show} css={{ height: '4', width: '250px' }}>
            <Box
              css={{
                height: '4',
                width: '250px',
                borderRadius: 'md',
                backgroundColor: 'primary.300'
              }}
            />
          </Skeleton>
          <Skeleton show={show} css={{ height: '4', width: '200px' }}>
            <Box
              css={{
                height: '4',
                width: '200px',
                borderRadius: 'md',
                backgroundColor: 'primary.300'
              }}
            />
          </Skeleton>
        </Flex>
      </Flex>
    );
  }
};
