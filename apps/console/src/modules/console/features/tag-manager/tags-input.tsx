import { useMemo, useRef, useState } from 'react';
import { PlusIcon, XIcon } from 'lucide-react';
import { Tag } from '@buckethub/rpc-contract';
import { Badge, Combobox, Icon, IconButton } from '@buckethub/ui';
import { generateTagId } from '@/services/tags';

interface ViewTag extends Tag {
  creatable?: string;
}

interface TagsInputProps {
  items: Tag[];
  value: Tag[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (tags: Tag[]) => void;
  onCreate: (tagName: string) => void;
}

export const TagsInput: React.FunctionComponent<TagsInputProps> = ({
  items,
  value,
  placeholder = 'Search tags...',
  disabled = false,
  onChange,
  onCreate: onCreateProp
}) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const comboboxInputRef = useRef<HTMLInputElement | null>(null);
  const highlightedItemRef = useRef<Tag | undefined>(undefined);

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter' || highlightedItemRef.current) {
      return;
    }

    const currentTrimmed = query.trim();

    if (currentTrimmed === '') {
      return;
    }

    const normalized = currentTrimmed.toLowerCase();
    const existing = items.find((tag) => tag.name.trim().toLowerCase() === normalized);

    if (existing) {
      if (!value.some((v) => v.name === existing.name)) {
        onChange([...value, existing]);
      }

      setQuery('');
    } else {
      onCreateProp(currentTrimmed);
    }
  }

  const itemsForView: Array<ViewTag> = useMemo(() => {
    const trimmed = query.trim();
    const lowered = trimmed.toLocaleLowerCase();
    const exactExists = items.some((tag) => tag.name.trim().toLocaleLowerCase() === lowered);

    return trimmed !== '' && !exactExists
      ? [
          ...items,
          {
            id: generateTagId(),
            name: `Create "${trimmed}"`,
            creatable: trimmed,
            createdAt: new Date()
          }
        ]
      : items;
  }, [items, query]);

  function onValueChange(newValue: ViewTag[]) {
    const creatableItem = newValue.find((item) => item.creatable);

    if (creatableItem?.creatable) {
      onCreateProp(creatableItem.creatable);
      setQuery('');
      setOpen(false);

      return;
    }

    onChange(newValue);
  }

  return (
    <Combobox
      items={itemsForView}
      multiple
      value={value}
      inputValue={query}
      disabled={disabled}
      open={open}
      isItemEqualToValue={(item: Tag, selected: Tag) => item.id === selected.id}
      onOpenChange={setOpen}
      onInputValueChange={setQuery}
      onItemHighlighted={(item: Tag | undefined) => {
        highlightedItemRef.current = item;
      }}
      onValueChange={onValueChange}
    >
      <Combobox.Chips css={{ gap: '1', flexWrap: 'wrap', alignItems: 'center' }}>
        <Combobox.Value>
          {(tags: Tag[]) =>
            tags.map((tag) => (
              <Combobox.Chip key={tag.id} aria-label={tag.name}>
                <Badge key={tag.id} size="md" aria-label={tag.name} variant="secondary">
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
                        disabled={disabled}
                      >
                        <Icon as={XIcon} size="xs" />
                      </IconButton>
                    }
                  />
                </Badge>
              </Combobox.Chip>
            ))
          }
        </Combobox.Value>

        <Combobox.Trigger ref={triggerRef}>
          <Badge
            variant="secondary"
            size="md"
            css={{
              transition: 'border-color 0.15s ease',
              cursor: 'pointer',

              '&:hover': {
                borderColor: 'border-input-focus'
              }
            }}
          >
            <Icon as={PlusIcon} size="sm" css={{ marginRight: '0.5' }} />
            Add tag
          </Badge>
        </Combobox.Trigger>
      </Combobox.Chips>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4} anchor={triggerRef}>
          <Combobox.Popup>
            <Combobox.Input
              ref={comboboxInputRef}
              placeholder={placeholder}
              variant="popup"
              onKeyDown={onInputKeyDown}
            />

            <Combobox.Empty>
              No tags found. <br />
              Type to create a new tag.
            </Combobox.Empty>

            <Combobox.List>
              {(item: ViewTag) =>
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
};
