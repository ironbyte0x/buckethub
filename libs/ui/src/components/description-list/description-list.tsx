import { StyledDescription, StyledItem, StyledList, StyledTerm } from './description-list.styled';

export const DescriptionList = Object.assign(StyledList, {
  Item: StyledItem,
  Term: StyledTerm,
  Description: StyledDescription
});
