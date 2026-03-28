import { styled } from '@buckethub/styled-system/jsx';
import { Link } from '@tanstack/react-router';

export const StyledNavItem = styled(Link, {
  base: {
    paddingBlock: '2',
    paddingInline: '4',
    borderRadius: 'lg',
    textStyle: 'body-medium',
    color: 'text-muted',
    transition: 'colors',

    '&:hover:not([data-active="true"])': {
      color: 'text-base',
      backgroundColor: 'background-surface'
    },

    '&[data-active="true"]': {
      color: 'text-button-primary',
      backgroundColor: 'background-button-primary',
      fontWeight: '500'
    }
  }
});
