import { styled } from '@buckethub/styled-system/jsx';

export const StyledSkeleton = styled('div', {
  base: {
    position: 'relative',
    display: 'inline-block',
    borderRadius: 'lg',
    flexShrink: 0,

    _before: {
      '--skeleton-gradient':
        'linear-gradient(to right, rgba(255, 255, 255,0) 0%, rgba(0,0,0,0.03) 20%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 100%), var(--colors-background-surface)',
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      background: 'var(--skeleton-gradient)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '300% 100%',
      width: '100%',
      height: '100%',
      opacity: '0',
      animation: 'skeleton 1.4s linear forwards infinite',
      transition: 'opacity 0.6s ease',

      _dark: {
        '--skeleton-gradient':
          'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255,0.03) 20%, rgba(255, 255, 255,0) 40%, rgba(255, 255, 255,0) 100%), var(--colors-grey-900)'
      }
    }
  },
  variants: {
    show: {
      true: {
        _before: {
          opacity: '1'
        }
      }
    }
  },
  defaultVariants: {
    show: true
  }
});
