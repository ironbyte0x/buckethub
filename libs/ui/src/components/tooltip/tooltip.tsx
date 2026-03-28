import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { StyledPopup, StyledTrigger } from './tooltip.styled';

type RootProps = React.ComponentProps<typeof TooltipPrimitive.Root>;

const Root: React.FunctionComponent<RootProps> = ({ children, ...props }) => {
  return <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>;
};

type ContentProps = React.ComponentProps<typeof StyledPopup> &
  Pick<
    React.ComponentProps<typeof TooltipPrimitive.Positioner>,
    'side' | 'align' | 'sideOffset' | 'alignOffset'
  >;

const Content: React.FunctionComponent<ContentProps> = ({
  side,
  align,
  sideOffset,
  alignOffset,
  children,
  ...props
}) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset ?? 8}
        alignOffset={alignOffset}
        style={{ zIndex: 2000 }}
      >
        <StyledPopup {...props}>{children}</StyledPopup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
};

export const Tooltip = Object.assign(Root, {
  Provider: TooltipPrimitive.Provider,
  Trigger: StyledTrigger,
  Content,
  createHandle: TooltipPrimitive.createHandle
});
