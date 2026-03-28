import { styled } from '@buckethub/styled-system/jsx';

export const StyledBucketItem = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '3',
    paddingInline: '3',
    paddingBlock: '2.5',
    borderRadius: 'lg',
    border: '1px solid',
    borderColor: 'border-input',
    backgroundColor: 'background-base',
    cursor: 'pointer',
    transition: 'all 0.2s',

    '&:hover': {
      backgroundColor: '{colors.background-base/50}'
    }
  }
});

export const StyledBucketIcon = styled('div', {
  base: {
    width: '6',
    height: '6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'text-muted'
  }
});
