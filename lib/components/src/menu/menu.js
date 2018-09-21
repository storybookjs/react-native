import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Icons from '../icon/icon';
import { Popout } from './popout';

const text = {
  lineHeight: '14px',
  paddingTop: 9,
  paddingBottom: 9,
};

export const Title = styled.span(text, {
  flex: 1,
  paddingLeft: 10,
  paddingRight: 10,
});

export const Icon = ({ type }) => {
  if (type === '') {
    return <IconsWrapper />;
  }
  if (typeof type === 'string') {
    return (
      <IconsWrapper>
        <Icons icon={type} />
      </IconsWrapper>
    );
  }
  if (!type) {
    return null;
  }
  return <IconsWrapper>{type}</IconsWrapper>;
};
Icon.propTypes = {
  type: PropTypes.string,
};
Icon.defaultProps = {
  type: undefined,
};

const IconsWrapper = styled.span({
  height: 14,
  width: 14,
  marginLeft: 9,
  marginTop: 9,
  marginBottom: 8,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  position: 'relative',
  color: '#1ea7fd',
  '& > *': {
    margin: 'auto',
    height: '100%',
    width: '100%',
  },
});
export const Detail = styled.span(text, {
  textAlign: 'right',
  paddingRight: 10,
  color: '#999',
});

export const Item = styled.button({
  display: 'flex',
  height: 32,
  boxSizing: 'border-box',
  border: '0 none',
  borderBottom: '1px solid #eee',
  width: '100%',
  textAlign: 'left',
  padding: 0,
  background: 'none',

  '&:last-child': {
    borderBottom: '0 none',
  },

  '&:hover, &:focus': {
    outline: '0 none',
    background: '#1ea7fd',
    color: 'white',
  },
});

export const Badge = styled.span({
  background: '#e1ffd4',
  color: '#66bf3c',
  fontSize: 11,
  whiteSpace: 'nowrap',
  height: 20,
  lineHeight: '20px',
  paddingLeft: 14,
  paddingRight: 14,
  borderRadius: 10,
  margin: '6px 6px 6px 0',
});

export const List = styled.div({
  borderRadius: 4,
  overflow: 'hidden',
});

export { Popout };
