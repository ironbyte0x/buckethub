import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledRoot = styled(AccordionPrimitive.Root, {
  base: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '4'
  }
});

export const StyledAccordionItem = styled(AccordionPrimitive.Item, {
  base: {
    backgroundColor: 'background-surface',
    borderRadius: 'xl',
    border: '1px solid {colors.border-input}',
    overflow: 'hidden'
  }
});

export const StyledAccordionHeader = styled(AccordionPrimitive.Header, {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingInline: '4',
    paddingBlock: '4',
    cursor: 'pointer',

    '&[data-open] [data-slot="accordion-chevron"]': {
      transform: 'rotate(180deg)'
    }
  }
});

export const StyledAccordionTrigger = styled(AccordionPrimitive.Trigger, {
  base: {
    width: '100%',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    padding: '0',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit'
  }
});

export const StyledAccordionPanel = styled(AccordionPrimitive.Panel, {
  base: {
    height: 'var(--accordion-panel-height)',
    overflow: 'hidden',
    transition: 'height 0.3s {easings.ease-out-quart}',

    '&[data-starting-style], &[data-ending-style]': {
      height: '0'
    }
  }
});
