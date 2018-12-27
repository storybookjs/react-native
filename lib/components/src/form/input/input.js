import styled from '@emotion/styled';

import TextareaAutoResize from 'react-textarea-autosize';

const styles = ({ theme }) => ({
  padding: '0 10px',
  color: theme.mainTextColor,
  background: theme.inputFill,
  borderRadius: theme.mainBorderRadius,

  transition: 'border-bottom-color .3s linear',
  border: '0 solid transparent',
  borderTop: '3px solid transparent',
  borderBottom: '3px solid transparent',
  boxSizing: 'border-box',
  position: 'relative',

  '&:focus': {
    outline: '0 none',
    borderBottomColor: theme.highlightColor,
  },
});
const sizes = ({ size }) => {
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
const alignment = ({ align }) => {
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
const validation = ({ valid, theme }) => {
  switch (valid) {
    case 'valid': {
      return { borderBottomColor: theme.successColor };
    }
    case 'error': {
      return { borderBottomColor: theme.failColor };
    }
    case 'warn': {
      return { borderBottomColor: theme.warnColor };
    }
    case undefined:
    case null:
    default: {
      return {};
    }
  }
};

export const Input = styled.input(styles, sizes, alignment, validation, { minHeight: 32 });
Input.styles = styles;
Input.sizes = sizes;
Input.alignment = alignment;
Input.displayName = 'Input';

export const Select = styled.select(styles, sizes, alignment, validation, {
  height: 32,
  userSelect: 'none',
  paddingRight: 20,
});
Select.displayName = 'Select';

export const Textarea = styled(TextareaAutoResize)(styles, sizes, alignment, validation, {
  minHeight: 32,
  paddingTop: 5,
  paddingBottom: 5,
  overflow: 'visible',
});
Textarea.displayName = 'Textarea';

export const Button = styled.button(styles, sizes, alignment, validation, {
  cursor: 'pointer',
  userSelect: 'none',
  minHeight: 32,
  boxSizing: 'border-box',
});
Button.displayName = 'Button';
