import {
  StyledScrollAreaContent,
  StyledScrollAreaCorner,
  StyledScrollAreaGradient,
  StyledScrollAreaRoot,
  StyledScrollAreaScrollbar,
  StyledScrollAreaThumb,
  StyledScrollAreaViewport
} from './scroll-area.styled';

const Root: React.FunctionComponent<React.ComponentProps<typeof StyledScrollAreaRoot>> = ({
  children,
  ...props
}) => {
  return <StyledScrollAreaRoot {...props}>{children}</StyledScrollAreaRoot>;
};

const Viewport: React.FunctionComponent<React.ComponentProps<typeof StyledScrollAreaViewport>> = ({
  children,
  ...props
}) => {
  return <StyledScrollAreaViewport {...props}>{children}</StyledScrollAreaViewport>;
};

const Content: React.FunctionComponent<React.ComponentProps<typeof StyledScrollAreaContent>> = ({
  children,
  ...props
}) => {
  return (
    <StyledScrollAreaContent data-slot="scroll-area-content" {...props}>
      {children}
    </StyledScrollAreaContent>
  );
};

const Scrollbar: React.FunctionComponent<
  React.ComponentProps<typeof StyledScrollAreaScrollbar>
> = ({ children, ...props }) => {
  return (
    <StyledScrollAreaScrollbar data-slot="scroll-area-scrollbar" {...props}>
      {children}
    </StyledScrollAreaScrollbar>
  );
};

const Thumb: React.FunctionComponent<React.ComponentProps<typeof StyledScrollAreaThumb>> = (
  props
) => {
  return <StyledScrollAreaThumb {...props} />;
};

const Corner: React.FunctionComponent<React.ComponentProps<typeof StyledScrollAreaCorner>> = (
  props
) => {
  return <StyledScrollAreaCorner {...props} />;
};

const GradientPart: React.FunctionComponent<
  React.ComponentProps<typeof StyledScrollAreaGradient> & {
    position: 'top' | 'bottom' | 'left' | 'right';
  }
> = ({ position, ...props }) => {
  return (
    <StyledScrollAreaGradient
      data-slot={`scroll-area-gradient-${position}`}
      position={position}
      {...props}
    />
  );
};

const Gradient: React.FunctionComponent<React.ComponentProps<typeof StyledScrollAreaGradient>> = (
  props
) => {
  return (
    <>
      <GradientPart position="top" {...props} />
      <GradientPart position="bottom" {...props} />
      <GradientPart position="left" {...props} />
      <GradientPart position="right" {...props} />
    </>
  );
};

Root.displayName = 'ScrollArea';
Viewport.displayName = 'ScrollArea.Viewport';
Content.displayName = 'ScrollArea.Content';
Scrollbar.displayName = 'ScrollArea.Scrollbar';
Thumb.displayName = 'ScrollArea.Thumb';
Corner.displayName = 'ScrollArea.Corner';
Gradient.displayName = 'ScrollArea.Gradient';

export const ScrollArea: typeof Root & {
  Viewport: typeof Viewport;
  Content: typeof Content;
  Scrollbar: typeof Scrollbar;
  Thumb: typeof Thumb;
  Corner: typeof Corner;
  Gradient: typeof Gradient;
  GradientPart: typeof GradientPart;
} = Object.assign(Root, {
  Viewport,
  Content,
  Scrollbar,
  Thumb,
  Corner,
  Gradient,
  GradientPart
});
