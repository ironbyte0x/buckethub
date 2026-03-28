import { useState } from 'react';
import { PlusIcon, XIcon } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../badge';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { Combobox } from './combobox';

const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof meta>;

interface Fruite {
  id: number;
  name: string;
}

const fruits: Fruite[] = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Orange' },
  { id: 4, name: 'Grape' },
  { id: 5, name: 'Mango' },
  { id: 6, name: 'Pineapple' },
  { id: 7, name: 'Strawberry' },
  { id: 8, name: 'Watermelon' }
];

export const SingleSelect: Story = {
  render: () => (
    <Combobox
      items={fruits}
      defaultValue={fruits[0]}
      itemToStringLabel={(value: Fruite) => value.name}
    >
      <Combobox.Trigger>
        <Combobox.TriggerContainer>
          <Combobox.Value>
            {(value: Fruite | null) => value?.name ?? 'Select a fruit...'}
          </Combobox.Value>
        </Combobox.TriggerContainer>
      </Combobox.Trigger>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4}>
          <Combobox.Popup>
            <Combobox.Input placeholder="Search fruits..." variant="popup" />
            <Combobox.Empty>No fruits found.</Combobox.Empty>
            <Combobox.List>
              {(item: Fruite) => (
                <Combobox.Item key={item.id} value={item}>
                  {item.name}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox>
  )
};

export const WithPlaceholder: Story = {
  render: () => (
    <Combobox items={fruits}>
      <Combobox.Trigger>
        <Combobox.TriggerContainer>
          <Combobox.Value>
            {(value: Fruite | null) => value?.name ?? 'Select a fruit...'}
          </Combobox.Value>
        </Combobox.TriggerContainer>
      </Combobox.Trigger>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4}>
          <Combobox.Popup>
            <Combobox.Input placeholder="Search fruits..." variant="popup" />
            <Combobox.Empty>No fruits found.</Combobox.Empty>
            <Combobox.List>
              {(item: Fruite) => (
                <Combobox.Item key={item.id} value={item}>
                  {item.name}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox>
  )
};

export const MultipleSelect: Story = {
  render: function MultipleSelectStory() {
    const [value, setValue] = useState<Fruite[]>([]);

    return (
      <Combobox
        items={fruits}
        multiple
        value={value}
        isItemEqualToValue={(item, selected) => item.id === selected.id}
        onValueChange={setValue}
      >
        <Combobox.Trigger>
          <Combobox.TriggerContainer css={{ minWidth: '200px' }}>
            <Combobox.Value>
              {(items: Fruite[]) =>
                items.length > 0 ? items.map((item) => item.name).join(', ') : 'Select fruits...'
              }
            </Combobox.Value>
          </Combobox.TriggerContainer>
        </Combobox.Trigger>

        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4}>
            <Combobox.Popup>
              <Combobox.Input placeholder="Search fruits..." variant="popup" />
              <Combobox.Empty>No fruits found.</Combobox.Empty>
              <Combobox.List>
                {(item: Fruite) => (
                  <Combobox.Item key={item.id} value={item}>
                    {item.name}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox>
    );
  }
};

export const MultipleSelectWithChips: Story = {
  render: function MultipleSelectWithChipsStory() {
    const [value, setValue] = useState<Fruite[]>([fruits[0]]);

    return (
      <Combobox
        items={fruits}
        multiple
        value={value}
        isItemEqualToValue={(item, selected) => item.id === selected.id}
        onValueChange={setValue}
      >
        <Combobox.TriggerContainer>
          <Combobox.Chips>
            <Combobox.Value>
              {(items: Fruite[]) => (
                <>
                  {items.map((item) => (
                    <Combobox.Chip key={item.id} aria-label={item.name}>
                      <Badge size="sm" variant="secondary">
                        {item.name}
                        <Combobox.ChipRemove
                          aria-label="Remove"
                          render={
                            <IconButton
                              type="button"
                              variant="ghost"
                              css={{
                                width: '4',
                                height: '4',
                                padding: 'unset !important',
                                marginRight: '-1'
                              }}
                            >
                              <Icon as={XIcon} size="xs" />
                            </IconButton>
                          }
                        />
                      </Badge>
                    </Combobox.Chip>
                  ))}

                  <Combobox.Input placeholder={value.length === 0 ? 'Search fruits...' : ''} />
                </>
              )}
            </Combobox.Value>
          </Combobox.Chips>
        </Combobox.TriggerContainer>

        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4}>
            <Combobox.Popup>
              <Combobox.Empty>No fruits found.</Combobox.Empty>
              <Combobox.List>
                {(item: Fruite) => (
                  <Combobox.Item key={item.id} value={item}>
                    {item.name}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox>
    );
  }
};

export const TagsInputPattern: Story = {
  render: function TagsInputStory() {
    const [value, setValue] = useState<Fruite[]>([fruits[0]]);

    return (
      <Combobox
        items={fruits}
        multiple
        value={value}
        isItemEqualToValue={(item, selected) => item.id === selected.id}
        onValueChange={setValue}
      >
        <Combobox.Chips css={{ gap: '1', flexWrap: 'wrap' }}>
          <Combobox.Value>
            {(tags: Fruite[]) => (
              <>
                {tags.map((tag) => (
                  <Combobox.Chip key={tag.id} aria-label={tag.name}>
                    <Badge size="md" aria-label={tag.name} variant="secondary">
                      {tag.name}
                      <Combobox.ChipRemove
                        aria-label="Remove"
                        render={
                          <IconButton
                            type="button"
                            variant="ghost"
                            css={{
                              width: '4',
                              height: '4',
                              padding: 'unset !important',
                              marginRight: '-1'
                            }}
                          >
                            <Icon as={XIcon} size="xs" />
                          </IconButton>
                        }
                      />
                    </Badge>
                  </Combobox.Chip>
                ))}
              </>
            )}
          </Combobox.Value>

          <Combobox.Trigger>
            <Badge variant="secondary" size="md" css={{ cursor: 'pointer' }}>
              <Icon as={PlusIcon} size="sm" css={{ marginRight: '0.5' }} />
              Add tag
            </Badge>
          </Combobox.Trigger>
        </Combobox.Chips>

        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4}>
            <Combobox.Popup>
              <Combobox.Input placeholder="Search tags..." variant="popup" />
              <Combobox.Empty>No tags found.</Combobox.Empty>
              <Combobox.List>
                {(item: Fruite) => (
                  <Combobox.Item key={item.id} value={item}>
                    {item.name}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox>
    );
  }
};

interface CreatableItem {
  id: number;
  name: string;
  creatable?: string;
}

export const CreatablePattern: Story = {
  render: function CreatableStory() {
    const [items, setItems] = useState<CreatableItem[]>(fruits);
    const [value, setValue] = useState<CreatableItem[]>([]);
    const [query, setQuery] = useState('');

    const itemsForView: CreatableItem[] = (() => {
      const trimmed = query.trim();
      const lowered = trimmed.toLowerCase();
      const exactExists = items.some((item) => item.name.trim().toLowerCase() === lowered);

      return trimmed !== '' && !exactExists
        ? [
            ...items,
            {
              creatable: trimmed,
              id: Number.MAX_SAFE_INTEGER,
              name: `Create "${trimmed}"`
            }
          ]
        : items;
    })();

    function onValueChange(newValue: CreatableItem[]) {
      const creatableItem = newValue.find((item) => item.creatable);

      if (creatableItem && creatableItem.creatable) {
        const newItem = {
          id: items.length + 1,
          name: creatableItem.creatable
        };

        setItems([...items, newItem]);
        setValue([...value.filter((v) => !v.creatable), newItem]);
      } else {
        setValue(newValue);
      }

      setQuery('');
    }

    return (
      <Combobox
        items={itemsForView}
        multiple
        value={value}
        inputValue={query}
        isItemEqualToValue={(item, selected) => item.id === selected.id}
        onInputValueChange={setQuery}
        onValueChange={onValueChange}
      >
        <Combobox.Chips css={{ gap: '1', flexWrap: 'wrap' }}>
          <Combobox.Value>
            {(tags: CreatableItem[]) => (
              <>
                {tags.map((tag) => (
                  <Combobox.Chip key={tag.id} aria-label={tag.name}>
                    <Badge size="md" aria-label={tag.name} variant="secondary">
                      {tag.name}
                      <Combobox.ChipRemove
                        aria-label="Remove"
                        render={
                          <IconButton
                            type="button"
                            variant="ghost"
                            css={{
                              width: '4',
                              height: '4',
                              padding: 'unset !important',
                              marginRight: '-1'
                            }}
                          >
                            <Icon as={XIcon} size="xs" />
                          </IconButton>
                        }
                      />
                    </Badge>
                  </Combobox.Chip>
                ))}
              </>
            )}
          </Combobox.Value>

          <Combobox.Trigger>
            <Badge variant="secondary" size="md" css={{ cursor: 'pointer' }}>
              <Icon as={PlusIcon} size="sm" css={{ marginRight: '0.5' }} />
              Add tag
            </Badge>
          </Combobox.Trigger>
        </Combobox.Chips>

        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4}>
            <Combobox.Popup>
              <Combobox.Input placeholder="Search or create..." variant="popup" />
              <Combobox.Empty>
                No items found. <br />
                Type to create a new item.
              </Combobox.Empty>
              <Combobox.List>
                {(item: CreatableItem) =>
                  item.creatable ? (
                    <Combobox.Item key={item.id} value={item} showIndicator={false}>
                      <Icon as={PlusIcon} size="sm" />
                      <Combobox.ItemText>{item.name}</Combobox.ItemText>
                    </Combobox.Item>
                  ) : (
                    <Combobox.Item key={item.id} value={item}>
                      {item.name}
                    </Combobox.Item>
                  )
                }
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox>
    );
  }
};

export const WithLabel: Story = {
  render: () => (
    <Combobox
      items={fruits}
      defaultValue={fruits[0]}
      itemToStringLabel={(value: Fruite) => value.name}
    >
      <Combobox.Label>Favorite Fruit</Combobox.Label>
      <Combobox.Trigger>
        <Combobox.TriggerContainer>
          <Combobox.Value>
            {(value: Fruite | null) => value?.name ?? 'Select a fruit...'}
          </Combobox.Value>
        </Combobox.TriggerContainer>
      </Combobox.Trigger>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4}>
          <Combobox.Popup>
            <Combobox.Input placeholder="Search fruits..." variant="popup" />
            <Combobox.Empty>No fruits found.</Combobox.Empty>
            <Combobox.List>
              {(item: Fruite) => (
                <Combobox.Item key={item.id} value={item}>
                  {item.name}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox>
  )
};

export const WithInputGroup: Story = {
  render: () => (
    <Combobox items={fruits} itemToStringLabel={(value: Fruite) => value.name}>
      <Combobox.Label>Search Fruit</Combobox.Label>
      <Combobox.InputGroup>
        <Combobox.Input placeholder="Search fruits..." css={{ width: '250px' }} />
      </Combobox.InputGroup>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4}>
          <Combobox.Popup>
            <Combobox.Empty>No fruits found.</Combobox.Empty>
            <Combobox.List>
              {(item: Fruite) => (
                <Combobox.Item key={item.id} value={item}>
                  {item.name}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox>
  )
};

const groupedItems = [
  {
    group: 'fruits',
    items: [
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Banana' },
      { id: 3, name: 'Orange' }
    ]
  },
  {
    group: 'vegetables',
    items: [
      { id: 4, name: 'Carrot' },
      { id: 5, name: 'Broccoli' },
      { id: 6, name: 'Spinach' }
    ]
  }
];

export const WithGroups: Story = {
  render: () => (
    <Combobox items={groupedItems}>
      <Combobox.Trigger>
        <Combobox.TriggerContainer>
          <Combobox.Value>
            {(value: (typeof groupedItems)[0]['items'][0] | null) =>
              value?.name ?? 'Select produce...'
            }
          </Combobox.Value>
        </Combobox.TriggerContainer>
      </Combobox.Trigger>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4}>
          <Combobox.Popup>
            <Combobox.Input placeholder="Search produce..." variant="popup" />
            <Combobox.Empty>No produce found.</Combobox.Empty>
            <Combobox.List>
              {(group: (typeof groupedItems)[0]) => (
                <Combobox.Group key={group.group} items={group.items}>
                  <Combobox.GroupLabel>
                    {group.group.charAt(0).toUpperCase() + group.group.slice(1)}
                  </Combobox.GroupLabel>
                  {group.items.map((item) => (
                    <Combobox.Item key={item.id} value={item}>
                      {item.name}
                    </Combobox.Item>
                  ))}
                </Combobox.Group>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox>
  )
};

export const Disabled: Story = {
  render: () => (
    <Combobox items={fruits} disabled>
      <Combobox.Trigger>
        <Combobox.TriggerContainer>
          <Combobox.Value>
            {(value: Fruite | null) => value?.name ?? 'Select a fruit...'}
          </Combobox.Value>
        </Combobox.TriggerContainer>
      </Combobox.Trigger>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4}>
          <Combobox.Popup>
            <Combobox.Input placeholder="Search fruits..." variant="popup" />
            <Combobox.List>
              {(item: Fruite) => (
                <Combobox.Item key={item.id} value={item}>
                  {item.name}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox>
  )
};

export const WithError: Story = {
  render: () => (
    <Combobox items={fruits}>
      <Combobox.Trigger>
        <Combobox.TriggerContainer error>
          <Combobox.Value>
            {(value: Fruite | null) => value?.name ?? 'Select a fruit...'}
          </Combobox.Value>
        </Combobox.TriggerContainer>
      </Combobox.Trigger>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4}>
          <Combobox.Popup>
            <Combobox.Input placeholder="Search fruits..." variant="popup" />
            <Combobox.Empty>No fruits found.</Combobox.Empty>
            <Combobox.List>
              {(item: Fruite) => (
                <Combobox.Item key={item.id} value={item}>
                  {item.name}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox>
  )
};

export const InlineInput: Story = {
  render: () => (
    <Combobox items={fruits} itemToStringLabel={(value: Fruite) => value.name}>
      <Combobox.TriggerContainer>
        <Combobox.Input placeholder="Search fruits..." css={{ width: '250px' }} />
      </Combobox.TriggerContainer>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4}>
          <Combobox.Popup>
            <Combobox.Empty>No fruits found.</Combobox.Empty>
            <Combobox.List>
              {(item: Fruite) => (
                <Combobox.Item key={item.id} value={item}>
                  {item.name}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox>
  )
};
