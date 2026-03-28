import { Toast } from '@base-ui/react/toast';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledRoot = styled(Toast.Root, {
  base: {
    textStyle: 'body-medium',
    color: 'text-subtle',
    backgroundColor: 'background-base',
    border: 'base',
    paddingBlock: '1.5',
    paddingInline: '2',
    borderRadius: 'lg',
    boxShadow: 'md',
    transition: 'opacity 0.3s {easings.ease-out-quart}',
    zIndex: 20000,

    '&[data-starting-style], &[data-ending-style]': {
      opacity: '0'
    }
  }
});
