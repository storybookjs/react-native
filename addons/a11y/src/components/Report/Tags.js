import React from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion';

const Wrapper = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  margin: '12px 0',
});

const Item = styled('div')(({ theme }) => ({
  margin: '0 6px',
  padding: '5px',
  border: theme.mainBorder,
  borderRadius: theme.mainBorderRadius,
}));

function Tags({ tags }) {
  return <Wrapper>{tags.map(tag => <Item key={tag}>{tag}</Item>)}</Wrapper>;
}
Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default Tags;
