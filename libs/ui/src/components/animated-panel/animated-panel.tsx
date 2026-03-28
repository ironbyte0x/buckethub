'use client';

import { Children, cloneElement, isValidElement } from 'react';
import useMeasure from 'react-use-measure';
import { motion, TargetAndTransition } from 'motion/react';
import { Box } from '@buckethub/styled-system/jsx';
import { SystemStyleObject } from '@buckethub/styled-system/types';

const MotionBox = motion.create(Box);

interface AnimatedPanelProps extends Omit<
  React.ComponentPropsWithoutRef<typeof MotionBox>,
  'animate'
> {
  animate?: TargetAndTransition;
  css?: SystemStyleObject;
}

export const AnimatedPanel: React.FunctionComponent<AnimatedPanelProps> = ({
  css = {},
  animate = {},
  children,
  ...props
}) => {
  const [ref, { width, height }] = useMeasure({
    offsetSize: true
  });

  if (!Children.only(children) || !isValidElement(children)) {
    throw new Error('AnimatedPanel only accepts a single child');
  }

  return (
    <MotionBox
      css={[
        {
          overflow: 'hidden'
        },
        css
      ]}
      animate={{
        width: width || undefined,
        height: height || undefined,
        transition: {
          type: 'keyframes',
          ease: [0.22, 1, 0.36, 1],
          duration: 0.4
        },
        ...animate
      }}
      {...props}
    >
      {cloneElement(children, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ref
      })}
    </MotionBox>
  );
};
