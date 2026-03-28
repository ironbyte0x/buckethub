import {
  StyledAlert,
  StyledAlertContent,
  StyledAlertDescription,
  StyledAlertIcon,
  StyledAlertTitle
} from './alert.styled';

const Root: React.FunctionComponent<React.ComponentProps<typeof StyledAlert>> = ({
  children,
  ...props
}) => {
  return <StyledAlert {...props}>{children}</StyledAlert>;
};

const AlertIcon: React.FunctionComponent<React.ComponentProps<typeof StyledAlertIcon>> = ({
  children,
  ...props
}) => {
  return <StyledAlertIcon {...props}>{children}</StyledAlertIcon>;
};

const Content: React.FunctionComponent<React.ComponentProps<typeof StyledAlertContent>> = ({
  children,
  ...props
}) => {
  return <StyledAlertContent {...props}>{children}</StyledAlertContent>;
};

const Title: React.FunctionComponent<React.ComponentProps<typeof StyledAlertTitle>> = ({
  children,
  ...props
}) => {
  return <StyledAlertTitle {...props}>{children}</StyledAlertTitle>;
};

const Description: React.FunctionComponent<React.ComponentProps<typeof StyledAlertDescription>> = ({
  children,
  ...props
}) => {
  return <StyledAlertDescription {...props}>{children}</StyledAlertDescription>;
};

Root.displayName = 'Alert';
AlertIcon.displayName = 'Alert.Icon';
Content.displayName = 'Alert.Content';
Title.displayName = 'Alert.Title';
Description.displayName = 'Alert.Description';

export const Alert = Object.assign(Root, {
  Icon: AlertIcon,
  Content,
  Title,
  Description
});
