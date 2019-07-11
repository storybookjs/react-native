import React, { FunctionComponent } from 'react';
import { styled, Theme, CSSObject } from '@storybook/theming';

import TextareaAutoResize from 'react-textarea-autosize';

import { Button as StyledButton } from '../../Button/Button';

const styleResets: CSSObject = {
  // resets
  appearance: 'none',
  border: '0',
  boxSizing: 'inherit',
  display: ' block',
  margin: ' 0',
  background: 'transparent',
  padding: 0,
  fontSize: 'inherit',
  position: 'relative',
};

const styles = ({ theme }: { theme: Theme }): CSSObject => ({
  ...styleResets,

  transition: 'all 200ms ease-out',
  color: theme.input.color || 'inherit',
  background: theme.input.background,
  boxShadow: `${theme.input.border} 0 0 0 1px inset`,
  borderRadius: `${theme.input.borderRadius}`,
  fontSize: theme.typography.size.s2 - 1,
  lineHeight: '20px',
  padding: '.42em 1em', // 32

  '&:focus': { boxShadow: `${theme.color.secondary} 0 0 0 1px inset` },
  '&[disabled]': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  '&:-webkit-autofill': { WebkitBoxShadow: `0 0 0 3em ${theme.color.lightest} inset` },

  '::placeholder': {
    color: theme.color.mediumdark,
  },
});

type Sizes = '100%' | 'flex' | 'auto';
type Alignments = 'end' | 'center' | 'start';
type ValidationStates = 'valid' | 'error' | 'warn';

export interface InputStyleProps {
  size?: Sizes;
  align?: Alignments;
  validation?: ValidationStates;
}

const sizes = ({ size }: { size?: Sizes }): CSSObject => {
  switch (size) {
    case '100%': {
      return { width: '100%' };
    }
    case 'flex': {
      return { flex: 1 };
    }
    case 'auto':
    default: {
      return { display: 'inline' };
    }
  }
};
const alignment = ({ align }: InputStyleProps): CSSObject => {
  switch (align) {
    case 'end': {
      return { textAlign: 'right' };
    }
    case 'center': {
      return { textAlign: 'center' };
    }
    case 'start':
    default: {
      return { textAlign: 'left' };
    }
  }
};
const validation = ({ valid, theme }: { valid: ValidationStates; theme: Theme }): CSSObject => {
  switch (valid) {
    case 'valid': {
      return { boxShadow: `${theme.color.positive} 0 0 0 1px inset !important` };
    }
    case 'error': {
      return { boxShadow: `${theme.color.negative} 0 0 0 1px inset !important` };
    }
    case 'warn': {
      return {
        boxShadow: `${theme.color.warning} 0 0 0 1px inset`,
      };
    }
    case undefined:
    case null:
    default: {
      return {};
    }
  }
};

export const Input = styled(({ size, valid, align, ...props }) => <input {...props} />)<
  InputStyleProps
>({} as any, styles, sizes, alignment, validation, {
  minHeight: 32,
});
// (Input).styles = { ...styleResets, ...styles };
// (Input).sizes = sizes;
// (Input).alignment = alignment;
Input.displayName = 'Input';

export const Select = styled(({ size, valid, align, ...props }) => <select {...props} />)<
  InputStyleProps
>(styles, sizes, validation, {
  height: 32,
  userSelect: 'none',
  paddingRight: 20,
  appearance: 'menulist',
});
Select.displayName = 'Select';

export const Textarea = styled(({ size, valid, align, ...props }) => (
  <TextareaAutoResize {...props} />
))<InputStyleProps>(styles, sizes, alignment, validation, {
  overflow: 'visible',
});
Textarea.displayName = 'Textarea';

const ButtonStyled = styled(({ size, valid, align, ...props }) => <StyledButton {...props} />)<
  InputStyleProps
>(sizes, validation, {
  // Custom styling for color widget nested in buttons
  userSelect: 'none',
  overflow: 'visible',
  zIndex: 2,

  // overrides the default hover from Button
  '&:hover': {
    transform: 'none',
  },
});

export const Button: FunctionComponent<any> = props => (
  <ButtonStyled {...props} {...{ tertiary: true, small: true, inForm: true }} />
);
Button.displayName = 'Button';
