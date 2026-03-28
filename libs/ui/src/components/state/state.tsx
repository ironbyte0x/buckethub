import type { ComponentProps } from '@buckethub/styled-system/types';
import {
  StyledStateActions,
  StyledStateContent,
  StyledStateDescription,
  StyledStateHeader,
  StyledStateMedia,
  StyledStateRoot,
  StyledStateTitle
} from './state.styled';

export type StateProps = ComponentProps<typeof StyledStateRoot>;

const Root: React.FunctionComponent<StateProps> = ({ children, ...props }) => {
  return <StyledStateRoot {...props}>{children}</StyledStateRoot>;
};

export type StateHeaderProps = ComponentProps<typeof StyledStateHeader>;

const Header: React.FunctionComponent<StateHeaderProps> = ({ children, ...props }) => {
  return <StyledStateHeader {...props}>{children}</StyledStateHeader>;
};

export type StateMediaProps = ComponentProps<typeof StyledStateMedia>;

const Media: React.FunctionComponent<StateMediaProps> = ({
  children,
  variant = 'default',
  ...props
}) => {
  return (
    <StyledStateMedia variant={variant} {...props}>
      {children}
    </StyledStateMedia>
  );
};

export type StateTitleProps = ComponentProps<typeof StyledStateTitle>;

const Title: React.FunctionComponent<StateTitleProps> = ({ children, ...props }) => {
  return <StyledStateTitle {...props}>{children}</StyledStateTitle>;
};

export type StateDescriptionProps = ComponentProps<typeof StyledStateDescription>;

const Description: React.FunctionComponent<StateDescriptionProps> = ({ children, ...props }) => {
  return <StyledStateDescription {...props}>{children}</StyledStateDescription>;
};

export type StateContentProps = ComponentProps<typeof StyledStateContent>;

const Content: React.FunctionComponent<StateContentProps> = ({ children, ...props }) => {
  return <StyledStateContent {...props}>{children}</StyledStateContent>;
};

export type StateActionsProps = ComponentProps<typeof StyledStateActions>;

const Actions: React.FunctionComponent<StateActionsProps> = ({ children, ...props }) => {
  return <StyledStateActions {...props}>{children}</StyledStateActions>;
};

Root.displayName = 'State';
Header.displayName = 'State.Header';
Media.displayName = 'State.Media';
Title.displayName = 'State.Title';
Description.displayName = 'State.Description';
Content.displayName = 'State.Content';
Actions.displayName = 'State.Actions';

export const State = Object.assign(Root, {
  Header,
  Media,
  Title,
  Description,
  Content,
  Actions
});
