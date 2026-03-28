import { styled } from '@buckethub/styled-system/jsx';

export const StyledButtonGroup = styled('div', {
  base: {
    display: 'inline-flex',
    isolation: 'isolate',

    '& > *': {
      position: 'relative'
    }
  },

  variants: {
    orientation: {
      horizontal: {
        flexDirection: 'row',

        '& > :not(:last-child):not([data-slot="button-group-separator"])': {
          borderEndEndRadius: '0',
          borderStartEndRadius: '0'
        },

        '& > :not(:first-child):not([data-slot="button-group-separator"])': {
          borderEndStartRadius: '0',
          borderStartStartRadius: '0',
          marginInlineStart: '-1px'
        }
      },
      vertical: {
        flexDirection: 'column',

        '& > :not(:last-child):not([data-slot="button-group-separator"])': {
          borderEndStartRadius: '0',
          borderEndEndRadius: '0'
        },

        '& > :not(:first-child):not([data-slot="button-group-separator"])': {
          borderStartStartRadius: '0',
          borderStartEndRadius: '0',
          marginBlockStart: '-1px'
        }
      }
    }
  },

  defaultVariants: {
    orientation: 'horizontal'
  }
});

export const StyledButtonGroupSeparator = styled('div', {
  base: {
    flexShrink: 0,
    backgroundColor: 'border-input'
  },

  variants: {
    orientation: {
      horizontal: {
        width: '1px',
        height: 'auto',
        alignSelf: 'stretch',
        marginBlock: '1'
      },
      vertical: {
        height: '1px',
        width: 'auto',
        alignSelf: 'stretch',
        marginInline: '1'
      }
    }
  },

  defaultVariants: {
    orientation: 'horizontal'
  }
});

export const StyledButtonGroupText = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    paddingInline: '3',
    textStyle: 'body-medium',
    color: 'text-base',
    backgroundColor: 'background-surface',
    border: '1px solid {colors.border-input}',
    borderRadius: 'lg',
    userSelect: 'none'
  }
});
