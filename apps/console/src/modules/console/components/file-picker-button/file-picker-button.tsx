import { useId } from 'react';
import { Button } from '@buckethub/ui';

interface FilePickerButtonProps
  extends
    Pick<
      React.ComponentProps<typeof Button>,
      'variant' | 'css' | 'disabled' | 'loading' | 'size' | 'children'
    >,
    Pick<React.ComponentProps<'input'>, 'accept' | 'multiple' | 'onChange'> {}

export const FilePickerButton: React.FunctionComponent<FilePickerButtonProps> = ({
  variant,
  css,
  accept,
  multiple,
  size,
  children,
  disabled,
  onChange
}) => {
  const id = useId();

  return (
    <>
      <Button
        as="label"
        role="button"
        htmlFor={id}
        variant={variant}
        size={size}
        disabled={disabled}
        css={css}
        style={disabled ? { pointerEvents: 'none', opacity: 0.5 } : {}}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
          }
        }}
      >
        {children}
      </Button>

      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        style={{
          display: 'none'
        }}
        onChange={(event) => {
          onChange?.(event);

          event.target.value = '';
        }}
      />
    </>
  );
};
