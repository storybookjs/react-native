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

export const KeyWrapper = styled.div({
  flexDirection: 'column',
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

export const TextInput = styled.input(({ theme }) => ({
  height: 24,
  margin: '0 10px',
  boxSizing: 'border-box',
  width: '100%',
  background: 'transparent',
  border: '0 none',
  color: theme.mainTextColor,
  padding: theme.layoutMargin,
  paddingLeft: 0,
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',

  '&:focus': {
    outline: 0,
    borderBottom: `1px solid ${theme.highlightColor}`,
  },
}));

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
  width: 44,
  paddingTop: 11,
}));

export const KeyLabel = styled.div({
  display: 'inline-flex',
  width: 150,
});

export const Row = styled.div(({ theme }) => ({
  padding: '15px 0',
  boxSizing: 'border-box',
  borderTop: theme.mainBorder,
  display: 'flex',
  '&:first-child': {
    borderTop: '0 none',
  },
}));

export const Joiner = styled.div({
  verticalAlign: 'middle',
  alignSelf: 'center',
  margin: '0 5px',
});

export const Description = styled.div({
  display: 'inline-flex',
  transition: 'color 70mx linear',
  width: 300,
  margin: '0 10px',
  alignSelf: 'center',
});

export const Upgrade = styled.div(({ theme }) => ({
  flex: 1,
  paddingTop: 20,
  marginTop: 20,
  borderTop: theme.mainBorder,
}));

export const EditButton = styled.button(({ theme }) => ({
  background: 'none',
  border: '0 none',
  padding: 0,
  alignSelf: 'middle',
  color: 'inherit',

  '&:hover': {
    color: theme.highlightColor,
    outline: '0 none',
    cursor: 'pointer',
  },
}));

export const Pre = styled.pre({
  overflow: 'auto',
  boxSizing: 'border-box',
  display: 'block',
});
