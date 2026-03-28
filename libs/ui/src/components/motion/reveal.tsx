import { AnimatePresence } from 'motion/react';
import { SystemStyleObject } from '@buckethub/styled-system/types';
import { MotionBox } from './instances';

interface RootProps {
  initial?: boolean;
  children: React.ReactNode;
}

const Root: React.FunctionComponent<RootProps> = ({ initial = false, children }) => {
  return <AnimatePresence initial={initial}>{children}</AnimatePresence>;
};

interface ContentProps extends React.ComponentProps<typeof MotionBox> {
  animateDimension?: 'height' | 'width';
  css?: SystemStyleObject;
}

const Content: React.FunctionComponent<ContentProps> = ({
  css = {},
  animateDimension = 'height',
  children,
  ...props
}) => {
  return (
    <MotionBox
      initial={{
        [animateDimension]: '0px',
        opacity: 0
      }}
      animate={{
        [animateDimension]: 'auto',
        opacity: 1
      }}
      exit={{
        [animateDimension]: '0px',
        opacity: 0
      }}
      css={[
        {
          flexShrink: 0,
          overflow: 'hidden'
        },
        css
      ]}
      transition={{
        type: 'spring',
        stiffness: 320,
        damping: 34
      }}
      {...props}
    >
      {children}
    </MotionBox>
  );
};

export const Reveal = Object.assign(Root, {
  Content
});
