import { useEffect, useRef, useState } from 'react';
import { useRender } from '@base-ui/react/use-render';
import { Separator } from '../separator';
import {
  StyledItem,
  StyledItemActions,
  StyledItemContent,
  StyledItemDescription,
  StyledItemFooter,
  StyledItemGroup,
  StyledItemHeader,
  StyledItemMedia,
  StyledItemTitle
} from './item.styled';

const Group: React.FunctionComponent<React.ComponentProps<typeof StyledItemGroup>> = ({
  children,
  ...props
}) => {
  return (
    <StyledItemGroup role="list" data-slot="item-group" {...props}>
      {children}
    </StyledItemGroup>
  );
};

const ItemSeparator: React.FunctionComponent<React.ComponentProps<typeof Separator>> = (props) => {
  return <Separator orientation="horizontal" {...props} />;
};

const Root: React.FunctionComponent<useRender.ComponentProps<typeof StyledItem>> = ({
  variant,
  size,
  render,
  ...props
}) => {
  const element = useRender({
    defaultTagName: 'div',
    render,
    props: {
      ...props,
      'data-slot': 'item',
      'data-variant': variant,
      'data-size': size
    }
  });

  if (!render) {
    return (
      <StyledItem
        variant={variant}
        size={size}
        data-slot="item"
        data-variant={variant}
        data-size={size}
        {...props}
      />
    );
  }

  return element;
};

const Media: React.FunctionComponent<React.ComponentProps<typeof StyledItemMedia>> = ({
  children,
  variant = 'default',
  ...props
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [hasDescription, setHasDescription] = useState(false);

  useEffect(() => {
    if (itemRef.current) {
      const item = itemRef.current.closest('[data-slot="item"]');
      const hasDesc = item?.querySelector('[data-slot="item-description"]');

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasDescription(!!hasDesc);
    }
  }, [children]);

  return (
    <StyledItemMedia
      ref={itemRef}
      data-slot="item-media"
      data-variant={variant}
      data-has-description={hasDescription}
      variant={variant}
      {...props}
    >
      {children}
    </StyledItemMedia>
  );
};

const Content: React.FunctionComponent<React.ComponentProps<typeof StyledItemContent>> = ({
  children,
  ...props
}) => {
  return (
    <StyledItemContent data-slot="item-content" {...props}>
      {children}
    </StyledItemContent>
  );
};

const Title: React.FunctionComponent<React.ComponentProps<typeof StyledItemTitle>> = ({
  children,
  ...props
}) => {
  return (
    <StyledItemTitle data-slot="item-title" {...props}>
      {children}
    </StyledItemTitle>
  );
};

const Description: React.FunctionComponent<React.ComponentProps<typeof StyledItemDescription>> = ({
  children,
  style,
  ...props
}) => {
  return (
    <StyledItemDescription
      data-slot="item-description"
      style={{ WebkitBoxOrient: 'vertical', ...style } as React.CSSProperties}
      {...props}
    >
      {children}
    </StyledItemDescription>
  );
};

const Actions: React.FunctionComponent<React.ComponentProps<typeof StyledItemActions>> = ({
  children,
  ...props
}) => {
  return (
    <StyledItemActions data-slot="item-actions" {...props}>
      {children}
    </StyledItemActions>
  );
};

const Header: React.FunctionComponent<React.ComponentProps<typeof StyledItemHeader>> = ({
  children,
  ...props
}) => {
  return (
    <StyledItemHeader data-slot="item-header" {...props}>
      {children}
    </StyledItemHeader>
  );
};

const Footer: React.FunctionComponent<React.ComponentProps<typeof StyledItemFooter>> = ({
  children,
  ...props
}) => {
  return (
    <StyledItemFooter data-slot="item-footer" {...props}>
      {children}
    </StyledItemFooter>
  );
};

Root.displayName = 'Item';
Group.displayName = 'Item.Group';
Media.displayName = 'Item.Media';
Content.displayName = 'Item.Content';
Title.displayName = 'Item.Title';
Description.displayName = 'Item.Description';
Actions.displayName = 'Item.Actions';
Header.displayName = 'Item.Header';
Footer.displayName = 'Item.Footer';

export const Item: typeof Root & {
  Group: typeof Group;
  Separator: typeof ItemSeparator;
  Media: typeof Media;
  Content: typeof Content;
  Title: typeof Title;
  Description: typeof Description;
  Actions: typeof Actions;
  Header: typeof Header;
  Footer: typeof Footer;
} = Object.assign(Root, {
  Group,
  Separator: ItemSeparator,
  Media,
  Content,
  Title,
  Description,
  Actions,
  Header,
  Footer
});
