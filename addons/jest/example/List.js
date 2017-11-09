import React from 'react';

const List = ({ items }) => <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>;

List.defaultProps = {
  items: [],
};

export default List;
