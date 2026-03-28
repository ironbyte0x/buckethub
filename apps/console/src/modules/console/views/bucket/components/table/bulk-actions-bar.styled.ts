import { motion } from 'motion/react';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledBulkActionsBar = styled(motion.div, {
  base: {
    position: 'fixed',
    bottom: '8',
    left: '50%',
    display: 'flex',
    alignItems: 'center',
    gap: '2.5',
    paddingInline: '4',
    paddingBlock: '2',
    backgroundColor: 'background-base',
    border: 'base',
    borderRadius: 'xl',
    boxShadow: 'lg',
    zIndex: '50'
  }
});
