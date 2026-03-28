import { StyledAvatarFallback, StyledAvatarImage, StyledAvatarRoot } from './avatar.styled';

const Root: React.FunctionComponent<React.ComponentProps<typeof StyledAvatarRoot>> = ({
  children,
  ...props
}) => {
  return <StyledAvatarRoot {...props}>{children}</StyledAvatarRoot>;
};

const Image: React.FunctionComponent<React.ComponentProps<typeof StyledAvatarImage>> = (props) => {
  return <StyledAvatarImage {...props} />;
};

const Fallback: React.FunctionComponent<React.ComponentProps<typeof StyledAvatarFallback>> = ({
  children,
  ...props
}) => {
  return <StyledAvatarFallback {...props}>{children}</StyledAvatarFallback>;
};

Root.displayName = 'Avatar';
Image.displayName = 'Avatar.Image';
Fallback.displayName = 'Avatar.Fallback';

export const Avatar = Object.assign(Root, {
  Image,
  Fallback
});
