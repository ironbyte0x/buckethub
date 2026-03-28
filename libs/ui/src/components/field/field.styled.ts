import { motion } from 'motion/react';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledFieldRoot = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    width: 'full'
  }
});

export const StyledFieldLabel = styled('label', {
  base: {
    marginBottom: '2',
    width: 'fit-content',
    textStyle: 'body-large-emphasized',
    color: 'text-base',
    cursor: 'pointer'
  }
});

export const StyledFieldDescription = styled('div', {
  base: {
    display: 'block',
    marginTop: '1',
    textStyle: 'body-medium',
    color: 'text-muted'
  }
});

export const StyledFieldError = styled(motion.div, {
  base: {
    textStyle: 'body-medium',
    color: 'error.500',
    overflow: 'hidden'
  }
});
