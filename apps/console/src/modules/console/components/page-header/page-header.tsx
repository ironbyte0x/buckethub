import {
  StyledActionsContainer,
  StyledContainer,
  StyledInfoContainer,
  StyledSubtitle,
  StyledTitle
} from './page-header.styled';

export const Root = StyledContainer;

const Info = Object.assign(StyledInfoContainer, {
  Title: StyledTitle,
  Subtitle: StyledSubtitle
});

const Actions = StyledActionsContainer;

export const PageHeader = Object.assign(Root, {
  Info,
  Actions
});
