import { styled } from '@buckethub/styled-system/jsx';

export const StyledItemGroup = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column'
  }
});

export const StyledItem = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid transparent',
    borderRadius: 'lg',
    transition: 'all 0.1s ease-out',
    flexWrap: 'wrap',
    outline: 'none',
    textStyle: 'body-large',

    '&:focus-visible': {
      borderColor: 'border-active',
      boxShadow: '0 0 0 3px {colors.grey.200}'
    }
  },

  variants: {
    variant: {
      default: {
        backgroundColor: 'transparent'
      },
      outline: {
        borderColor: 'border-input'
      },
      muted: {
        backgroundColor: 'background-surface'
      }
    },
    actionable: {
      true: {
        cursor: 'pointer',
        transition: 'background-color 0.1s ease-out, border-color 0.1s ease-out',

        '&:hover': {
          backgroundColor: 'background-button-secondary-hover'
        },

        '&:has([aria-checked="true"])': {
          borderColor: 'border-active',
          backgroundColor: 'background-surface'
        }
      }
    },
    size: {
      md: {
        padding: '4',
        gap: '4'
      },
      sm: {
        paddingBlock: '3',
        paddingInline: '4',
        gap: '2.5'
      }
    }
  },

  defaultVariants: {
    variant: 'default',
    size: 'md'
  }
});

export const StyledItemMedia = styled('div', {
  base: {
    display: 'flex',
    flexShrink: '0',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',

    '& svg': {
      pointerEvents: 'none'
    }
  },

  variants: {
    variant: {
      default: {
        backgroundColor: 'transparent'
      },
      icon: {
        width: '8',
        height: '8',
        border: '1px solid',
        borderColor: 'border-base',
        borderRadius: 'sm',
        backgroundColor: 'background-surface'
      },
      image: {
        width: '10',
        height: '10',
        borderRadius: 'sm',
        overflow: 'hidden',

        '& img': {
          width: 'full',
          height: 'full',
          objectFit: 'cover'
        }
      }
    }
  },

  defaultVariants: {
    variant: 'default'
  }
});

export const StyledItemContent = styled('div', {
  base: {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    gap: '1',

    '&:has(+ [data-slot="item-content"])': {
      flex: 'none'
    }
  }
});

export const StyledItemTitle = styled('div', {
  base: {
    display: 'flex',
    width: 'fit-content',
    alignItems: 'center',
    gap: '2',
    textStyle: 'body-large-emphasized',
    color: 'text-base'
  }
});

export const StyledItemDescription = styled('p', {
  base: {
    color: 'text-muted',
    textStyle: 'body-medium',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: '2',

    '& a': {
      textDecoration: 'underline',
      textUnderlineOffset: '4px'
    },

    '& a:hover': {
      color: 'text-base'
    }
  }
});

export const StyledItemActions = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2'
  }
});

export const StyledItemHeader = styled('div', {
  base: {
    display: 'flex',
    flexBasis: 'full',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2'
  }
});

export const StyledItemFooter = styled('div', {
  base: {
    display: 'flex',
    flexBasis: 'full',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2'
  }
});
