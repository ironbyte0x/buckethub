import { AnimatePresence } from 'motion/react';
import type { ComponentProps } from '@buckethub/styled-system/types';
import {
  StyledFieldDescription,
  StyledFieldError,
  StyledFieldLabel,
  StyledFieldRoot
} from './field.styled';

export interface FieldProps extends ComponentProps<typeof StyledFieldRoot> {
  children: React.ReactNode;
}

const Root: React.FunctionComponent<FieldProps> = ({ children, ...props }) => {
  return <StyledFieldRoot {...props}>{children}</StyledFieldRoot>;
};

export interface FieldLabelProps extends ComponentProps<typeof StyledFieldLabel> {
  children: React.ReactNode;
  htmlFor?: string;
}

const Label: React.FunctionComponent<FieldLabelProps> = ({ children, ...props }) => {
  return <StyledFieldLabel {...props}>{children}</StyledFieldLabel>;
};

export interface FieldDescriptionProps extends ComponentProps<typeof StyledFieldDescription> {
  children: React.ReactNode;
}

const Description: React.FunctionComponent<FieldDescriptionProps> = ({ children, ...props }) => {
  return (
    <StyledFieldDescription data-slot="field-description" {...props}>
      {children}
    </StyledFieldDescription>
  );
};

export interface FieldErrorProps extends ComponentProps<typeof StyledFieldError> {
  children: React.ReactNode;
}

const Error: React.FunctionComponent<FieldErrorProps> = ({ children, ...props }) => {
  return (
    <AnimatePresence>
      {children && (
        <StyledFieldError
          data-slot="field-error"
          initial={{
            opacity: 0,
            height: 0,
            marginTop: '0px'
          }}
          animate={{
            opacity: 1,
            height: 'auto',
            marginTop: 'var(--spacing-1)'
          }}
          exit={{
            opacity: 0,
            height: 0,
            marginTop: '0px'
          }}
          transition={{
            type: 'keyframes',
            ease: 'easeOut',
            duration: 0.2
          }}
          {...props}
        >
          {children}
        </StyledFieldError>
      )}
    </AnimatePresence>
  );
};

Root.displayName = 'Field';
Label.displayName = 'Field.Label';
Description.displayName = 'Field.Description';
Error.displayName = 'Field.Error';

export const Field = Object.assign(Root, {
  Label,
  Description,
  Error
});
