import React from 'react';
import PropTypes from 'prop-types';

const List = ({ items }) => (
  <ul style={{ fontFamily: 'Helvetica, Arial, sans-srif', fontSize: 16 }}>
    {items.map(item => <li key={item}>{item}</li>)}
  </ul>
);

List.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default List;
