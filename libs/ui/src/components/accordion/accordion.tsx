import { ChevronDownIcon } from 'lucide-react';
import { SystemStyleObject } from '@buckethub/styled-system/types';
import { Icon } from '../icon';
import {
  StyledAccordionHeader,
  StyledAccordionItem,
  StyledAccordionPanel,
  StyledAccordionTrigger,
  StyledRoot
} from './accordion.styled';

const Root: React.FunctionComponent<React.ComponentProps<typeof StyledRoot>> = ({
  children,
  ...props
}) => {
  return <StyledRoot {...props}>{children}</StyledRoot>;
};

const Item: React.FunctionComponent<React.ComponentProps<typeof StyledAccordionItem>> =
  StyledAccordionItem;

const Header: React.FunctionComponent<React.ComponentProps<typeof StyledAccordionHeader>> =
  StyledAccordionHeader;

const Trigger: React.FunctionComponent<React.ComponentProps<typeof StyledAccordionTrigger>> =
  StyledAccordionTrigger;

const Panel: React.FunctionComponent<React.ComponentProps<typeof StyledAccordionPanel>> =
  StyledAccordionPanel;

export interface ChevronProps extends React.ComponentProps<typeof Icon> {
  css?: SystemStyleObject;
}

const Chevron: React.FunctionComponent<ChevronProps> = ({ css = {}, ...props }) => {
  return (
    <Icon
      as={ChevronDownIcon}
      data-slot="accordion-chevron"
      size="sm"
      css={[{ transition: 'transform 0.2s ease', marginLeft: 'auto' }, css]}
      {...props}
    />
  );
};

Root.displayName = 'Accordion';
Item.displayName = 'Accordion.Item';
Header.displayName = 'Accordion.Header';
Trigger.displayName = 'Accordion.Trigger';
Panel.displayName = 'Accordion.Panel';
Chevron.displayName = 'Accordion.Chevron';

export const Accordion = Object.assign(Root, {
  Item,
  Header,
  Trigger,
  Panel,
  Chevron
});
