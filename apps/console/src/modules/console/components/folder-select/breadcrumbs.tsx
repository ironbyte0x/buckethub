import { Fragment } from 'react/jsx-runtime';
import { FolderIcon, HomeIcon } from 'lucide-react';
import { Breadcrumb, Icon, IconButton, Menu } from '@buckethub/ui';

interface FolderBreadcrumbsProps {
  items: string[];
  onSelect: (path: number) => void;
}

const MAX_VISIBLE_ITEMS = 3;

export const FolderBreadcrumbs: React.FunctionComponent<FolderBreadcrumbsProps> = ({
  items,
  onSelect
}) => {
  const shouldTruncate = items.length > MAX_VISIBLE_ITEMS;

  return (
    <Breadcrumb size="sm">
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link
            render={(props) => (
              <button {...props} type="button" onClick={() => onSelect(-1)}>
                <Icon as={HomeIcon} size="sm" />
                root
              </button>
            )}
          />
        </Breadcrumb.Item>

        {shouldTruncate ? (
          <>
            <Breadcrumb.Separator />

            <Breadcrumb.Item>
              <Menu>
                <Menu.Trigger
                  render={(props) => (
                    <IconButton {...props} size="2xs" variant="ghost" css={{ marginBlock: '-0.5' }}>
                      <Breadcrumb.Ellipsis />
                    </IconButton>
                  )}
                />

                <Menu.Content align="start">
                  {items.slice(0, -1).map((part, index) => (
                    <Menu.Item key={`breadcrumb-menu-${index}`} onClick={() => onSelect(index)}>
                      <Icon as={FolderIcon} size="sm" />
                      {part}
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu>
            </Breadcrumb.Item>

            <Breadcrumb.Separator />

            <Breadcrumb.Item>
              <Breadcrumb.Page>
                <Icon as={FolderIcon} size="sm" />
                {items[items.length - 1]}
              </Breadcrumb.Page>
            </Breadcrumb.Item>
          </>
        ) : (
          items.map((part, index) => {
            const isLast = index === items.length - 1;

            return (
              <Fragment key={`breadcrumb-${index}`}>
                <Breadcrumb.Separator />

                <Breadcrumb.Item>
                  {isLast ? (
                    <Breadcrumb.Page>
                      <Icon as={FolderIcon} size="sm" />
                      {part}
                    </Breadcrumb.Page>
                  ) : (
                    <Breadcrumb.Link
                      render={(props) => (
                        <button {...props} type="button" onClick={() => onSelect(index)}>
                          <Icon as={FolderIcon} size="sm" />
                          {part}
                        </button>
                      )}
                    />
                  )}
                </Breadcrumb.Item>
              </Fragment>
            );
          })
        )}
      </Breadcrumb.List>
    </Breadcrumb>
  );
};
