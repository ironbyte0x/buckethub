import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { withPolymorphicProps } from '../../utils';
import { Icon } from '../icon';
import { StyledButton } from './button.styled';

export type ButtonProps = React.ComponentProps<typeof StyledButton> & {
  loading?: boolean;
};

export const Button = withPolymorphicProps(
  ({ loading = false, disabled, children, ...props }: ButtonProps) => {
    return (
      <StyledButton {...props} disabled={disabled || loading}>
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{
                width: 0,
                opacity: 0,
                marginRight: 'calc(var(--button-gap) * -1)'
              }}
              animate={{ width: 'auto', opacity: 1, marginRight: '0' }}
              exit={{
                width: 0,
                opacity: 0,
                marginRight: 'calc(var(--button-gap) * -1)'
              }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{ overflow: 'hidden', display: 'flex' }}
            >
              <Icon
                as={Loader2}
                size="sm"
                css={{
                  animation: 'spin 1s linear infinite',
                  flexShrink: 0
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {children}
      </StyledButton>
    );
  }
);
