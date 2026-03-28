import { styled } from '@buckethub/styled-system/jsx';

export const StyledManagementItem = styled('a', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    paddingBlock: '1.5',
    paddingInline: '2',
    borderRadius: 'lg',
    color: 'text-base',
    cursor: 'pointer',
    transition: 'all 0.15s ease-out',
    textDecoration: 'none',
    border: '1px solid {colors.background-secondary}',

    '&:hover': {
      backgroundColor: 'background-button-secondary'
    },

    '&[data-status="active"]': {
      backgroundColor: 'background-button-secondary',
      borderColor: 'border-base'
    },

    '& [data-slot="icon-root"]': {
      color: 'text-muted',
      transition: 'color 0.15s ease-out'
    },

    '&:hover [data-slot="icon-root"]': {
      color: 'text-base'
    }
  }
});
