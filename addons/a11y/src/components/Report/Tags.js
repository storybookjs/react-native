import React from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion';

const Wrapper = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  margin: '12px 0',
});

const Item = styled('div')({
  margin: '0 6px',
  padding: '5px',
  border: '1px solid rgb(234, 234, 234)',
  borderRadius: '2px',
  color: 'rgb(130, 130, 130)',
  fontSize: '12px',
});

function Tags({ tags }) {
  return <Wrapper>{tags.map(tag => <Item key={tag}>{tag}</Item>)}</Wrapper>;
}
Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default Tags;
