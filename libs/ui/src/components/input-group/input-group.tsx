import { useCallback, useRef } from 'react';
import type { ComponentProps } from '@buckethub/styled-system/types';
import {
  StyledInputGroup,
  StyledInputGroupAddon,
  StyledInputGroupButton,
  StyledInputGroupInput,
  StyledInputGroupText,
  StyledInputGroupTextarea
} from './input-group.styled';

export interface InputGroupProps extends ComponentProps<typeof StyledInputGroup> {
  children: React.ReactNode;
}

const Root: React.FunctionComponent<InputGroupProps> = ({
  children,
  onClick: onClickProp,
  ...props
}) => {
  const groupRef = useRef<HTMLDivElement>(null);

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;

      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button')
      ) {
        onClickProp?.(event);

        return;
      }

      const input = groupRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        '[data-slot="input-group-control"]'
      );

      if (input) {
        input.focus();
      }

      onClickProp?.(event);
    },
    [onClickProp]
  );

  return (
    <StyledInputGroup
      ref={groupRef}
      role="group"
      data-slot="input-group"
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledInputGroup>
  );
};

export interface InputGroupAddonProps extends ComponentProps<typeof StyledInputGroupAddon> {
  children: React.ReactNode;
  align?: 'inline-start' | 'inline-end' | 'block-start' | 'block-end';
}

const Addon: React.FunctionComponent<InputGroupAddonProps> = ({
  children,
  onClick: onClickProp,
  align = 'inline-start',
  ...props
}) => {
  const onClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).closest('button')) {
        onClickProp?.(event);

        return;
      }

      const input = event.currentTarget.parentElement?.querySelector<
        HTMLInputElement | HTMLTextAreaElement
      >('[data-slot="input-group-control"]');

      if (input) {
        input.focus();
      }

      onClickProp?.(event);
    },
    [onClickProp]
  );

  return (
    <StyledInputGroupAddon
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      align={align}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledInputGroupAddon>
  );
};

export interface InputGroupInputProps extends React.ComponentProps<'input'> {
  error?: boolean;
}

const Input: React.FunctionComponent<InputGroupInputProps> = ({ error, ...props }) => {
  return <StyledInputGroupInput data-slot="input-group-control" aria-invalid={error} {...props} />;
};

export interface InputGroupTextareaProps extends ComponentProps<typeof StyledInputGroupTextarea> {
  ref?: React.Ref<HTMLTextAreaElement>;
}

const Textarea: React.FunctionComponent<InputGroupTextareaProps> = ({ ref, ...props }) => {
  return <StyledInputGroupTextarea ref={ref} data-slot="input-group-control" {...props} />;
};

export interface InputGroupButtonProps extends ComponentProps<typeof StyledInputGroupButton> {
  children: React.ReactNode;
}

const Button: React.FunctionComponent<InputGroupButtonProps> = ({ children, ...props }) => {
  return (
    <StyledInputGroupButton type="button" data-slot="input-group-button" {...props}>
      {children}
    </StyledInputGroupButton>
  );
};

export interface InputGroupTextProps extends ComponentProps<typeof StyledInputGroupText> {
  children: React.ReactNode;
}

const Text: React.FunctionComponent<InputGroupTextProps> = ({ children, ...props }) => {
  return (
    <StyledInputGroupText data-slot="input-group-text" {...props}>
      {children}
    </StyledInputGroupText>
  );
};

Root.displayName = 'InputGroup';
Input.displayName = 'InputGroup.Input';
Textarea.displayName = 'InputGroup.Textarea';
Addon.displayName = 'InputGroup.Addon';
Button.displayName = 'InputGroup.Button';
Text.displayName = 'InputGroup.Text';

export const InputGroup = Object.assign(Root, {
  Addon,
  Input,
  Textarea,
  Button,
  Text
});
