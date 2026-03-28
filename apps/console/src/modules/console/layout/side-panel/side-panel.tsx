import { createContext, useContext } from 'react';
import { XIcon } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { Icon, IconButton } from '@buckethub/ui';
import {
  StyledContent,
  StyledGroup,
  StyledHeader,
  StyledPanel,
  StyledTitle,
  StyledWrapper
} from './side-panel.styled';

interface PanelContextValue {
  onOpenChange: (open: boolean) => void;
}

const PanelContext = createContext<PanelContextValue | null>(null);

interface SidePanelProps {
  open: boolean;
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
}

const Root: React.FunctionComponent<SidePanelProps> = ({ open, children, onOpenChange }) => {
  return (
    <AnimatePresence>
      {open && (
        <StyledWrapper
          initial={{ width: 0 }}
          animate={{ width: '330px' }}
          exit={{ width: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        >
          <PanelContext value={{ onOpenChange }}>{children}</PanelContext>
        </StyledWrapper>
      )}
    </AnimatePresence>
  );
};

const Close: React.FunctionComponent = () => {
  const context = useContext(PanelContext);

  if (!context) {
    throw new Error('Close must be used within a SidePanel');
  }

  return (
    <IconButton
      variant="ghost"
      size="xs"
      css={{ marginRight: '-2' }}
      onClick={() => context.onOpenChange(false)}
    >
      <Icon as={XIcon} size="md" color="neutral" />
    </IconButton>
  );
};

export const SidePanel = Object.assign(Root, {
  Panel: StyledPanel,
  Header: StyledHeader,
  Title: StyledTitle,
  Close,
  Content: StyledContent,
  Group: StyledGroup
});
