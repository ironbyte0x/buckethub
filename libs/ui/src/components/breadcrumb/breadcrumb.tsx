import { createContext, useContext } from 'react';
import { MoreHorizontalIcon } from 'lucide-react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { Box } from '@buckethub/styled-system/jsx';
import { Icon } from '../icon';
import {
  linkRecipe,
  StyledBreadcrumb,
  StyledBreadcrumbEllipsis,
  StyledBreadcrumbItem,
  StyledBreadcrumbLink,
  StyledBreadcrumbList,
  StyledBreadcrumbPage,
  StyledBreadcrumbSeparator
} from './breadcrumb.styled';

type Size = 'sm' | 'md';

interface ContextValue {
  size: Size;
}

const Context = createContext<ContextValue>({ size: 'md' });

function useBreadcrumbContext() {
  return useContext(Context);
}

interface BreadcrumbProps {
  size?: Size;
  children: React.ReactNode;
}

const Root: React.FunctionComponent<BreadcrumbProps> = ({ children }) => {
  return (
    <StyledBreadcrumb aria-label="breadcrumb">
      <Context value={{ size: 'md' }}>{children}</Context>
    </StyledBreadcrumb>
  );
};

interface BreadcrumbListProps {
  children: React.ReactNode;
}

const List: React.FunctionComponent<BreadcrumbListProps> = ({ children }) => {
  const { size } = useBreadcrumbContext();

  return <StyledBreadcrumbList size={size}>{children}</StyledBreadcrumbList>;
};

interface BreadcrumbItemProps {
  children: React.ReactNode;
}

const Item: React.FunctionComponent<BreadcrumbItemProps> = ({ children }) => {
  const { size } = useBreadcrumbContext();

  return <StyledBreadcrumbItem size={size}>{children}</StyledBreadcrumbItem>;
};

type BreadcrumbLinkProps = useRender.ComponentProps<'a'>;

const Link: React.FunctionComponent<BreadcrumbLinkProps> = ({
  render,
  children,
  className,
  ...props
}) => {
  const { size } = useBreadcrumbContext();

  const combinedClassName = [linkRecipe({ size }), className].filter(Boolean).join(' ');

  const element = useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps(
      {
        className: combinedClassName
      },
      props
    )
  });

  if (!render) {
    return <StyledBreadcrumbLink {...props}>{children}</StyledBreadcrumbLink>;
  }

  return element;
};

interface BreadcrumbPageProps {
  children: React.ReactNode;
}

const Page: React.FunctionComponent<BreadcrumbPageProps> = ({ children }) => {
  const { size } = useBreadcrumbContext();

  return (
    <StyledBreadcrumbPage role="link" aria-disabled="true" aria-current="page" size={size}>
      {children}
    </StyledBreadcrumbPage>
  );
};

interface BreadcrumbSeparatorProps {
  children?: React.ReactNode;
}

const Separator: React.FunctionComponent<BreadcrumbSeparatorProps> = ({ children }) => {
  const { size } = useBreadcrumbContext();

  return (
    <StyledBreadcrumbSeparator role="presentation" aria-hidden="true" size={size}>
      {children ?? '/'}
    </StyledBreadcrumbSeparator>
  );
};

const Ellipsis: React.FunctionComponent = () => {
  return (
    <StyledBreadcrumbEllipsis role="presentation" aria-hidden="true">
      <Icon as={MoreHorizontalIcon} />

      <Box
        css={{
          srOnly: true
        }}
      >
        More
      </Box>
    </StyledBreadcrumbEllipsis>
  );
};

Root.displayName = 'Breadcrumb';
List.displayName = 'Breadcrumb.List';
Item.displayName = 'Breadcrumb.Item';
Link.displayName = 'Breadcrumb.Link';
Page.displayName = 'Breadcrumb.Page';
Separator.displayName = 'Breadcrumb.Separator';
Ellipsis.displayName = 'Breadcrumb.Ellipsis';

export const Breadcrumb = Object.assign(Root, {
  List,
  Item,
  Link,
  Page,
  Separator,
  Ellipsis
});
