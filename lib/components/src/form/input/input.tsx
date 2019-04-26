import { styled, Theme } from '@storybook/theming';
import { withProps } from 'recompose';

import TextareaAutoResize from 'react-textarea-autosize';

import { Button as StyledButton } from '../../Button/Button';

const styleResets = {
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

const styles = ({ theme }: Theme) => ({
  ...styleResets,

  transition: 'all 200ms ease-out',
  color: theme.input.color || 'inherit',
  background: theme.input.background,
  boxShadow: `${theme.input.border} 0 0 0 1px inset`,
  borderRadius: theme.input.borderRadius,
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

const sizes = ({ size }: { size?: string | number }) => {
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
const alignment = ({ align }: { align: string }) => {
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
const validation = ({ valid, theme }: { valid: string; theme: Theme }) => {
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

export const Input = styled.input<any>(styles as any, sizes, alignment as any, validation, {
  minHeight: 32,
});
(Input as any).styles = { ...styleResets, ...styles };
(Input as any).sizes = sizes;
(Input as any).alignment = alignment;
Input.displayName = 'Input';

export const Select = styled.select(styles as any, sizes, validation, {
  height: 32,
  userSelect: 'none',
  paddingRight: 20,
  appearance: 'menulist',
} as any) as any;
Select.displayName = 'Select';

export const Textarea = styled(TextareaAutoResize)(
  styles as any,
  sizes,
  alignment as any,
  validation,
  {
    overflow: 'visible',
  }
) as any;
Textarea.displayName = 'Textarea';

export const Button = withProps({ tertiary: true, small: true, inForm: true })(
  styled(StyledButton)(sizes as any, validation as any, {
    // Custom styling for color widget nested in buttons
    userSelect: 'none',
    overflow: 'visible',
    zIndex: 2,

    // overrides the default hover from Button
    '&:hover': {
      transform: 'none',
    },
  })
) as any;
Button.displayName = 'Button';
