import React from 'react';
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

export const TextInput = styled.input(({ theme }) => ({
  height: 24,
  margin: '0 10px',
  boxSizing: 'border-box',
  background: 'transparent',
  color: 'transparent',
  border: '0 none',
  padding: theme.layoutMargin,
  paddingLeft: 0,
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',

  '&:focus': {
    outline: 0,
    borderBottom: `1px solid ${theme.highlightColor}`,
  },
}));

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
  marginBottom: '10px',
  gridTemplateColumns: '60px 1fr 1fr 60px',
  '& > *:nth-child(1)': {
    gridColumn: '1 / 3',
    marginLeft: 40,
    gridRow: '1',
  },
});

export const Row = styled.div(({ theme }) => ({
  padding: '15px 0',
  boxSizing: 'border-box',
  borderTop: theme.mainBorder,
  display: 'grid',
  placeItems: 'center / center',
  gridTemplateColumns: '60px 1fr 1fr 60px',
  '&:first-child': {
    borderTop: '0 none',
  },
  '&:hover': {
    button: {
      visibility: 'visible',
    },
  },
}));

export const HeaderItem = styled.div({
  fontWeight: 400,
  fontSize: 16,
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

  '&:hover, &:focus': {
    backgroundColor: theme.menuHighlightColor,
    color: theme.highlightColor,
    outline: '0 none',
    cursor: 'pointer',
  },
}));

const displayType = ({ colorTheme, theme }) => {
  switch (colorTheme) {
    case 'success': {
      return {
        '&:hover, &:focus': {
          color: theme.successColor,
          outline: '0 none',
          border: `1px solid ${theme.successColor}`,
          cursor: 'pointer',
        },
      };
    }
    case 'undo': {
      return {
        '&:hover, &:focus': {
          color: theme.failColor,
          outline: '0 none',
          border: `1px solid ${theme.failColor}`,
          cursor: 'pointer',
        },
      };
    }

    case 'edit': {
      return {
        visibility: 'hidden',
        '&:hover, &:focus': {
          color: theme.menuHighlightColor,
          outline: '0 none',
          visibility: 'visible',
          border: `1px solid ${theme.menuHighlightColor}`,
          cursor: 'pointer',
        },
      };
    }
    default: {
      return {};
    }
  }
};

export const IconButton = styled.button(displayType, {
  background: 'none',
  width: '34px',
  height: '34px',
  display: 'flex',
  borderRadius: '100px',
  justifyContent: 'center',
  border: '0 none',
  padding: 0,
  transition: 'all .2s ease',
  alignSelf: 'center',
  color: 'inherit',
  justifySelf: 'center',
  ...displayType,
});

export const Key = styled.div(({ theme }) => ({
  color: '#777',
  display: 'inline-block',
  background: '#eee',
  borderRadius: 4,
  boxShadow:
    'inset 0 0 25px #e8e8e8, 0 1px 0 #c3c3c3, 0 2px 0 #c9c9c9, 0 2px 3px #333, inset 1px 0 0 #ccc, inset -1px 0 0 #ccc',
  boxSizing: 'border-box',
  borderTop: theme.mainBorder,
  height: 41,
  margin: '0 1px',
  textAlign: 'center',
  minWidth: 44,
  width: 'auto',
  padding: '11px 5px 0 5px',
}));

export const KeyLabel = styled.div({
  display: 'inline-flex',
  margin: '5px',
});

export const Joiner = styled.div({
  verticalAlign: 'middle',
  alignSelf: 'center',
  margin: '0 5px',
});

export const Description = styled.div({
  display: 'inline-flex',
  margin: '0 10px 30px 10px',
  alignSelf: 'center',
});

export const Hotkeys = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifySelf: 'center',
});

export const HotKeyWrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 40px 40px',
});
export const ModalInputWrapper = styled.div({
  height: '185px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
});

export const ModalInnerWrapper = styled.div(({ theme }) => ({
  width: '400px',
  fontSize: 14,
  display: 'flex',
  flexDirection: 'column',
  padding: 10,
  fontFamily: theme.mainTextFace,
  color: theme.mainTextColor,
  background: theme.mainBackground,
  '& .modalClose': {
    cursor: 'pointer',
    height: 11,
    alignSelf: 'flex-end',
    padding: '7px',
    '&:hover': {
      color: theme.menuHighlightColor,
    },
  },
}));
