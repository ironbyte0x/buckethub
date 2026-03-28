import { styled } from '@buckethub/styled-system/jsx';

export const StyledUserInfoTrigger = styled('button', {
  base: {
    display: 'flex',
    alignItems: 'center',
    width: 'calc(100% + var(--spacing-4))',
    paddingBlock: '1.5',
    paddingLeft: '1.5',
    paddingRight: '3.5',
    marginInline: '-2',
    borderRadius: 'lg',
    transition: 'background-color 0.1s ease-out',
    cursor: 'pointer',
    textAlign: 'left',
    border: 'none',
    backgroundColor: 'transparent',

    '&:hover, &[data-popup-open]': {
      backgroundColor: 'background-button-secondary-hover'
    }
  }
});

export const StyledUserDetails = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '0',
    flex: '1',
    gap: '1',
    marginLeft: '2.5',
    marginRight: '1'
  }
});

export const StyledUserName = styled('span', {
  base: {
    textStyle: 'body-medium-emphasized',
    color: 'text-base',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
});

export const StyledUserEmail = styled('span', {
  base: {
    textStyle: 'body-small-emphasized',
    color: 'text-muted',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
});
