import Draggable from 'react-draggable';
import styled from '@emotion/styled';

const Handle = styled.div(
  ({ theme, isDragging }) => ({
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    color: isDragging ? theme.highlightColor : theme.mainBorderColor,

    overflow: 'hidden',
    transition:
      'color 0.2s linear, background-position 0.2s linear, background-size 0.2s linear, background 0.2s linear',
    '&:hover': {
      color: theme.highlightColor,
    },
  }),
  ({ axis }) => ({
    cursor: axis === 'x' ? 'col-resize' : 'row-resize',
  }),
  ({ theme, axis, offset }) =>
    axis === 'x'
      ? {
          height: '100%',
          width: theme.layoutMargin,
          marginLeft: offset ? -theme.layoutMargin / 2 : 0,
        }
      : {
          height: theme.layoutMargin,
          width: '100%',
          marginTop: offset ? -theme.layoutMargin / 2 : 0,
        },
  {
    '&:after': {
      content: '""',
      display: 'block',
      height: '2px',
      borderColor: 'currentColor',
    },
  },
  ({ theme, axis }) =>
    axis === 'x'
      ? {
          '&:after': {
            width: '2px',
            height: theme.layoutMargin * 2,
            borderLeft: '1px solid currentColor',
            borderRight: '1px solid currentColor',
          },
        }
      : {
          '&:after': {
            height: '2px',
            width: theme.layoutMargin * 2,
            borderTop: '1px solid currentColor',
            borderBottom: '1px solid currentColor',
          },
        },
  ({ shadow, isDragging }) => {
    if (shadow === 'top') {
      const style = {
        background: `radial-gradient(at center center,rgba(0,0,0,0.6) 0%,transparent 70%,transparent 100%)`,
        backgroundSize: '100% 50px',
        backgroundPosition: '50% 0',
        backgroundRepeat: 'no-repeat',
      };
      return isDragging
        ? style
        : {
            ...style,
            backgroundPosition: '50% 10px',
            '&:hover': style,
          };
    }
    if (shadow === 'left') {
      const style = {
        background: `radial-gradient(at center center,rgba(0,0,0,0.6) 0%,transparent 70%,transparent 100%)`,
        backgroundSize: '50px 100%',
        backgroundPosition: '0 50%',
        backgroundRepeat: 'no-repeat',
      };
      return isDragging
        ? style
        : {
            ...style,
            backgroundPosition: '10px 50%',
            '&:hover': style,
          };
    }
    return {};
  }
);

export { Draggable, Handle };
