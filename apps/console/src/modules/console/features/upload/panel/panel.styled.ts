import { motion } from 'motion/react';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledPanel = styled(motion.div, {
  base: {
    position: 'fixed',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    bottom: '8',
    right: '8',
    width: '390px',
    maxHeight: '420px',
    backgroundColor: 'background-base',
    border: 'base',
    borderRadius: 'lg',
    boxShadow: 'lg',
    overflow: 'hidden',
    zIndex: '50'
  }
});

export const StyledHeader = styled('div', {
  base: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingInline: '4',
    paddingBlock: '2',
    borderBottom: '1px solid {colors.border-base}'
  }
});

export const StyledFooter = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingInline: '4',
    paddingBlock: '3',
    borderTop: '1px solid {colors.border-base}',
    backgroundColor: 'background-subtle'
  }
});
