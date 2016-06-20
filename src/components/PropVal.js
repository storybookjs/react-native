import React from 'react';
import createFragment from 'react-addons-create-fragment';

const valueStyles = {
  func: {
    color: '#170',
  },

  attr: {
    color: '#666',
  },

  object: {
    color: '#666',
  },

  array: {
    color: '#666',
  },

  number: {
    color: '#a11',
  },

  string: {
    color: '#22a',
    wordBreak: 'break-word',
  },

  bool: {
    color: '#a11',
  },

  empty: {
    color: '#777',
  },
};

function previewArray(val) {
  const items = {};
  val.slice(0, 3).forEach((item, i) => {
    items[`n${i}`] = <PropVal val={item} nested />;
    items[`c${i}`] = ', ';
  });
  if (val.length > 3) {
    items.last = '…';
  } else {
    delete items[`c${val.length - 1}`];
  }
  return (
    <span style={valueStyles.array}>
      [{createFragment(items)}]
    </span>
  );
}

function previewObject(val) {
  const names = Object.keys(val);
  const items = {};
  names.slice(0, 3).forEach((name, i) => {
    items[`k${i}`] = <span style={valueStyles.attr}>{name}</span>;
    items[`c${i}`] = ': ';
    items[`v${i}`] = <PropVal val={val[name]} nested />;
    items[`m${i}`] = ', ';
  });
  if (names.length > 3) {
    items.rest = '…';
  } else {
    delete items[`m${names.length - 1}`];
  }
  return (
    <span style={valueStyles.object}>
      {'{'}{createFragment(items)}{'}'}
    </span>
  );
}

function previewProp(val) {
  if (typeof val === 'number') {
    return <span style={valueStyles.number}>{val}</span>;
  }
  if (typeof val === 'string') {
    if (val.length > 50) {
      val = val.slice(0, 50) + '…';
    }
    return <span style={valueStyles.string}>"{val}"</span>;
  }
  if (typeof val === 'boolean') {
    return <span style={valueStyles.bool}>{`${val}`}</span>;
  }
  if (Array.isArray(val)) {
    return previewArray(val);
  }
  if (!val) {
    return <span style={valueStyles.empty}>{`${val}`}</span>;
  }
  if (typeof val !== 'object') {
    return <span>…</span>;
  }

  return previewObject(val);
}

export default class PropVal extends React.Component {
  render() {
    return previewProp(this.props.val);
  }
}

module.exports = PropVal;
