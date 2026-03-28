import { styled } from '@buckethub/styled-system/jsx';

export const StyledText = styled('span', {
  base: {},
  variants: {
    variant: {
      'title-extra-large': {
        textStyle: 'title-extra-large'
      },
      'title-large': {
        textStyle: 'title-large'
      },
      'title-medium': {
        textStyle: 'title-medium'
      },
      'title-small': {
        textStyle: 'title-small'
      },
      'subtitle-large': {
        textStyle: 'subtitle-large'
      },
      'body-large': {
        textStyle: 'body-large'
      },
      'body-large-emphasized': {
        textStyle: 'body-large-emphasized'
      },
      'body-medium': {
        textStyle: 'body-medium'
      },
      'body-medium-emphasized': {
        textStyle: 'body-medium-emphasized'
      },
      'body-medium-accent': {
        textStyle: 'body-medium-accent'
      },
      'body-small-emphasized': {
        textStyle: 'body-small-emphasized'
      },
      caption: {
        textStyle: 'caption'
      }
    },
    color: {
      base: {
        color: 'text-base'
      },
      subtle: {
        color: 'text-subtle'
      },
      muted: {
        color: 'text-muted'
      },
      placeholder: {
        color: 'text-placeholder'
      }
    },
    truncate: {
      true: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }
  },

  defaultVariants: {
    color: 'base'
  }
});
