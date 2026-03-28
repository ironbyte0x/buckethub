import { styled } from '@buckethub/styled-system/jsx';

export const StyledRoot = styled('div', {
  base: {
    border: '1px solid {colors.border-input}',
    borderRadius: 'lg',
    overflow: 'hidden',
    backgroundColor: 'background-base',
    boxShadow: 'xs'
  }
});

export const StyledBreadcrumb = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '1',
    paddingInline: '2',
    paddingBlock: '2',
    borderBottom: '1px solid {colors.border-input}',
    backgroundColor: 'background-base',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  }
});

export const StyledBreadcrumbContainer = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5',
    flexWrap: 'wrap',
    flex: 1,
    minWidth: 0
  }
});

export const StyledBreadcrumbButton = styled('button', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '1',
    paddingInline: '2',
    paddingBlock: '1',
    borderRadius: 'md',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    transition: 'background-color 0.15s',
    border: 'none',

    '&:hover': {
      backgroundColor: 'background-surface'
    }
  }
});

export const StyledList = styled('div', {
  base: {
    maxHeight: '48',
    overflowY: 'auto',

    '& > *:last-child': {
      borderBottom: 'none'
    }
  }
});

export const StyledEmpty = styled('div', {
  base: {
    paddingInline: '4',
    paddingBlock: '8',
    textAlign: 'center',
    color: 'text-muted'
  }
});
