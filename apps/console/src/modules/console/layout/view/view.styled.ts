import { styled } from '@buckethub/styled-system/jsx';

export const StyledView = styled('main', {
  base: {
    '--view-inline-padding': '{spacing.3}',

    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: '1',
    backgroundColor: 'background-base',

    sm: {
      '--view-inline-padding': '{spacing.6}'
    },

    lg: {
      border: 'base',
      borderRadius: 'xl'
    }
  }
});
