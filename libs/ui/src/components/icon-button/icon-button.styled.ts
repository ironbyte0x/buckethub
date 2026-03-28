import { styled } from '@buckethub/styled-system/jsx';
import { Button } from '../button/button';

export const StyledIconButton = styled(Button, {
  base: {
    width: 'var(--button-height)',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
