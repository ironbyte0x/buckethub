import { motion } from 'motion/react';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledItem = styled(motion.div, {
  base: {
    '--padding-block': 'var(--spacing-3)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '2',
    paddingInline: '4',
    paddingBlock: 'var(--padding-block)',
    borderBottom: 'base',

    '&:last-child': {
      borderBottom: 'none'
    }
  }
});
