import { withPolymorphicProps } from '../../utils';
import { StyledIcon } from './icon.styled';

export const Icon = withPolymorphicProps((props: React.ComponentProps<typeof StyledIcon>) => {
  return (
    <StyledIcon
      data-slot="icon-root"
      {...(props.size ? { 'data-size': props.size } : {})}
      {...props}
    />
  );
});
