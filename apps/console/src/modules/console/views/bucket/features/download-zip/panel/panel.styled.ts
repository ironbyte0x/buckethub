import { motion } from 'motion/react';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledPanel = styled(motion.div, {
  base: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    bottom: '8',
    right: '8',
    width: '320px',
    backgroundColor: 'background-base',
    border: 'base',
    borderRadius: 'lg',
    boxShadow: 'lg',
    padding: '4',
    zIndex: '50'
  }
});
