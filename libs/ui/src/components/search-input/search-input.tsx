import { SearchIcon, XIcon } from 'lucide-react';
import { SystemStyleObject } from '@buckethub/styled-system/types';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Icon } from '../icon';
import { InputGroup } from '../input-group';

export interface SearchInputProps {
  ref?: React.Ref<HTMLInputElement>;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  css?: SystemStyleObject;
  onChange?: (value: string) => void;
}

export const SearchInput: React.FunctionComponent<SearchInputProps> = ({
  value: valueProp,
  defaultValue: defaultValueProp,
  placeholder = 'Search...',
  css,
  onChange: onChangeProp,
  ...props
}) => {
  const [value, setInternalValue] = useControllableState({
    defaultProp: defaultValueProp ?? '',
    prop: valueProp,
    onChange: onChangeProp
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setInternalValue(newValue);
  };

  const onClear = () => {
    setInternalValue('');
  };

  return (
    <InputGroup css={css}>
      <InputGroup.Addon>
        <Icon as={SearchIcon} />
      </InputGroup.Addon>

      <InputGroup.Input placeholder={placeholder} value={value} onChange={onChange} {...props} />

      {value && (
        <InputGroup.Addon align="inline-end">
          <InputGroup.Button size="xs" css={{ width: '6', borderRadius: 'full' }} onClick={onClear}>
            <Icon as={XIcon} size="xs" />
          </InputGroup.Button>
        </InputGroup.Addon>
      )}
    </InputGroup>
  );
};

SearchInput.displayName = 'SearchInput';
