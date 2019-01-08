/** @jsx jsx */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { jsx, keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import { Icons } from '@storybook/components';

export const Container = styled.div(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  width: '100%',
  overflow: 'auto',
  boxSizing: 'border-box',
  paddingTop: 2 * theme.layoutMargin,
  paddingBottom: 2 * theme.layoutMargin,
  paddingLeft: theme.layoutMargin,
  paddingRight: theme.layoutMargin,
}));

export const Jiggle = keyframes`
  from, 0%, 100% to{ transform:translate3d(0,0,0); }
  12.5%, 62.5% { transform:translate3d(-4px,0,0); }
  37.5%, 87.5% {  transform: translate3d(4px,0,0);  }
`;

export const Fade = keyframes`
0%,100% { opacity: 0; }
  50% { opacity: 1; }
`;

export const Title = styled.header(({ theme }) => ({
  display: 'block',
  flex: 1,
  paddingBottom: 20,
  marginBottom: 20,
  borderBottom: theme.mainBorder,
}));

export const TitleText = styled.span({
  fontSize: 30,
  display: 'inline-block',
  lineHeight: '40px',
  fontWeight: 700,
});

export const Wrapper = styled.div({
  display: 'flex',
  maxWidth: 600,
  margin: '0 auto',

  '@media screen and (max-width: 500px)': {
    display: 'block',
  },
});

export const Aside = styled.aside({
  width: 160,
});

export const Main = styled.main({
  flex: 1,
});

export const ExernalLink = ({ children, ...props }) => (
  <a target="_blank" rel="noopener noreferrer" {...props}>
    {children}
  </a>
);

export const TitleIcon = styled(Icons.Storybook)({
  height: 40,
  width: 'auto',
  display: 'inline-block',
  verticalAlign: 'top',
  marginRight: 10,
});

export const TextInput = styled.input(
  ({ colorTheme, theme }) =>
    colorTheme === 'error'
      ? {
          borderColor: `${theme.failColor}`,
          animation: `${Jiggle} 700ms ease-out`,
        }
      : {
          borderColor: 'rgba(0,0,0,0.05)',
        },
  ({ theme }) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    boxSizing: 'border-box',
    borderStyle: 'solid',
    padding: theme.layoutMargin,
    background: 'transparent',
    color: '#777',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: '0.3em',
    margin: '0 1px',
    '&:focus': {
      outline: 'none',
      borderWidth: 3,
    },
  })
);

export const Balloon = styled.span(
  ({ success, theme }) =>
    success
      ? {
          background: '#DAFFD1',
          color: '#4DC533',
        }
      : {
          background: theme.highlightColor,
          color: 'black',
        },
  {
    float: 'right',
    height: 40,
    boxSizing: 'border-box',
    padding: '10px 25px',
    borderRadius: 20,

    '@media screen and (max-width: 500px)': {
      float: 'none',
      marginTop: 10,
      display: 'block',
      textAlign: 'center',
    },
  }
);

export const FullChangeLogLink = styled(ExernalLink)(({ theme }) => ({
  float: 'right',
  fontWeight: 'normal',
  fontSize: 11,
  color: theme.dimmedTextColor,
}));

export const Heading = styled.h1({
  fontSize: 16,
});

export const Header = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

export const A = styled(ExernalLink)({
  color: 'inherit',
});

export const Footer = styled.div(({ theme }) => ({
  display: 'flex',
  flex: 1,
  paddingTop: 20,
  marginTop: 20,
  borderTop: theme.mainBorder,

  '& > *': {
    marginLeft: 20,
  },
  '& > *:first-child': {
    marginLeft: 0,
  },
}));

export const Upgrade = styled.div(({ theme }) => ({
  flex: 1,
  paddingTop: 20,
  marginTop: 20,
  borderTop: theme.mainBorder,
}));

export const Pre = styled.pre({
  overflow: 'auto',
  boxSizing: 'border-box',
  display: 'block',
});

// Shortcuts Components
export const ColWrapper = styled.div({
  flexDirection: 'column',
  display: 'flex',
  maxWidth: 600,
  margin: '0 auto',
});

export const GridWrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridAutoRows: 'minmax(75px, auto)',

  '@media screen and (max-width: 500px)': {
    gridTemplateColumns: '1fr',
  },
});

export const GridHeaderRow = styled.div({
  alignSelf: 'flex-end',
  display: 'grid',
  margin: 10,
  gridTemplateColumns: '1fr 1fr 10px',
  '& > *:last-of-type': {
    gridColumn: '2 / 2',
    justifySelf: 'flex-end',
    gridRow: '1',
  },
});

export const Row = styled.div(({ theme }) => ({
  padding: '15px 0',
  boxSizing: 'border-box',
  borderTop: theme.mainBorder,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 10px',
  '& > div:first-child': {
    borderTop: '0 none',
  },
  '&:hover': {
    button: {
      visibility: 'visible',
    },
  },
}));

export const HeaderItem = styled.div({
  fontSize: 18,
  fontWeight: 500,
});

export const Button = styled.button(({ theme }) => ({
  color: theme.menuHighlightColor,
  backgroundColor: theme.highlightColor,
  fontSize: 11,
  whiteSpace: 'nowrap',
  borderStyle: 'none',
  borderWidth: 0,
  padding: '5px 14px',
  borderRadius: 30,
  margin: '6px 6px 6px 0',
  transition: 'all .2s ease',
  cursor: 'pointer',
  '&:hover, &:focus': {
    backgroundColor: theme.menuHighlightColor,
    color: theme.highlightColor,
    outline: '0 none',
    cursor: 'pointer',
  },
}));

export const SuccessIcon = styled.div(
  ({ colorTheme, theme }) =>
    colorTheme === 'success'
      ? {
          color: theme.successColor,
          animation: `${Fade} 6s ease forwards`,
        }
      : {
          opacity: 0,
        },
  {
    background: 'none',
    width: '34px',
    height: '34px',
    alignSelf: 'flex-end',
    display: 'flex',
    justifyContent: 'center',
    border: '0 none',
    padding: 0,
    justifySelf: 'center',
  }
);

export const KeyLabel = styled.div({
  display: 'inline-flex',
  margin: '5px',
});

export const Description = styled.div({
  display: 'inline-flex',
  margin: '0 10px',
  alignSelf: 'center',
  fontSize: 16,
});

export const HotKeyWrapper = styled.div({
  height: '100%',
  width: '100%',
});

export const KeyInputWrapper = styled.div({
  position: 'relative',
  display: 'flex',
  width: 100,
  margin: '0 10px',
  flexDirection: 'column',
  justifySelf: 'flex-end',
});
