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
  css?: SystemStyleObject;
}

const Content: React.FunctionComponent<ContentProps> = ({ css = {}, children, ...props }) => {
  return (
    <MotionBox
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      exit={{
        opacity: 0
      }}
      css={[
        {
          overflow: 'hidden'
        },
        css
      ]}
      transition={{
        duration: 0.1,
        ease: 'easeOut'
      }}
      {...props}
    >
      {children}
    </MotionBox>
  );
};

export const Fade = Object.assign(Root, {
  Content
});
