import { StyledSeparator } from './separator.styled';

export type SeparatorProps = React.ComponentProps<typeof StyledSeparator>;

export const Separator: React.FunctionComponent<SeparatorProps> = (props) => {
  return <StyledSeparator {...props} />;
};
