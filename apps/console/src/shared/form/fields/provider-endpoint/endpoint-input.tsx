import { useCallback, useEffect, useRef } from 'react';
import { PROVIDERS } from '@/constants';
import {
  StyledEditableInput,
  StyledProviderTag,
  StyledProviderTags
} from './endpoint-input.styled';

interface ProviderEndpointInputProps {
  id?: string;
  ariaLabel?: string;
  value: string;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

function highlightPlaceholders(text: string): string {
  return text.replace(/(\{.*?\})/g, '<mark>$1</mark>');
}

function getCursorOffset(element: HTMLElement): number {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return element.textContent?.length ?? 0;
  }

  const range = selection.getRangeAt(0);
  const preRange = document.createRange();

  preRange.selectNodeContents(element);
  preRange.setEnd(range.startContainer, range.startOffset);

  return preRange.toString().length;
}

function setCursorOffset(element: HTMLElement, offset: number) {
  const selection = window.getSelection();

  if (!selection) {
    return;
  }

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let remaining = offset;

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;

    if (remaining <= node.length) {
      const range = document.createRange();

      range.setStart(node, remaining);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      return;
    }

    remaining -= node.length;
  }

  const range = document.createRange();

  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

export const ProviderEndpointInput: React.FunctionComponent<ProviderEndpointInputProps> = ({
  id,
  ariaLabel,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  placeholder
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const lastValueRef = useRef(value);
  const pendingFocus = useRef<'end' | null>(null);

  const onInput = useCallback(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const text = element.textContent ?? '';
    const offset = getCursorOffset(element);

    lastValueRef.current = text;
    onChange(text);

    element.innerHTML = highlightPlaceholders(text);
    setCursorOffset(element, offset);
  }, [onChange]);

  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }, []);

  const onPaste = useCallback(
    (event: React.ClipboardEvent) => {
      event.preventDefault();

      const element = ref.current;

      if (!element) {
        return;
      }

      const text = event.clipboardData.getData('text/plain').replace(/\n/g, '');
      const selection = window.getSelection();

      if (!selection || selection.rangeCount === 0) {
        return;
      }

      const range = selection.getRangeAt(0);

      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);

      const fullText = element.textContent ?? '';
      const offset = getCursorOffset(element);

      lastValueRef.current = fullText;
      onChange(fullText);

      element.innerHTML = highlightPlaceholders(fullText);
      setCursorOffset(element, offset);
    },
    [onChange]
  );

  const onMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    if (event.detail === 2 && target.tagName === 'MARK') {
      event.preventDefault();

      const selection = window.getSelection();

      if (!selection) {
        return;
      }

      const range = document.createRange();

      range.selectNodeContents(target);
      selection.removeAllRanges();
      selection.addRange(range);

      return;
    }

    const element = ref.current;

    if (!element || !element.childNodes.length) {
      return;
    }

    const contentRange = document.createRange();

    contentRange.selectNodeContents(element);

    const rects = contentRange.getClientRects();

    if (rects.length === 0) {
      return;
    }

    const lastRect = rects[rects.length - 1];

    if (event.clientX > lastRect.right) {
      event.preventDefault();
      element.focus();
      setCursorOffset(element, element.textContent?.length ?? 0);
    }
  }, []);

  const onFocus = useCallback(() => {
    const element = ref.current;

    if (!element || pendingFocus.current !== 'end') {
      return;
    }

    pendingFocus.current = null;
    setCursorOffset(element, element.textContent?.length ?? 0);
  }, []);

  const onProviderTagClick = useCallback(
    (template: string) => {
      const element = ref.current;

      lastValueRef.current = template;

      onChange(template);

      if (element) {
        element.innerHTML = highlightPlaceholders(template);
      }

      pendingFocus.current = 'end';
      ref.current?.focus();
    },
    [onChange]
  );

  useEffect(() => {
    if (!id) {
      return;
    }

    const label = document.querySelector<HTMLLabelElement>(`label[for="${id}"]`);

    if (!label) {
      return;
    }

    const onClick = () => ref.current?.focus();

    label.addEventListener('click', onClick);

    return () => {
      label.removeEventListener('click', onClick);
    };
  }, [id]);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    if (lastValueRef.current !== value) {
      lastValueRef.current = value;
      element.innerHTML = highlightPlaceholders(value);
    }
  }, [value]);

  return (
    <div>
      <StyledEditableInput
        ref={(node) => {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;

          if (node && !node.innerHTML) {
            node.innerHTML = highlightPlaceholders(value);
          }
        }}
        id={id}
        role="textbox"
        contentEditable={!disabled}
        suppressContentEditableWarning
        aria-label={ariaLabel}
        aria-invalid={error || undefined}
        aria-disabled={disabled || undefined}
        data-placeholder={placeholder}
        onInput={onInput}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onMouseDown={onMouseDown}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <StyledProviderTags>
        {PROVIDERS.map(
          (item) =>
            item.endpointTemplate && (
              <StyledProviderTag
                key={item.label}
                type="button"
                onClick={() => onProviderTagClick(item.endpointTemplate)}
              >
                {item.shortLabel}
              </StyledProviderTag>
            )
        )}
      </StyledProviderTags>
    </div>
  );
};

ProviderEndpointInput.displayName = 'EndpointInput';
