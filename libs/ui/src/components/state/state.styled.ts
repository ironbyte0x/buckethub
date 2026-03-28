import { styled } from '@buckethub/styled-system/jsx';

export const StyledStateRoot = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    paddingBlock: '12',
    paddingInline: '4',
    textAlign: 'center'
  }
});

export const StyledStateHeader = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2'
  }
});

export const StyledStateMedia = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  variants: {
    variant: {
      default: {},
      icon: {
        padding: '3',
        borderRadius: 'full',
        color: 'text-base',
        backgroundColor: 'background-surface'
      }
    }
  },

  defaultVariants: {
    variant: 'default'
  }
});

export const StyledStateContent = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2'
  }
});

export const StyledStateTitle = styled('h3', {
  base: {
    textStyle: 'body-large-emphasized',
    color: 'text-base'
  }
});

export const StyledStateDescription = styled('p', {
  base: {
    textStyle: 'body-medium',
    color: 'text-muted',
    maxWidth: '80'
  }
});

export const StyledStateActions = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    marginTop: '2'
  }
});
