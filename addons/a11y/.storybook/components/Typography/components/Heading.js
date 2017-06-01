import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';

const headings = {
  1: (<h1 />),
  2: (<h2 />),
  3: (<h3 />),
  4: (<h4 />),
};

function Heading({ level, children }) {
  return cloneElement(headings[level], {}, children)
}

Heading.propTypes = {
  level: PropTypes.oneOf([1, 2, 3, 4]),
  children: PropTypes.any,
};

Heading.defaultProps = {
  level: 1,
};

export default Heading;
