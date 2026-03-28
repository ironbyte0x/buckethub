import { motion } from 'motion/react';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledWrapper = styled(motion.div, {
  base: {
    height: '100%',
    overflow: 'hidden'
  }
});

export const StyledPanel = styled('div', {
  base: {
    width: '330px',
    height: '100%',
    borderLeft: 'base'
  }
});

export const StyledTitle = styled('h3', {
  base: {
    textStyle: 'title-medium',
    color: 'text-base'
  }
});

export const StyledHeader = styled('div', {
  base: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: 'base',
    paddingInline: '5',
    paddingBlock: '3'
  }
});

export const StyledContent = styled('div', {
  base: {
    padding: '5'
  }
});

export const StyledGroup = styled('div', {
  base: {
    padding: '5',
    borderTop: 'base'
  }
});
