import React from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion';

import Rules from './Rules';

const Item = styled('li')({
  fontWeight: 600,
});
const ItemTitle = styled('span')({
  borderBottom: '1px solid rgb(130, 130, 130)',
  width: '100%',
  display: 'inline-block',
  paddingBottom: '4px',
  marginBottom: '4px',
});

function Element({ element, passes }) {
  const { any, all, none } = element;

  const rules = [...any, ...all, ...none];

  return (
    <Item>
      <ItemTitle>{element.target[0]}</ItemTitle>
      <Rules rules={rules} passes={passes} />
    </Item>
  );
}
Element.propTypes = {
  element: PropTypes.shape({
    any: PropTypes.array.isRequired,
    all: PropTypes.array.isRequired,
    none: PropTypes.array.isRequired,
  }).isRequired,
  passes: PropTypes.bool.isRequired,
};

/* eslint-disable react/no-array-index-key */
const Elements = ({ elements, passes }) => (
  <ol>
    {elements.map((element, index) => <Element passes={passes} element={element} key={index} />)}
  </ol>
);

Elements.propTypes = {
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      any: PropTypes.array.isRequired,
      all: PropTypes.array.isRequired,
      none: PropTypes.array.isRequired,
    })
  ).isRequired,
  passes: PropTypes.bool.isRequired,
};

export default Elements;
