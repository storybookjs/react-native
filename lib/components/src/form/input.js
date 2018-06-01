import styled from 'react-emotion';

import TextareaAutoResize from 'react-textarea-autosize';

const styles = ({ theme }) => ({
  padding: '0 10px',
  color: theme.mainTextColor,
  background: theme.barFill,
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

export const Input = styled('input')(styles, sizes, alignment, { minHeight: 32 });
Input.styles = styles;
Input.sizes = sizes;
Input.alignment = alignment;

export const Select = styled('select')(styles, sizes, alignment, {
  height: 32,
  userSelect: 'none',
  paddingRight: 20,
});
export const Textarea = styled(TextareaAutoResize)(styles, sizes, alignment, {
  minHeight: 32,
  paddingTop: 5,
  paddingBottom: 5,
  overflow: 'visible',
});

export const Button = styled('button')(styles, sizes, alignment, {
  cursor: 'pointer',
  userSelect: 'none',
});
