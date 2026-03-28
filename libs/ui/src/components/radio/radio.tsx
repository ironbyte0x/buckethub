import {
  StyledRadioGroupIndicator,
  StyledRadioGroupItem,
  StyledRadioGroupRoot
} from './radio.styled';

const Root: React.FunctionComponent<React.ComponentProps<typeof StyledRadioGroupRoot>> = ({
  children,
  ...props
}) => {
  return <StyledRadioGroupRoot {...props}>{children}</StyledRadioGroupRoot>;
};

const Item: React.FunctionComponent<React.ComponentProps<typeof StyledRadioGroupItem>> = ({
  children,
  ...props
}) => {
  return (
    <StyledRadioGroupItem {...props}>
      <StyledRadioGroupIndicator />
      {children}
    </StyledRadioGroupItem>
  );
};

Root.displayName = 'Radio';
Item.displayName = 'Radio.Item';

export const Radio: typeof Root & {
  Item: typeof Item;
} = Object.assign(Root, {
  Item
});
