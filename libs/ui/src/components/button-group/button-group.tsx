import {
  StyledButtonGroup,
  StyledButtonGroupSeparator,
  StyledButtonGroupText
} from './button-group.styled';

type ButtonGroupRootProps = React.ComponentProps<typeof StyledButtonGroup>;

const Root: React.FunctionComponent<ButtonGroupRootProps> = ({
  orientation = 'horizontal',
  children,
  ...props
}) => {
  return (
    <StyledButtonGroup
      orientation={orientation}
      role="group"
      data-orientation={orientation}
      {...props}
    >
      {children}
    </StyledButtonGroup>
  );
};

type ButtonGroupSeparatorProps = React.ComponentProps<typeof StyledButtonGroupSeparator> & {
  orientation?: 'horizontal' | 'vertical';
};

const Separator: React.FunctionComponent<ButtonGroupSeparatorProps> = ({
  orientation,
  ...props
}) => {
  return (
    <StyledButtonGroupSeparator
      orientation={orientation}
      data-slot="button-group-separator"
      aria-hidden="true"
      {...props}
    />
  );
};

type ButtonGroupTextProps = React.ComponentProps<typeof StyledButtonGroupText>;

const Text: React.FunctionComponent<ButtonGroupTextProps> = (props) => {
  return <StyledButtonGroupText data-slot="button-group-text" {...props} />;
};

Root.displayName = 'ButtonGroup';
Separator.displayName = 'ButtonGroup.Separator';
Text.displayName = 'ButtonGroup.Text';

export const ButtonGroup = Object.assign(Root, {
  Separator,
  Text
});
