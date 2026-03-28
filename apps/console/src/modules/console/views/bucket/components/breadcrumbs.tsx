import { Fragment } from 'react';
import { FolderIcon } from 'lucide-react';
import { Flex } from '@buckethub/styled-system/jsx';
import { Breadcrumb, CopyIconButton, Icon, IconButton, Menu } from '@buckethub/ui';
import { Link, useNavigate } from '@tanstack/react-router';
import { useBucket } from '@/services/buckets';
import { getIsFileKey, getKeyParts } from '@/shared/lib';
import { useNavigationData } from '../use-navigation-data';

const MAX_VISIBLE_ITEMS = 5;

export const Breadcrumbs: React.FunctionComponent = () => {
  const { bucketId, key } = useNavigationData();
  const { data: bucket } = useBucket({ id: bucketId });
  const navigate = useNavigate();

  const isFile = getIsFileKey(key);
  const keyParts = getKeyParts(key);
  const shouldTruncate = keyParts.length > MAX_VISIBLE_ITEMS;

  return (
    <Flex
      css={{
        paddingInline: 'var(--view-inline-padding)',
        paddingBlock: '4',
        gap: '1.5',
        alignItems: 'center'
      }}
    >
      <Breadcrumb>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link
              render={(props) => (
                <Link
                  {...props}
                  to="/buckets/$bucketId/{-$key}"
                  params={{ bucketId, key: undefined }}
                >
                  {bucket.name}
                </Link>
              )}
            />
          </Breadcrumb.Item>

          {keyParts.length > 0 && <Breadcrumb.Separator />}

          {shouldTruncate ? (
            <>
              <Breadcrumb.Item>
                <Menu>
                  <Menu.Trigger
                    render={(props) => (
                      <IconButton
                        {...props}
                        size="2xs"
                        variant="ghost"
                        css={{ marginBlock: '-0.5' }}
                      >
                        <Breadcrumb.Ellipsis />
                      </IconButton>
                    )}
                  />

                  <Menu.Content align="start">
                    {keyParts.slice(0, -1).map((part, index) => {
                      const pathToFolder = keyParts.slice(0, index + 1).join('/') + '/';

                      return (
                        <Menu.Item
                          key={part}
                          onClick={() =>
                            navigate({
                              to: '/buckets/$bucketId/{-$key}',
                              params: { bucketId, key: pathToFolder }
                            })
                          }
                        >
                          <Icon as={FolderIcon} size="sm" />
                          {part}
                        </Menu.Item>
                      );
                    })}
                  </Menu.Content>
                </Menu>
              </Breadcrumb.Item>

              <Breadcrumb.Separator />

              <Breadcrumb.Item>
                <Breadcrumb.Page>{keyParts[keyParts.length - 1]}</Breadcrumb.Page>
              </Breadcrumb.Item>
            </>
          ) : (
            keyParts.map((part, index) => {
              const isLastPart = index === keyParts.length - 1;
              const isFilePart = isLastPart && isFile;
              const pathToFolder = keyParts.slice(0, index + 1).join('/') + '/';

              return (
                <Fragment key={part}>
                  <Breadcrumb.Item>
                    {isFilePart || isLastPart ? (
                      <Breadcrumb.Page>{part}</Breadcrumb.Page>
                    ) : (
                      <Breadcrumb.Link
                        render={(props) => (
                          <Link
                            {...props}
                            to="/buckets/$bucketId/{-$key}"
                            params={{
                              bucketId,
                              key: pathToFolder
                            }}
                          >
                            {part}
                          </Link>
                        )}
                      />
                    )}
                  </Breadcrumb.Item>

                  {!isFilePart && !isLastPart && <Breadcrumb.Separator />}
                </Fragment>
              );
            })
          )}
        </Breadcrumb.List>
      </Breadcrumb>

      <CopyIconButton css={{ color: 'text-base' }} content={key ?? ''} />
    </Flex>
  );
};
