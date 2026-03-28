import { Flex } from '@buckethub/styled-system/jsx';
import { Field, Item, Select, Text } from '@buckethub/ui';
import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '../contexts';
import { FieldError } from '../field-error';

interface SelectItem {
  value: string;
  label: string;
  description?: string;
  icon?: React.FunctionComponent;
}

export interface SelectFieldProps {
  items: SelectItem[];
  label: string;
  placeholder?: string;
}

export const SelectField: React.FunctionComponent<SelectFieldProps> = ({
  items,
  label,
  placeholder
}) => {
  const field = useFieldContext();
  const error = useStore(field.store, (state) => state.meta.errors.length > 0);

  return (
    <Field>
      <Select
        itemToStringValue={(item: SelectItem) => item.value}
        itemToStringLabel={(item: SelectItem) => item.label}
        onValueChange={(value) => field.handleChange(value?.value)}
      >
        <Select.Label>{label}</Select.Label>

        <Select.Trigger variant={error ? 'error' : 'default'} onBlur={() => field.handleBlur()}>
          <Select.Value>
            {(item: SelectItem | null) =>
              item ? (
                <Flex css={{ alignItems: 'center', gap: '2' }}>
                  {item.icon && <item.icon />}
                  <Text>{item.label}</Text>
                </Flex>
              ) : (
                <Text color="placeholder">{placeholder}</Text>
              )
            }
          </Select.Value>
        </Select.Trigger>

        <Select.Content>
          {items.map((item) => (
            <Select.Item key={item.value} value={item}>
              <Item css={{ padding: '0' }}>
                {item.icon && <Item.Media>{<item.icon />}</Item.Media>}

                <Item.Content>
                  <Item.Title>
                    <Select.ItemText>{item.label}</Select.ItemText>
                  </Item.Title>

                  {item.description && <Item.Description>{item.description}</Item.Description>}
                </Item.Content>
              </Item>
            </Select.Item>
          ))}
        </Select.Content>
      </Select>

      <FieldError />
    </Field>
  );
};
